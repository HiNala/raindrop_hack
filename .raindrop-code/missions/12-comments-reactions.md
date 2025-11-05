# Mission 12: Comments & Reactions

## Goal
Engaging but safe interaction system with proper social features.

## Tasks
1. **Threaded Comments System**
   - Implement parentId-based comment threading
   - Add edit/delete functionality with permissions
   - Create comment nesting with proper indentation
   - Add comment pagination for long threads

2. **Optimistic Interactions**
   - Instant UI updates for comment additions
   - Optimistic like button with count changes
   - Graceful rollback on server errors
   - Real-time count synchronization

3. **Safety & Rate Limiting**
   - Implement comment rate limiting per user
   - Add spam detection and filtering
   - Create appropriate toasts for rate limits
   - Add moderation tools for post owners

## Acceptance Criteria
- Zero double-submit scenarios
- Comment counts remain consistent across tabs
- Optimistic updates feel instant
- Rate limiting prevents abuse without annoying users
- Thread navigation is intuitive and clear

## Verification Steps
- Post comment and verify instant appearance
- Edit/delete comments and verify permissions
- Test rapid like/unlike across multiple tabs
- Trigger rate limits and verify user-friendly messages
- Test threading with nested replies
- Verify count synchronization after page refresh

## Files to Modify
- `src/components/engagement/CommentSection.tsx` - Main comments
- `src/components/engagement/CommentSystem.tsx` - Comment logic
- `src/components/engagement/LikeButton.tsx` - Reactions
- `src/app/api/comments/route.ts` - Comments API
- `src/app/api/posts/[id]/like/route.ts` - Like API
- `src/lib/rate-limiting.ts` - Rate limiting logic

## Implementation Notes
- Use WebSocket or polling for real-time updates
- Implement proper sanitization for user-generated content
- Add analytics for engagement metrics
- Ensure accessibility for comment forms and navigation
- Consider offline support for comment drafting