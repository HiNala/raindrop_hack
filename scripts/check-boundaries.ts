#!/usr/bin/env node

/**
 * Server/Client Boundary Check Script
 * Identifies server components that might be passing event handlers to client components
 */

import fs from 'fs'
import path from 'path'

const srcDir = './src'

function findFiles(dir, extension) {
  let results = []
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, extension))
    } else if (file.endsWith(extension)) {
      results.push(fullPath)
    }
  }
  
  return results
}

function isClientComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return content.includes("'use client'") || content.includes('"use client"')
  } catch (error) {
    return false
  }
}

function checkServerClientBoundaries() {
  console.log('🔍 Server/Client Boundary Analysis')
  console.log('=====================================\n')
  
  const tsxFiles = findFiles(srcDir, '.tsx')
  const serverComponents = []
  const clientComponents = []
  const potentialIssues = []
  
  // Classify components
  for (const file of tsxFiles) {
    if (isClientComponent(file)) {
      clientComponents.push(file)
    } else {
      serverComponents.push(file)
    }
  }
  
  console.log(`📊 Component Analysis:`)
  console.log(`  Server Components: ${serverComponents.length}`)
  console.log(`  Client Components: ${clientComponents.length}`)
  console.log('')
  
  // Check server components for potential issues
  for (const serverComp of serverComponents) {
    try {
      const content = fs.readFileSync(serverComp, 'utf8')
      
      // Check for onClick in server components
      if (content.includes('onClick')) {
        potentialIssues.push({
          file: serverComp,
          issue: 'onClick handler found in server component',
          severity: 'high'
        })
      }
      
      // Check for useState in server components
      if (content.includes('useState')) {
        potentialIssues.push({
          file: serverComp,
          issue: 'React hooks found in server component',
          severity: 'high'
        })
      }
      
      // Check for event handlers
      const eventHandlers = ['onChange', 'onSubmit', 'onFocus', 'onBlur']
      for (const handler of eventHandlers) {
        if (content.includes(handler) && !content.includes('asChild')) {
          potentialIssues.push({
            file: serverComp,
            issue: `Event handler ${handler} found in server component`,
            severity: 'medium'
          })
        }
      }
      
      // Check for missing 'use client' when using client-only imports
      const clientOnlyImports = [
        'useState', 'useEffect', 'useRef', 'useCallback',
        'framer-motion', 'lucide-react', '@radix-ui',
        'sonner', 'next/navigation'
      ]
      
      for (const clientImport of clientOnlyImports) {
        if (content.includes(clientImport)) {
          potentialIssues.push({
            file: serverComp,
            issue: `Client-only import found: ${clientImport}`,
            severity: 'medium'
          })
        }
      }
      
    } catch (error) {
      console.log(`Could not read ${serverComp}: ${error.message}`)
    }
  }
  
  // Report issues
  if (potentialIssues.length === 0) {
    console.log('✅ No server/client boundary issues found')
  } else {
    console.log('⚠️  Potential Issues Found:')
    console.log('')
    
    const highIssues = potentialIssues.filter(i => i.severity === 'high')
    const mediumIssues = potentialIssues.filter(i => i.severity === 'medium')
    
    if (highIssues.length > 0) {
      console.log('🚨 HIGH PRIORITY:')
      highIssues.forEach(issue => {
        console.log(`  ❌ ${issue.file}`)
        console.log(`     ${issue.issue}`)
        console.log('')
      })
    }
    
    if (mediumIssues.length > 0) {
      console.log('⚠️  MEDIUM PRIORITY:')
      mediumIssues.forEach(issue => {
        console.log(`  ⚠️  ${issue.file}`)
        console.log(`     ${issue.issue}`)
        console.log('')
      })
    }
  }
  
  // Check for common patterns that might cause the error
  console.log('🔧 Common Patterns to Check:')
  console.log('  - Server components rendering Button with onClick')
  console.log('  - Link components with onClick handlers')
  console.log('  - Form components with onSubmit in server context')
  console.log('  - Components that should be marked "use client"')
  console.log('')
  
  return {
    serverComponents: serverComponents.length,
    clientComponents: clientComponents.length,
    issues: potentialIssues
  }
}

// Run the check
if (require.main === module) {
  const result = checkServerClientBoundaries()
  
  if (result.issues.length > 0) {
    console.log(`❌ Found ${result.issues.length} potential boundary issues`)
    process.exit(1)
  } else {
    console.log('✅ Server/client boundaries are clean')
    process.exit(0)
  }
}

export { checkServerClientBoundaries }