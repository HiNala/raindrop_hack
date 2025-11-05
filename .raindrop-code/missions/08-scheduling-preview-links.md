# Mission 8: Scheduling & Preview Links

## Goal
Publish posts later without surprises and enable secure preview sharing.

## Tasks
1. **Scheduling System**
   - Add schedule tab in publish sheet
   - Implement timezone picker with user detection
   - Create cron/queue checker for scheduled publishing
   - Add scheduled posts management dashboard

2. **Preview Links**
   - Generate secret signed preview URLs
   - Implement preview authentication via tokens
   - Add revoke controls for preview links
   - Support preview for both drafts and scheduled posts

3. **Publishing Automation**
   - Create background job for scheduled publishing
   - Add error handling and retry logic
   - Implement notifications for successful/failed publishes
   - Add manual override options

## Acceptance Criteria
- Posts auto-publish within 60 seconds of scheduled time
- Preview links work for logged-out users
- Preview links can be revoked instantly
- Scheduling handles timezone changes correctly
- Failed publishes trigger proper notifications

## Verification Steps
- Schedule a post for near future and verify auto-publish
- Test preview link sharing with external users
- Revoke preview link and verify access is denied
- Test scheduling across different timezones
- Force publish failure and verify error handling
- Test manual publish override for scheduled posts

## Files to Modify
- `src/components/editor/SchedulePublish.tsx` - Scheduling UI
- `src/app/api/cron/publish-scheduled/route.ts` - Publishing endpoint
- `src/app/preview/[token]/page.tsx` - Preview page
- `src/lib/actions/schedule-actions.ts` - Scheduling logic
- `src/lib/actions/preview-actions.ts` - Preview token management
- `src/components/dashboard/WriterView.tsx` - Show scheduled posts

## Implementation Notes
- Use JWT or similar for secure preview tokens
- Implement proper cleanup for expired preview links
- Add analytics for preview link usage
- Ensure scheduling survives server restarts
- Add retry logic with exponential backoff for failures