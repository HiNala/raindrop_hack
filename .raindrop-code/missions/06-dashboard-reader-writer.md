# Mission 6: Dashboard (Reader / Writer)

## Goal
Cohesive home page for content creators with reader and writer modes.

## Tasks
1. **Dashboard Tab Structure**
   - Reader tabs: For You, Following, Saved
   - Writer tabs: Drafts, Scheduled, Published
   - Implement smooth tab switching without redundant refetching

2. **Content Filtering & Sorting**
   - Add filters by tags, date ranges
   - Implement sorting options (recency, views, engagement)
   - Create persistent filter state

3. **Side-panel Preview**
   - Add post preview panel with actions
   - Include Edit, Share, Analytics buttons
   - Implement smooth panel animations

## Acceptance Criteria
- Tab switching doesn't trigger unnecessary API calls
- Filters and sort options work smoothly
- Preview panel never causes layout jank
- Content loads efficiently with proper caching
- Responsive design works on all screen sizes

## Verification Steps
- Switch between all dashboard tabs rapidly
- Apply different filters and sort combinations
- Open/close preview panel repeatedly
- Test with slow network connections
- Check memory usage for leaks
- Verify responsive behavior on mobile

## Files to Modify
- `src/app/dashboard/page.tsx` - Main dashboard component
- `src/components/dashboard/Dashboard.tsx` - Dashboard logic
- `src/components/dashboard/ReaderView.tsx` - Reader mode
- `src/components/dashboard/WriterView.tsx` - Writer mode
- `src/components/dashboard/DashboardPostCard.tsx` - Post cards
- `src/components/dashboard/PreviewPanel.tsx` - Side panel

## Implementation Notes
- Use React Query or SWR for efficient data fetching
- Implement proper loading states and error boundaries
- Add analytics for dashboard usage patterns
- Ensure keyboard navigation works throughout
- Test with large datasets for performance