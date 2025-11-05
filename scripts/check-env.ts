#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks for required environment variables and exits non-zero on missing keys
 */

import { config } from 'dotenv'
import { existsSync } from 'fs'

// Load environment variables from .env.local
if (existsSync('.env.local')) {
  config({ path: '.env.local' })
} else if (existsSync('.env')) {
  config({ path: '.env' })
}

// Required environment variables with descriptions
const requiredEnvVars = {
  // Database
  'DATABASE_URL': {
    description: 'Neon PostgreSQL connection string',
    required: true,
    pattern: /^postgres:\/\//
  },
  
  // Clerk Authentication
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': {
    description: 'Clerk publishable key',
    required: true,
    pattern: /^pk_test_/
  },
  'CLERK_SECRET_KEY': {
    description: 'Clerk secret key',
    required: true,
    pattern: /^sk_test_/
  },
  
  // OpenAI
  'OPENAI_API_KEY': {
    description: 'OpenAI API key for AI generation',
    required: true,
    pattern: /^sk-proj-/
  },
  
  // UploadThing
  'UPLOADTHING_SECRET': {
    description: 'UploadThing secret for file uploads',
    required: true,
    pattern: /^sk_live_/
  },
  'UPLOADTHING_APP_ID': {
    description: 'UploadThing app ID',
    required: true,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  
  // Security
  'PREVIEW_SECRET': {
    description: 'Secret for preview links',
    required: true,
    minLength: 16
  },
  'CRON_SECRET': {
    description: 'Secret for cron job authentication',
    required: true,
    minLength: 16
  },
  
  // JWT
  'JWT_SECRET': {
    description: 'JWT secret for authentication',
    required: true,
    minLength: 32
  },
  
  // API URLs
  'NEXT_PUBLIC_API_URL': {
    description: 'API base URL',
    required: true,
    pattern: /^https?:\/\//
  }
}

// Optional but recommended environment variables
const optionalEnvVars = {
  // Rate Limiting
  'UPSTASH_REDIS_REST_URL': {
    description: 'Upstash Redis URL for rate limiting',
    required: false
  },
  'UPSTASH_REDIS_REST_TOKEN': {
    description: 'Upstash Redis token',
    required: false
  },
  
  // Email
  'RESEND_API_KEY': {
    description: 'Resend API key for emails',
    required: false,
    pattern: /^re_/
  },
  'FROM_EMAIL': {
    description: 'From email address for notifications',
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
}

// Feature flags (should be present but can be falsy)
const featureFlags = {
  'NEXT_PUBLIC_FF_SETTINGS': 'Settings feature flag',
  'NEXT_PUBLIC_FF_HN': 'Hacker News enrichment feature flag',
  'NEXT_PUBLIC_FF_SCHEDULE': 'Scheduling feature flag',
  'NEXT_PUBLIC_FF_ANALYTICS': 'Analytics feature flag'
}

// Check function
function checkEnvVar(key: string, config: any) {
  const value = process.env[key]
  const present = value !== undefined && value !== ''
  
  if (!present) {
    return { present, error: 'MISSING' }
  }
  
  // Pattern validation
  if (config.pattern && !config.pattern.test(value)) {
    return { present, error: 'INVALID_FORMAT' }
  }
  
  // Minimum length validation
  if (config.minLength && value.length < config.minLength) {
    return { present, error: 'TOO_SHORT' }
  }
  
  return { present, error: null }
}

// Main validation
function main() {
  console.log('🔍 Environment Validation Report\n')
  
  let hasErrors = false
  let errors: string[] = []
  
  // Check required variables
  console.log('📋 REQUIRED ENVIRONMENT VARIABLES:')
  console.log('─'.repeat(50))
  
  const requiredResults: any[] = []
  
  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const result = checkEnvVar(key, config)
    const status = result.present ? '✅' : '❌'
    const value = process.env[key] || ''
    const maskedValue = key.includes('SECRET') || key.includes('KEY') 
      ? value.substring(0, 8) + '...' 
      : value
    
    requiredResults.push({
      key,
      status,
      value: maskedValue,
      description: config.description,
      error: result.error
    })
    
    console.log(`${status} ${key}`)
    console.log(`   ${config.description}`)
    console.log(`   Value: ${maskedValue}`)
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`)
      hasErrors = true
      errors.push(`${key}: ${result.error}`)
    }
    
    console.log('')
  }
  
  // Check optional variables
  console.log('📝 OPTIONAL ENVIRONMENT VARIABLES:')
  console.log('─'.repeat(50))
  
  for (const [key, config] of Object.entries(optionalEnvVars)) {
    const result = checkEnvVar(key, config)
    const status = result.present ? '✅' : '⚠️'
    const value = process.env[key] || ''
    const maskedValue = key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN')
      ? value.substring(0, 8) + '...'
      : value || 'Not set'
    
    console.log(`${status} ${key}`)
    console.log(`   ${config.description}`)
    console.log(`   Value: ${maskedValue}`)
    
    if (result.error) {
      console.log(`   ⚠️ Warning: ${result.error}`)
    }
    
    console.log('')
  }
  
  // Check feature flags
  console.log('🚩 FEATURE FLAGS:')
  console.log('─'.repeat(50))
  
  for (const [key, description] of Object.entries(featureFlags)) {
    const value = process.env[key]
    const present = value !== undefined
    const status = present ? '✅' : '❌'
    const flagValue = value || 'false'
    
    console.log(`${status} ${key}`)
    console.log(`   ${description}`)
    console.log(`   Value: ${flagValue}`)
    
    if (!present) {
      hasErrors = true
      errors.push(`${key}: Missing feature flag`)
    }
    
    console.log('')
  }
  
  // Summary
  console.log('📊 SUMMARY:')
  console.log('─'.repeat(50))
  
  const requiredCount = Object.keys(requiredEnvVars).length
  const presentCount = requiredResults.filter(r => r.status === '✅').length
  
  console.log(`Required vars: ${presentCount}/${requiredCount} present`)
  console.log(`Feature flags: ${Object.keys(featureFlags).length}/${Object.keys(featureFlags).length} present`)
  
  if (hasErrors) {
    console.log('\n❌ VALIDATION FAILED')
    console.log('Errors found:')
    errors.forEach(error => console.log(`  - ${error}`))
    console.log('\nPlease fix the missing/invalid environment variables and try again.')
    process.exit(1)
  } else {
    console.log('\n✅ VALIDATION PASSED')
    console.log('All required environment variables are present and valid.')
  }
}

// Run the validation
if (require.main === module) {
  main()
}

export { main as checkEnv }