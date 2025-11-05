#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 ZERO-BUG BUILD - FINAL VERIFICATION\n');

// Test commands
const tests = [
  { name: 'TypeScript Check', cmd: 'npx tsc --noEmit', timeout: 60000 },
  { name: 'ESLint Check', cmd: 'npm run lint', timeout: 30000 },
  { name: 'Build Test', cmd: 'npm run build', timeout: 120000 },
  { name: 'Prisma Validate', cmd: 'npx prisma validate', timeout: 15000 },
];

const results = [];

for (const test of tests) {
  console.log(`\n📋 Running: ${test.name}`);
  console.log(`⏱️  Command: ${test.cmd}`);
  
  try {
    const startTime = Date.now();
    const output = execSync(test.cmd, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: test.timeout 
    });
    const duration = Date.now() - startTime;
    
    results.push({
      name: test.name,
      status: '✅ PASSED',
      duration: `${duration}ms`,
      output: output.substring(0, 200)
    });
    
    console.log(`✅ ${test.name} - PASSED (${duration}ms)`);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const output = error.stdout || error.message || 'Unknown error';
    
    results.push({
      name: test.name,
      status: '❌ FAILED',
      duration: `${duration}ms`,
      output: output.substring(0, 500)
    });
    
    console.log(`❌ ${test.name} - FAILED (${duration}ms)`);
    console.log(`📄 Output: ${output.substring(0, 200)}...`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('🎯 ZERO-BUG BUILD SUMMARY');
console.log('='.repeat(60));

results.forEach(result => {
  console.log(`${result.status} ${result.name} (${result.duration})`);
});

const passed = results.filter(r => r.status.includes('PASSED')).length;
const total = results.length;

console.log(`\n📊 Results: ${passed}/${total} tests passed`);

if (passed === total) {
  console.log('🎉 ALL TESTS PASSED - Zero-bug build achieved!');
} else {
  console.log('⚠️  Some tests failed - review details above');
}

// Save results
const reportPath = 'artifacts/fixes/07-build/final-test-results.json';
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📁 Detailed results saved to: ${reportPath}`);