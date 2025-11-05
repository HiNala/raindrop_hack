# Mission 14: Loading UX & Optimistic UI

## Goal
Instant feedback that makes the app feel responsive and fast.

## Tasks
1. **Route Loading Templates**
   - Create `loading.tsx` files that match final layout
   - Implement skeleton screens for all major components
   - Add shimmer effects and smooth animations
   - Ensure loading states are contextually relevant

2. **Optimistic UI Updates**
   - Implement optimistic create/update operations
   - Add instant visual feedback for user actions
   - Create rollback mechanisms for server failures
   - Ensure consistency between optimistic and actual states

3. **Performance Optimization**
   - Target perceived latency under 100ms
   - Eliminate flicker during state transitions
   - Add proper loading indicators for async operations
   - Implement smart caching strategies

## Acceptance Criteria
- Perceived latency is under 100ms for most actions
- No flicker or jarring transitions during loading
- Optimistic updates provide instant feedback
- Rollback on errors is smooth and clear
- Loading skeletons match actual content structure

## Verification Steps
- Test HN toggle for instant feedback
- Save settings and verify optimistic updates
- Create draft posts and check immediate UI response
- Test rollback scenarios with network failures
- Verify loading skeletons match content layout
- Test performance across different network speeds

## Files to Modify
- `src/app/loading.tsx` - Global loading state
- All route `loading.tsx` files for context-specific loading
- `src/components/ui/LoadingSkeleton.tsx` - Enhanced skeletons
- `src/components/ui/OptimisticWrapper.tsx` - Optimistic updates
- `src/lib/hooks/useOptimistic.ts` - Custom optimistic hook
- Update all action handlers for optimistic behavior

## Implementation Notes
- Use CSS custom properties for consistent loading animations
- Implement proper error boundaries around optimistic updates
- Add analytics for perceived performance metrics
- Ensure accessibility compliance for loading states
- Test with slow networks to verify graceful degradation