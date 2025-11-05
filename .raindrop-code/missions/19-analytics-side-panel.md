# Mission 19: Analytics (Owner Side Panel)

## Goal
Actionable, unobtrusive metrics dashboard for content creators.

## Tasks
1. **Analytics Trigger Implementation**
   - Add "Analytics" pill on owner post cards
   - Implement side panel that opens on click
   - Ensure analytics only show for post owners
   - Add loading states for data fetching

2. **Data Visualization**
   - Create sparkline charts for last 30 days (views/reads)
   - Display referrer breakdown table
   - Show HN enrichment usage flag
   - Add key metrics cards with trend indicators

3. **Performance Optimization**
   - Ensure analytics panel loads in under 300ms
   - Implement caching for frequently accessed data
   - Add non-blocking data fetching
   - Optimize chart rendering performance

## Acceptance Criteria
- Analytics panel loads quickly with cached data
- Charts render smoothly without blocking UI
- Only post owners can view their analytics
- Data is accurate and updates in near real-time
- Panel doesn't impact main app performance

## Verification Steps
- Open/close analytics panel repeatedly
- Test performance with large datasets
- Verify permission checks (non-owners can't access)
- Check data accuracy across different time periods
- Test memory usage with extended use
- Verify responsive behavior on mobile

## Files to Modify
- `src/components/post/PostCard.tsx` - Add analytics trigger
- `src/components/analytics/AnalyticsPanel.tsx` - Main panel
- `src/components/analytics/AnalyticsClient.tsx` - Data fetching
- `src/components/analytics/Charts/` - Chart components
- `src/app/api/analytics/` - Analytics API endpoints
- `src/lib/analytics.ts` - Analytics utilities and caching

## Implementation Notes
- Use charting library like Recharts or Chart.js
- Implement proper data aggregation for performance
- Add privacy controls for analytics data
- Consider real-time updates with WebSocket
- Add export functionality for analytics data
- Ensure accessibility compliance for charts