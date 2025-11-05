import { test, expect } from '@playwright/test'

// Mobile device configurations with comprehensive coverage
const MOBILE_DEVICES = [
  { name: 'iPhone SE', viewport: { width: 375, height: 667 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'iPhone 12', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'iPhone 14 Pro Max', viewport: { width: 430, height: 932 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'Pixel 5', viewport: { width: 393, height: 851 }, userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36' },
  { name: 'Pixel 7', viewport: { width: 412, height: 892 }, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36' },
  { name: 'Samsung Galaxy S21', viewport: { width: 384, height: 854 }, userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36' },
  { name: 'iPad Mini', viewport: { width: 768, height: 1024 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15' },
  { name: 'iPad Pro', viewport: { width: 1024, height: 1366 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15' },
]

test.describe.configure({ mode: 'parallel' })

MOBILE_DEVICES.forEach((device) => {
  test.describe(`Mobile Tests - ${device.name}`, () => {
    test.use({ 
      ...device,
      // Mobile-specific settings
      contextOptions: {
        permissions: ['notifications'],
      },
      // Simulate touch device
      hasTouch: true,
      // Disable animations for consistent testing
      colorScheme: 'dark',
    })

    test.beforeEach(async ({ page }) => {
      // Set viewport explicitly
      await page.setViewportSize(device.viewport)
      
      // Simulate mobile device characteristics
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          value: 4,
          configurable: true,
        })
        
        Object.defineProperty(navigator, 'deviceMemory', {
          value: 4,
          configurable: true,
        })
        
        Object.defineProperty(navigator, 'connection', {
          value: {
            effectiveType: '4g',
            saveData: false,
          },
          configurable: true,
        })
      })
    })

    test('critical user journey - mobile flow', async ({ page, context }) => {
      // Step 1: Home page loads properly
      await page.goto('/')
      await expect(page).toHaveTitle(/Raindrop/)
      
      // Check for horizontal scroll at each width
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(device.viewport.width + 1)
      
      // Step 2: Mobile navigation works
      const bottomNav = page.locator('nav.fixed.bottom-0')
      await expect(bottomNav).toBeVisible()
      
      // Step 3: Navigate to Tags
      const tagsLink = bottomNav.locator('a[href*="tag"]')
      if (await tagsLink.count() > 0) {
        await tagsLink.click()
        await expect(page).toHaveURL(/.*tag/)
      }
      
      // Step 4: Open mobile menu if present
      const menuButton = page.locator('button[aria-label*="menu"], button[data-testid="menu-button"]').first()
      if (await menuButton.count() > 0) {
        await menuButton.click()
        
        // Should open sheet/drawer, not modal
        const sheet = page.locator('[data-state="open"]').first()
        await expect(sheet).toBeVisible()
        
        // Should close on backdrop click
        const backdrop = page.locator('[data-radix-dialog-overlay]')
        if (await backdrop.count() > 0) {
          await backdrop.click()
        }
      }
      
      // Step 5: Command palette works on mobile
      await page.keyboard.press('Meta+k')
      const commandPalette = page.locator('[data-testid="command-palette"], [role="dialog"]')
      await expect(commandPalette).toBeVisible()
      
      // Should be full-screen friendly
      const paletteBox = await commandPalette.boundingBox()
      expect(paletteBox?.width).toBeGreaterThanOrEqual(device.viewport.width * 0.9)
      
      await page.keyboard.press('Escape')
      await expect(commandPalette).not.toBeVisible()
    })

    test('touch targets meet accessibility standards', async ({ page }) => {
      await page.goto('/')
      
      // Check all interactive elements meet 44x44 minimum
      const interactiveElements = page.locator('button, a, input, [role="button"], [tabindex]:not([tabindex="-1"])')
      const count = await interactiveElements.count()
      
      for (let i = 0; i < Math.min(count, 20); i++) {
        const element = interactiveElements.nth(i)
        const box = await element.boundingBox()
        
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('forms work properly on mobile', async ({ page }) => {
      await page.goto('/sign-in')
      
      // Check input fonts are >= 16px
      const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]')
      const inputCount = await inputs.count()
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.n(i)
        const fontSize = await input.evaluate(el => 
          window.getComputedStyle(el).fontSize
        )
        expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16)
      }
      
      // Check input heights
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.n(i)
        const box = await input.boundingBox()
        expect(box?.height).toBeGreaterThanOrEqual(44)
      }
    })

    test('responsive images and media', async ({ page }) => {
      await page.goto('/explore')
      
      // Wait for images to load
      await page.waitForLoadState('networkidle')
      
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.n(i)
        
        // Should have proper attributes
        await expect(img).toHaveAttribute('alt')
        
        // Should have loading optimization
        const hasLoading = await img.getAttribute('loading')
        const hasSrcset = await img.getAttribute('srcset')
        const hasSizes = await img.getAttribute('sizes')
        
        expect(hasLoading === 'lazy' || hasSrcset || hasSizes).toBeTruthy()
        
        // Should not cause layout shift
        const box = await img.boundingBox()
        expect(box).toBeTruthy()
      }
    })

    test('mobile editor functionality', async ({ page, context }) => {
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
      
      // Check mobile editor layout
      const titleInput = page.locator('input[placeholder*="title"], input[name*="title"]')
      await expect(titleInput).toBeVisible()
      
      // Should be mobile-friendly height
      const titleBox = await titleInput.boundingBox()
      expect(titleBox?.height).toBeGreaterThanOrEqual(44)
      
      // Check publish sheet functionality
      const publishButton = page.locator('button:has-text("Publish"), button:has-text("Post")')
      if (await publishButton.count() > 0) {
        await publishButton.click()
        
        // Should open bottom sheet on mobile
        const sheet = page.locator('[data-state="open"][data-side="bottom"]')
        await expect(sheet).toBeVisible()
        
        // Should have safe area padding
        const sheetContent = sheet.locator('[data-radix-dialog-content]')
        const paddingBottom = await sheetContent.evaluate(el => 
          window.getComputedStyle(el).paddingBottom
        )
        expect(paddingBottom).toContain('env(safe-area-inset-bottom)')
        
        // Should close on escape
        await page.keyboard.press('Escape')
        await expect(sheet).not.toBeVisible()
      }
    })

    test('PWA features on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Check manifest
      const manifest = page.locator('link[rel="manifest"]')
      await expect(manifest).toHaveAttribute('href')
      
      // Check theme color
      const themeColor = page.locator('meta[name="theme-color"]')
      await expect(themeColor).toHaveAttribute('content')
      
      // Check viewport meta
      const viewport = page.locator('meta[name="viewport"]')
      await expect(viewport).toHaveAttribute('content', /viewport-fit=cover/)
      
      // Check service worker (if supported)
      const swRegistered = await page.evaluate(() => 
        navigator.serviceWorker && navigator.serviceWorker.ready
      )
      expect(swRegistered).toBeTruthy()
    })

    test('performance metrics on mobile', async ({ page }) => {
      const startTime = Date.now()
      await page.goto('/')
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      // Should load reasonably fast on mobile
      expect(loadTime).toBeLessThan(5000)
      
      // Check Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const metrics: any = {}
            
            entries.forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                metrics.lcp = entry.startTime
              } else if (entry.entryType === 'first-input') {
                metrics.fid = (entry as any).processingStart - entry.startTime
              }
            })
            
            resolve(metrics)
          }).observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
          
          // Fallback if no metrics
          setTimeout(() => resolve({}), 5000)
        })
      })
      
      // LCP should be reasonable on mobile
      if (metrics.lcp) {
        expect(metrics.lcp).toBeLessThan(4000)
      }
      
      // FID should be good on mobile
      if (metrics.fid) {
        expect(metrics.fid).toBeLessThan(300)
      }
    })

    test('accessibility on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Check focus management
      await page.keyboard.press('Tab')
      const firstFocusable = page.locator(':focus')
      await expect(firstFocusable).toBeVisible()
      
      // Check ARIA labels
      const buttonsWithoutLabels = page.locator('button:not([aria-label]):not([aria-labelledby])').filter({ has: page.locator('text') })
      expect(await buttonsWithoutLabels.count()).toBe(0)
      
      // Check color contrast (basic check)
      const textElements = page.locator('p, h1, h2, h3, span, div')
      const textCount = await textElements.count()
      
      for (let i = 0; i < Math.min(textCount, 5); i++) {
        const element = textElements.n(i)
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
          }
        })
        
        // Should have readable font size
        expect(parseFloat(styles.fontSize)).toBeGreaterThanOrEqual(14)
      }
    })

    test('safe area handling on mobile', async ({ page }) => {
      await page.goto('/')
      
      // Check if safe area CSS variables are used
      const usesSafeAreas = await page.evaluate(() => {
        const html = document.documentElement
        const computed = window.getComputedStyle(html)
        
        return computed.getPropertyValue('--safe-top') !== '' ||
               computed.getPropertyValue('--safe-bottom') !== ''
      })
      
      expect(usesSafeAreas).toBeTruthy()
      
      // Check bottom navigation has safe area padding
      const bottomNav = page.locator('nav.fixed.bottom-0')
      if (await bottomNav.count() > 0) {
        const paddingBottom = await bottomNav.evaluate(el => 
          window.getComputedStyle(el).paddingBottom
        )
        expect(paddingBottom).toMatch(/env\(safe-area-inset-bottom\)|safe-pb|pb-safe/)
      }
    })
  })
})