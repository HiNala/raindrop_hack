# Mission 16: Performance & Prefetch

## Goal
Achieve 90+ Lighthouse scores on both desktop and mobile.

## Tasks
1. **Code Splitting & Lazy Loading**
   - Code-split heavy panels (editor tools, analytics)
   - Implement route prefetch on viewport intersection
   - Add dynamic imports for non-critical components
   - Use `content-visibility: auto` for long lists

2. **Image Optimization**
   - Add proper `sizes` attributes to images
   - Implement responsive image loading
   - Add blur-up placeholders for images
   - Use Next.js Image component everywhere

3. **Performance Monitoring**
   - Target LCP < 2.5s, CLS < 0.1
   - Eliminate hydration warnings
   - Add performance monitoring and alerting
   - Implement Core Web Vitals tracking

## Acceptance Criteria
- Lighthouse score ≥90 on desktop and mobile
- LCP (Largest Contentful Paint) < 2.5s
- CLS (Cumulative Layout Shift) < 0.1
- No hydration warnings in console
- Smooth performance across all devices

## Verification Steps
- Run LHCI on homepage, dashboard, and post pages
- Test performance on slow 3G networks
- Monitor Core Web Vitals in production
- Test with large datasets for memory usage
- Verify prefetch behavior improves navigation speed
- Check bundle size impact of code splitting

## Files to Modify
- `next.config.js` - Performance optimizations
- `src/app/layout.tsx` - Prefetching strategies
- `src/components/` - Add lazy loading where appropriate
- `src/lib/hooks/usePrefetch.ts` - Prefetch logic
- `src/components/ui/OptimizedImage.tsx` - Image optimization
- `lighthouserc.json` - Performance testing configuration

## Implementation Notes
- Use Next.js built-in performance optimizations
- Implement proper caching strategies
- Add bundle analysis to build process
- Monitor real-world performance metrics
- Consider service worker for offline functionality