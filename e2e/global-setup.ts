import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E Test Global Setup');
  
  // Set up test database if needed
  if (process.env.NODE_ENV !== 'test') {
    console.log('📊 Setting up test database...');
    // Here you would set up a test database, seed data, etc.
  }

  // Take a screenshot of the homepage for visual comparison baseline
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto(config.webServer?.url || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: path.join(config.outputDir || 'test-results/', 'baseline-homepage.png'),
      fullPage: true 
    });
    console.log('📸 Baseline screenshot captured');
  } catch (error) {
    console.warn('⚠️ Could not capture baseline screenshot:', error);
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed');
  
  return config;
}

export default globalSetup;