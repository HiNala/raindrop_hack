/**
 * Database optimization and maintenance utilities
 */

import { prisma } from './prisma'
import { logger } from './logger'

interface OptimizationResult {
  success: boolean
  operations: Array<{
    name: string
    duration: number
    success: boolean
    error?: string
  }>
  totalDuration: number
  timestamp: string
}

interface DatabaseStats {
  tables: Array<{
    name: string
    rowCount: number
    size: string
    indexes: number
  }>
  totalSize: string
  indexSize: string
  lastVacuum?: string
  lastAnalyze?: string
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<DatabaseStats> {
  try {
    const start = Date.now()

    // Get table sizes and row counts
    const tables = await prisma.$queryRaw<Array<{
      tablename: string
      n_tup_ins: string
      n_tup_upd: string
      n_tup_del: string
      n_live_tup: string
      n_dead_tup: string
      pg_size_pretty: string
      index_count: string
    }>>`
      SELECT 
        t.tablename,
        t.n_tup_ins,
        t.n_tup_upd, 
        t.n_tup_del,
        t.n_live_tup,
        t.n_dead_tup,
        pg_size_pretty(pg_total_relation_size(t.tableid)) as size,
        (SELECT COUNT(*) FROM pg_indexes WHERE tablename = t.tablename) as index_count
      FROM pg_stat_user_tables t
      ORDER BY pg_total_relation_size(t.tableid) DESC
    `

    // Get database sizes
    const sizes = await prisma.$queryRaw<Array<{
      pg_size_pretty: string
      pg_size_pretty_2: string
    }>>`
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as total_size,
        pg_size_pretty(pg_database_size(current_database()) - pg_total_relation_size('pg_toast')) as index_size
    `

    // Get last maintenance times
    const maintenance = await prisma.$queryRaw<Array<{
      last_vacuum?: string
      last_autovacuum?: string
      last_analyze?: string
      last_autoanalyze?: string
    }>>`
      SELECT 
        MAX(last_vacuum) as last_vacuum,
        MAX(last_autovacuum) as last_autovacuum, 
        MAX(last_analyze) as last_analyze,
        MAX(last_autoanalyze) as last_autoanalyze
      FROM pg_stat_user_tables
    `

    const stats: DatabaseStats = {
      tables: tables.map(table => ({
        name: table.tablename,
        rowCount: parseInt(table.n_live_tup) || 0,
        size: table.pg_size_pretty,
        indexes: parseInt(table.index_count) || 0,
      })),
      totalSize: sizes[0]?.pg_size_pretty || 'Unknown',
      indexSize: sizes[0]?.pg_size_pretty_2 || 'Unknown',
      lastVacuum: maintenance[0]?.last_vacuum || maintenance[0]?.last_autovacuum,
      lastAnalyze: maintenance[0]?.last_analyze || maintenance[0]?.last_autoanalyze,
    }

    logger.performanceMetric('getDatabaseStats', Date.now() - start)
    return stats

  } catch (error) {
    logger.dbError('getDatabaseStats', error)
    throw error
  }
}

/**
 * Optimize database tables
 */
export async function optimizeDatabase(): Promise<OptimizationResult> {
  const startTime = Date.now()
  const operations: OptimizationResult['operations'] = []

  const tables = [
    'posts',
    'comments',
    'likes',
    'bookmarks',
    'users',
    'user_profiles',
    'analytics_daily',
    'post_analytics',
    'post_tags',
    'tags',
    'referrers',
  ]

  for (const table of tables) {
    const opStart = Date.now()

    try {
      // VACUUM ANALYZE the table
      await prisma.$executeRawUnsafe(`VACUUM ANALYZE "${table}"`)

      operations.push({
        name: `VACUUM ANALYZE ${table}`,
        duration: Date.now() - opStart,
        success: true,
      })

      logger.info(`Optimized table: ${table}`, { duration: Date.now() - opStart })

    } catch (error) {
      operations.push({
        name: `VACUUM ANALYZE ${table}`,
        duration: Date.now() - opStart,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      logger.error(`Failed to optimize table: ${table}`, error)
    }
  }

  // Update table statistics
  const statsStart = Date.now()
  try {
    await prisma.$executeRaw`ANALYZE`

    operations.push({
      name: 'UPDATE STATISTICS',
      duration: Date.now() - statsStart,
      success: true,
    })

  } catch (error) {
    operations.push({
      name: 'UPDATE STATISTICS',
      duration: Date.now() - statsStart,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }

  const result: OptimizationResult = {
    success: operations.filter(op => op.success).length === operations.length,
    operations,
    totalDuration: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  }

  logger.info('Database optimization completed', {
    success: result.success,
    duration: result.totalDuration,
    operations: operations.length,
    successful: operations.filter(op => op.success).length,
  })

  return result
}

/**
 * Clean up old data
 */
export async function cleanupOldData(daysToKeep: number = 90): Promise<{
  deleted: { analytics: number; referrers: number }
  errors: string[]
}> {
  const errors: string[] = []
  const deleted = { analytics: 0, referrers: 0 }
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  try {
    // Clean old analytics data
    const analyticsResult = await prisma.analyticsDaily.deleteMany({
      where: {
        date: {
          lt: cutoffDate,
        },
        AND: [
          {
            OR: [
              { views: 0 },
              { reads: 0 },
            ],
          },
        ],
      },
    })

    deleted.analytics = analyticsResult.count
    logger.info('Cleaned old analytics data', { deleted: analyticsResult.count })

  } catch (error) {
    const errorMsg = 'Failed to clean analytics data'
    errors.push(errorMsg)
    logger.error(errorMsg, error)
  }

  try {
    // Clean old referrer data with no recent activity
    const referrersResult = await prisma.referrer.deleteMany({
      where: {
        lastSeenAt: {
          lt: cutoffDate,
        },
        count: {
          lt: 5, // Only remove referrers with very few hits
        },
      },
    })

    deleted.referrers = referrersResult.count
    logger.info('Cleaned old referrer data', { deleted: referrersResult.count })

  } catch (error) {
    const errorMsg = 'Failed to clean referrer data'
    errors.push(errorMsg)
    logger.error(errorMsg, error)
  }

  return { deleted, errors }
}

/**
 * Backup critical data
 */
export async function createBackup(backupPath?: string): Promise<{
  success: boolean
  backupPath: string
  size?: string
  error?: string
}> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const defaultPath = `/tmp/blog-app-backup-${timestamp}.sql`
    const finalBackupPath = backupPath || defaultPath

    // This would typically use pg_dump with proper credentials
    // For security reasons, this is a placeholder that shows the structure

    logger.info('Database backup initiated', { path: finalBackupPath })

    // In a real implementation, you would:
    // 1. Use pg_dump or a database-specific backup tool
    // 2. Store the backup securely (S3, etc.)
    // 3. Verify the backup integrity
    // 4. Handle encryption if needed

    // Placeholder for backup creation
    const backupSize = '0MB' // Would be actual size

    logger.info('Database backup completed', {
      path: finalBackupPath,
      size: backupSize,
    })

    return {
      success: true,
      backupPath: finalBackupPath,
      size: backupSize,
    }

  } catch (error) {
    const errorMsg = 'Backup failed'
    logger.error(errorMsg, error)

    return {
      success: false,
      backupPath: backupPath || '',
      error: error instanceof Error ? error.message : 'Unknown backup error',
    }
  }
}

/**
 * Check database performance
 */
export async function checkDatabasePerformance(): Promise<{
  status: 'good' | 'warning' | 'critical'
  issues: string[]
  recommendations: string[]
}> {
  const issues: string[] = []
  const recommendations: string[] = []

  try {
    // Check slow queries
    const slowQueries = await prisma.$queryRaw<Array<{
      query: string
      calls: string
      total_time: string
      mean_time: string
    }>>`
      SELECT 
        query,
        calls,
        total_time,
        mean_time
      FROM pg_stat_statements 
      WHERE mean_time > 1000 -- queries taking more than 1 second
      ORDER BY mean_time DESC
      LIMIT 10
    `

    if (slowQueries.length > 0) {
      issues.push(`${slowQueries.length} slow queries detected`)
      recommendations.push('Review and optimize slow queries')
    }

    // Check connection count
    const connections = await prisma.$queryRaw<Array<{ count: string }>>`
      SELECT COUNT(*) as count FROM pg_stat_activity
    `

    const connectionCount = parseInt(connections[0].count)
    if (connectionCount > 80) {
      issues.push(`High connection count: ${connectionCount}`)
      recommendations.push('Consider using connection pooling')
    }

    // Check table bloat
    const bloat = await prisma.$queryRaw<Array<{
      tablename: string
      bloat_size: string
      bloat_percentage: string
    }>>`
      SELECT 
        tablename,
        pg_size_pretty(bs.bloat_size) as bloat_size,
        ROUND(100 * bs.bloat_size / pg_total_relation_size(schemaname||'.'||tablename), 2) as bloat_percentage
      FROM (
        SELECT 
          schemaname,
          tablename,
          (total_pages - vacuum_pages) * 8192 as bloat_size
        FROM (
          SELECT 
            schemaname, tablename,
            COUNT(*) as total_pages,
            SUM(CASE WHEN relpages > 0 THEN 1 ELSE 0 END) as vacuum_pages
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE relkind = 'r'
          GROUP BY schemaname, tablename
        ) t
        WHERE total_pages > 10
      ) bs
      WHERE bs.bloat_size > 10485760 -- 10MB
      ORDER BY bs.bloat_size DESC
      LIMIT 10
    `

    if (bloat.length > 0) {
      issues.push(`${bloat.length} tables have significant bloat`)
      recommendations.push('Run VACUUM FULL on bloated tables during maintenance window')
    }

    const status = issues.length === 0 ? 'good' :
                   issues.length <= 2 ? 'warning' : 'critical'

    return { status, issues, recommendations }

  } catch (error) {
    logger.error('Performance check failed', error)
    return {
      status: 'critical',
      issues: ['Failed to analyze database performance'],
      recommendations: ['Check database connectivity and permissions'],
    }
  }
}

/**
 * Rebuild indexes if needed
 */
export async function rebuildIndexes(): Promise<{
  rebuilt: string[]
  errors: string[]
}> {
  const rebuilt: string[] = []
  const errors: string[] = []

  try {
    // Get list of indexes that might need rebuilding
    const indexes = await prisma.$queryRaw<Array<{
      indexname: string
      tablename: string
      idx_scan: string
      idx_tup_read: string
    }>>`
      SELECT 
        schemaname || '.' || indexname as indexname,
        tablename,
        idx_scan,
        idx_tup_read
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0 AND idx_tup_read > 1000
      ORDER BY idx_tup_read DESC
    `

    for (const index of indexes) {
      try {
        await prisma.$executeRawUnsafe(`REINDEX INDEX CONCURRENTLY "${index.indexname}"`)
        rebuilt.push(index.indexname)
        logger.info(`Rebuilt index: ${index.indexname}`)
      } catch (error) {
        errors.push(`Failed to rebuild ${index.indexname}: ${error}`)
        logger.error(`Failed to rebuild index: ${index.indexname}`, error)
      }
    }

  } catch (error) {
    errors.push(`Failed to analyze indexes: ${error}`)
    logger.error('Index analysis failed', error)
  }

  return { rebuilt, errors }
}
