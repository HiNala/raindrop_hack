#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running Lint and Type Check...\n');

// Try ESLint
try {
  console.log('Running ESLint...');
  const eslintResult = execSync('npx eslint src --ext .ts,.tsx --format=compact', { 
    encoding: 'utf8', 
    stdio: 'pipe',
    timeout: 30000 
  });
  console.log('ESLint Results:');
  console.log(eslintResult || '✅ No ESLint issues found');
} catch (error) {
  console.log('ESLint Issues:');
  console.log(error.stdout || error.message || '✅ No ESLint issues found');
}

console.log('\n' + '='.repeat(50) + '\n');

// Try TypeScript
try {
  console.log('Running TypeScript check...');
  const tscResult = execSync('npx tsc --noEmit', { 
    encoding: 'utf8', 
    stdio: 'pipe',
    timeout: 30000 
  });
  console.log('TypeScript Results:');
  console.log(tscResult || '✅ No TypeScript issues found');
} catch (error) {
  console.log('TypeScript Issues:');
  console.log(error.stdout || error.message || '✅ No TypeScript issues found');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Check completed!');