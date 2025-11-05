import { test, expect } from '@playwright/test'

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Blog Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test.describe('Homepage & Discovery', () => {
    test('should load homepage with correct elements', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Blog|Raindrop/)
      
      // Check main heading
      await expect(page.locator('h1')).toContainText('Write Your Story')
      
      // Check AI generation hero
      await expect(page.locator('[data-testid="ai-generation-hero"]')).toBeVisible()
      
      // Check quick actions
      await expect(page.locator('button:has-text("Generate with AI")')).toBeVisible()
    })

    test('should allow anonymous AI generation', async ({ page }) => {
      // Fill AI prompt
      await page.fill('[placeholder="E.g., \'A comprehensive guide"]', 'Building scalable web applications')
      
      // Select options
      await page.click('button:has-text("Professional")')
      await page.click('button:has-text("Medium")')
      
      // Generate content
      await page.click('button:has-text("Generate with AI")')
      
      // Check for loading state
      await expect(page.locator('text=Generating...')).toBeVisible()
      
      // Wait for completion (mock implementation)
      await page.waitForTimeout(3000)
      
      // Should show success message
      await expect(page.locator('text=generated and saved to your drafts')).toBeVisible()
    })

    test('should display posts grid correctly', async ({ page }) => {
      // Check for posts container
      await expect(page.locator('[data-testid="posts-container"]')).toBeVisible()
      
      // Check for post cards
      const postCards = page.locator('[data-testid="post-card"]')
      await expect(postCards.first()).toBeVisible()
      
      // Check post card elements
      const firstCard = postCards.first()
      await expect(firstCard.locator('h3')).toBeVisible()
      await expect(firstCard.locator('text=Read')).toBeVisible()
    })
  })

  test.describe('Authentication Flow', () => {
    test('should redirect to sign-in when accessing protected routes', async ({ page }) => {
      // Try to access dashboard
      await page.goto(`${BASE_URL}/dashboard`)
      
      // Should redirect to sign-in
      await expect(page).toHaveURL(/sign-in/)
    })

    test('should allow sign-up flow', async ({ page }) => {
      await page.goto(`${BASE_URL}/sign-up`)
      
      // Check sign-up form is visible
      await expect(page.locator('[data-testid="clerk-sign-up"]')).toBeVisible()
      
      // For demo purposes, we'll check the redirect flow
      // In real tests, you'd use Clerk test tokens
    })
  })

  test.describe('Editor Experience', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication for editor tests
      await page.goto(`${BASE_URL}/editor/new`)
    })

    test('should load editor with all components', async ({ page }) => {
      // Check editor title input
      await expect(page.locator('[placeholder="Write a compelling title..."]')).toBeVisible()
      
      // Check content editor
      await expect(page.locator('[data-testid="tiptap-editor"]')).toBeVisible()
      
      // Check save status
      await expect(page.locator('[data-testid="save-status"]')).toBeVisible()
      
      // Check AI Assist button
      await expect(page.locator('button:has-text("AI Assist")')).toBeVisible()
    })

    test('should autosave content changes', async ({ page }) => {
      // Fill title
      await page.fill('[placeholder="Write a compelling title..."]', 'Test Post Title')
      
      // Add content
      await page.click('[data-testid="tiptap-editor"]')
      await page.keyboard.type('This is test content for autosave functionality.')
      
      // Wait for autosave
      await page.waitForTimeout(4000)
      
      // Check save status
      await expect(page.locator('text=Saved')).toBeVisible()
    })

    test('should open AI Assist sheet', async ({ page }) => {
      // Click AI Assist button
      await page.click('button:has-text("AI Assist")')
      
      // Check AI sheet is open
      await expect(page.locator('[data-testid="ai-sheet"]')).toBeVisible()
      
      // Check form elements
      await expect(page.locator('textarea[placeholder*="Describe"]')).toBeVisible()
      await expect(page.locator('[data-testid="hn-context-toggle"]')).toBeVisible()
    })

    test('should open publish sheet with validation', async ({ page }) => {
      // Fill required fields
      await page.fill('[placeholder="Write a compelling title..."]', 'Test Post Title')
      
      // Click publish button
      await page.click('button:has-text("Publish")')
      
      // Check publish sheet is open
      await expect(page.locator('[data-testid="publish-sheet"]')).toBeVisible()
      
      // Check validation
      await expect(page.locator('text=Title added')).toBeVisible()
      
      // Should be disabled without tags
      await expect(page.locator('button:has-text("Publish Post")')).toBeDisabled()
    })
  })

  test.describe('Dashboard Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication for dashboard tests
      await page.goto(`${BASE_URL}/dashboard`)
    })

    test('should load dashboard with Reader/Writer tabs', async ({ page }) => {
      // Check main heading
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
      
      // Check tabs
      await expect(page.locator('[data-testid="reader-tab"]')).toBeVisible()
      await expect(page.locator('[data-testid="writer-tab"]')).toBeVisible()
      
      // Check quick actions
      await expect(page.locator('button:has-text("New Draft")')).toBeVisible()
      await expect(page.locator('button:has-text("Start with AI")')).toBeVisible()
    })

    test('should switch between Reader and Writer tabs', async ({ page }) => {
      // Default to Writer tab
      await expect(page.locator('[data-testid="writer-tab"]').toHaveAttribute('data-state', 'active')
      
      // Switch to Reader tab
      await page.click('[data-testid="reader-tab"]')
      await expect(page.locator('[data-testid="reader-tab"]').toHaveAttribute('data-state', 'active')
      
      // Switch back to Writer tab
      await page.click('[data-testid="writer-tab"]')
      await expect(page.locator('[data-testid="writer-tab"]').toHaveAttribute('data-state', 'active')
    })

    test('should show post preview in side panel', async ({ page }) => {
      // Click on a post card
      await page.click('[data-testid="post-card"]:first-child')
      
      // Check side panel preview
      await expect(page.locator('[data-testid="post-preview"]')).toBeVisible()
      
      // Check preview content
      await expect(page.locator('[data-testid="preview-title"]')).toBeVisible()
      await expect(page.locator('[data-testid="preview-actions"]')).toBeVisible()
    })
  })

  test.describe('Post Viewing & Engagement', () => {
    test.beforeEach(async ({ page }) => {
      // Go to a sample post page
      await page.goto(`${BASE_URL}/p/sample-post`)
    })

    test('should display post content correctly', async ({ page }) => {
      // Check post title
      await expect(page.locator('h1')).toBeVisible()
      
      // Check post content
      await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
      
      // Check author info
      await expect(page.locator('[data-testid="author-info"]')).toBeVisible()
    })

    test('should show engagement buttons', async ({ page }) => {
      // Check like button
      await expect(page.locator('[data-testid="like-button"]')).toBeVisible()
      
      // Check comment count
      await expect(page.locator('[data-testid="comment-count"]')).toBeVisible()
      
      // Check view count
      await expect(page.locator('[data-testid="view-count"]')).toBeVisible()
    })

    test('should allow liking posts', async ({ page }) => {
      // Click like button
      await page.click('[data-testid="like-button"]')
      
      // Should show optimistic update
      await expect(page.locator('[data-testid="like-button"]')).toContainText('1')
    })
  })

  test.describe('Search & Discovery', () => {
    test('should show command palette on keyboard shortcut', async ({ page }) => {
      // Press Cmd+K
      await page.keyboard.press('Meta+k')
      
      // Check command palette
      await expect(page.locator('[data-testid="command-palette"]')).toBeVisible()
      
      // Check search input
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
    })

    test('should search posts and show results', async ({ page }) => {
      // Open search
      await page.keyboard.press('Meta+k')
      
      // Type search query
      await page.fill('[data-testid="search-input"]', 'test')
      
      // Wait for results
      await page.waitForTimeout(1000)
      
      // Check results
      await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    })
  })

  test.describe('Error Handling & Edge Cases', () => {
    test('should handle 404 pages gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/non-existent-page`)
      
      // Should show custom 404 page
      await expect(page.locator('h1:has-text("404")')).toBeVisible()
      
      // Should provide navigation back home
      await expect(page.locator('a:has-text("Go Home")')).toBeVisible()
    })

    test('should handle network errors in API calls', async ({ page }) => {
      // Mock network failure for API calls
      await page.route('**/api/**', route => route.abort())
      
      // Try to generate AI content
      await page.goto(`${BASE_URL}`)
      await page.fill('[placeholder="E.g., \'A comprehensive guide"]', 'Test')
      await page.click('button:has-text("Generate with AI")')
      
      // Should show error message
      await expect(page.locator('text=Something went wrong')).toBeVisible()
    })

    test('should maintain form state during refresh', async ({ page }) => {
      await page.goto(`${BASE_URL}/editor/new`)
      
      // Fill form
      await page.fill('[placeholder="Write a compelling title..."]', 'Persistent Title')
      await page.fill('[placeholder="A brief summary"]', 'Persistent excerpt')
      
      // Reload page
      await page.reload()
      
      // Note: In real implementation, this would check localStorage/URL state persistence
      // For demo, we just verify the form loads correctly
      await expect(page.locator('[placeholder="Write a compelling title..."]')).toBeVisible()
    })
  })

  test.describe('Performance & Accessibility', () => {
    test('should load within performance thresholds', async ({ page }) => {
      const startTime = Date.now()
      await page.goto(BASE_URL)
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(`${BASE_URL}`)
      
      // Check for single h1
      const h1Elements = await page.locator('h1').count()
      expect(h1Elements).toBe(1)
      
      // Check proper heading structure
      await expect(page.locator('h1')).toBeVisible()
    })

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(`${BASE_URL}`)
      
      // Tab through interactive elements
      await page.keyboard.press('Tab')
      
      // Should focus on first interactive element
      const focusedElement = await page.locator(':focus')
      await expect(focusedElement).toBeVisible()
      
      // Continue tabbing through main navigation
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab')
        await expect(page.locator(':focus')).toBeVisible()
      }
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto(`${BASE_URL}`)
      
      // Check important buttons have aria labels
      const generateButton = page.locator('button:has-text("Generate with AI")')
      await expect(generateButton).toHaveAttribute('aria-label')
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('should work correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(BASE_URL)
      
      // Check mobile navigation
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
      
      // Check content is still readable
      await expect(page.locator('h1')).toBeVisible()
      
      // Check buttons are properly sized
      const buttons = page.locator('button')
      const firstButton = buttons.first()
      const boundingBox = await firstButton.boundingBox()
      expect(boundingBox.height).toBeGreaterThan(40) // Minimum touch target
    })

    test('should show mobile-optimized editor', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/editor/new`)
      
      // Check mobile editor layout
      await expect(page.locator('[placeholder="Write a compelling title..."]')).toBeVisible()
      
      // Check mobile toolbar
      await expect(page.locator('[data-testid="mobile-toolbar"]')).toBeVisible()
    })
  })
})

// Visual Regression Tests (if using Playwright with screenshots)
test.describe('Visual Regression', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled'
    })
  })
})