/**
 * Centralized logging utility
 * Replaces all console statements with structured logging
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogContext {
  userId?: string
  requestId?: string
  route?: string
  [key: string]: any
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry

    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    if (context && Object.keys(context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(context)}`
    }

    if (error) {
      formatted += ` | Error: ${error.name}: ${error.message}`
      if (error.stack && this.isDevelopment) {
        formatted += `\nStack: ${error.stack}`
      }
    }

    return formatted
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    }

    // Log to console in development
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry)

      switch (level) {
        case 'error':
          console.error(formatted)
          break
        case 'warn':
          console.warn(formatted)
          break
        case 'info':
          console.info(formatted)
          break
        case 'debug':
          console.debug(formatted)
          break
      }
    }

    // In production, you would send to a logging service
    if (this.isProduction) {
      // TODO: Send to Sentry, LogRocket, or other logging service
      // For now, only log errors to console
      if (level === 'error') {
        console.error(JSON.stringify(entry))
      }
    }
  }

  error(message: string, context?: LogContext | Error, errorContext?: LogContext) {
    if (context instanceof Error) {
      this.log('error', message, errorContext, context)
    } else {
      this.log('error', message, context)
    }
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  // Structured logging methods
  apiError(route: string, error: Error, context?: LogContext) {
    this.error(`API Error in ${route}`, error, { route, ...context })
  }

  authError(message: string, userId?: string, context?: LogContext) {
    this.error(`Auth Error: ${message}`, { userId, ...context })
  }

  dbError(operation: string, error: Error, context?: LogContext) {
    this.error(`Database Error during ${operation}`, error, { operation, ...context })
  }

  performanceMetric(operation: string, duration: number, context?: LogContext) {
    this.info(`Performance: ${operation} took ${duration}ms`, { operation, duration, ...context })
  }
}

export const logger = new Logger()
export default logger
