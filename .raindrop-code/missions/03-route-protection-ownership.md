# Mission 3: Route Protection & Ownership

## Goal
Never render private content publicly and ensure proper ownership controls.

## Tasks
1. **Middleware route matching**
   - Enhance existing middleware for comprehensive route protection
   - Define public vs private route patterns
   - Handle authentication redirects properly

2. **Server-side auth checks**
   - Add `auth()` checks in all API routes
   - Implement 403 page for unauthorized access
   - Validate session on every protected endpoint

3. **Ownership validation**
   - Implement `ownerId === userId` checks on all mutations
   - Add ownership verification for post operations
   - Secure profile and settings endpoints

## Acceptance Criteria
- Deep-linking to private routes prompts sign-in
- Unauthorized access returns 403, not 404
- API calls without proper session return 401/403
- Ownership checks prevent cross-user data access
- All sensitive operations are protected

## Verification Steps
- Access protected routes while signed out
- Hit API endpoints with invalid/expired sessions
- Try to access other users' content
- Test ownership validation on post edits/deletes
- Verify settings pages are properly protected
- Test API calls with manipulated user IDs

## Files to Modify
- `src/middleware.ts` - Enhanced route protection
- `src/app/api/` - Add auth checks to all API routes
- `src/app/(app)/` - Add route group protection
- `src/lib/auth.ts` - Server-side auth utilities
- `src/app/(app)/settings/` - Settings protection
- `src/lib/security.ts` - Ownership validation functions

## Implementation Notes
- Use consistent error response format across APIs
- Add proper logging for security events
- Implement rate limiting for auth endpoints
- Use TypeScript to enforce auth parameter types
- Add comprehensive test coverage for security scenarios