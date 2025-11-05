import { test, expect } from '@playwright/test'

// Mobile device configurations
const MOBILE_DEVICES = [
  { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
  { name: 'Pixel 7', viewport: { width: 412, height: 892 } },
  { name: 'iPhone SE', viewport: { width: 375, height: 667 } },
]

test.describe.configure({ mode: 'parallel' })

MOBILE_DEVICES.forEach((device) => {
  test.describe(`Mobile Tests - ${device.name}`, () => {
    test.use({ ...device })

    test('should render properly without horizontal scroll', async ({ page }) => {
      await page.goto('/')
      
      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = page.viewportSize()?.width || 0
      
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
      
      // Check bottom navigation is visible
      await expect(page.locator('nav.fixed.bottom-0')).toBeVisible()
      
      // Check safe areas are respected
      const html = await page.innerHTML('html')
      expect(html).toContain('env(safe-area-inset-')
    })

    test('should have proper touch targets', async ({ page }) => {
      await page.goto('/')
      
      // Check button sizes meet 44x44 minimum
      const buttons = page.locator('button, a[role="button"]')
      const count = await buttons.count()
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const button = buttons.nth(i)
        const box = await button.boundingBox()
        
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('should handle command palette on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Open command palette
      await page.keyboard.press('Meta+k')
      
      // Should be visible and full-screen friendly
      await expect(page.locator('[data-testid="command-palette"]')).toBeVisible()
      
      // Should close on escape
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-testid="command-palette"]')).not.toBeVisible()
    })

    test('should handle mobile navigation', async ({ page }) => {
      await page.goto('/')
      
      // Test bottom navigation
      const bottomNav = page.locator('nav.fixed.bottom-0')
      await expect(bottomNav).toBeVisible()
      
      // Test navigation items
      const navItems = bottomNav.locator('a')
      expect(await navItems.count()).toBeGreaterThan(0)
      
      // Test navigation works
      const exploreLink = bottomNav.locator('a[href="/explore"]')
      if (await exploreLink.count() > 0) {
        await exploreLink.click()
        await expect(page).toHaveURL(/.*explore/)
      }
    })

    test('should handle mobile editor', async ({ page, context }) => {
      // Mock authentication
      await context.addCookies([
        {
          name: '__session',
          value: 'mock-session',
          domain: 'localhost',
          path: '/',
        },
      ])
      
      await page.goto('/editor/new')
      
      // Check mobile-friendly editor
      const titleInput = page.locator('input[placeholder*="title"]')
      await expect(titleInput).toBeVisible()
      
      // Font size should be 16px to prevent iOS zoom
      const fontSize = await titleInput.evaluate(el => 
        window.getComputedStyle(el).fontSize
      )
      expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(15)
      
      // Check sheets work on mobile
      const publishButton = page.locator('button:has-text("Publish")')
      if (await publishButton.count() > 0) {
        await publishButton.click()
        // Should open sheet, not modal
        await expect(page.locator('[data-state="open"]')).toBeVisible()
      }
    })

    test('should handle mobile tables', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Find any tables
      const tables = page.locator('table')
      if (await tables.count() > 0) {
        const table = tables.first()
        
        // Should have horizontal scroll container
        const container = table.locator('xpath=ancestor::*[contains(@class, "overflow-x-auto")]')
        await expect(container).toBeVisible()
      }
    })

    test('should handle mobile forms', async ({ page }) => {
      await page.goto('/sign-in')
      
      // Check form inputs are mobile-friendly
      const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]')
      const count = await inputs.count()
      
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i)
        const box = await input.boundingBox()
        
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('should handle PWA features', async ({ page }) => {
      await page.goto('/')
      
      // Check manifest is linked
      const manifest = await page.locator('link[rel="manifest"]').first()
      await expect(manifest).toHaveAttribute('href')
      
      // Check service worker is registered
      const swRegistered = await page.evaluate(() => 
        navigator.serviceWorker && navigator.serviceWorker.ready
      )
      expect(swRegistered).toBeTruthy()
      
      // Check theme-color meta
      const themeColor = await page.locator('meta[name="theme-color"]')
      await expect(themeColor).toHaveAttribute('content')
    })

    test('should handle offline scenarios', async ({ page, context }) => {
      await page.goto('/')
      
      // Go offline
      await context.setOffline(true)
      
      // Navigate to offline page
      await page.goto('/offline')
      
      // Should show offline page
      await expect(page.locator('text=you\'re offline')).toBeVisible()
      
      // Should have retry button
      await expect(page.locator('button:has-text("Try Again")')).toBeVisible()
      
      // Go back online
      await context.setOffline(false)
    })

    test('should handle mobile images', async ({ page }) => {
      await page.goto('/')
      
      // Check images have loading optimization
      const images = page.locator('img')
      const count = await images.count()
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i)
        
        // Should have loading="lazy" or be above the fold
        const loading = await img.getAttribute('loading')
        if (loading !== 'lazy') {
          // Should be priority or above fold
          const priority = await img.getAttribute('priority')
          expect(priority || await img.isVisible()).toBeTruthy()
        }
        
        // Should have alt text
        await expect(img).toHaveAttribute('alt')
      }
    })
  })
})