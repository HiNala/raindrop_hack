# Mission 4: Onboarding NUX

## Goal
First-run guided experience for new users to complete their profiles.

## Tasks
1. **NUX Sheet Implementation**
   - Create onboarding flow that triggers for incomplete profiles
   - Design step-by-step profile completion wizard
   - Implement avatar, display name, and username setup

2. **Username Generation**
   - Create username suggestion algorithm
   - Implement real-time uniqueness checking
   - Add optimistic UI updates for instant feedback

3. **Profile Persistence**
   - Save progress at each step
   - Handle interruptions gracefully
   - Mark onboarding as completed

## Acceptance Criteria
- Complete NUX flow in under 60 seconds
- Profile data persists across reloads
- Username suggestions are relevant and available
- Real-time validation provides instant feedback
- Optimistic updates feel instant

## Verification Steps
- Create fresh account and complete onboarding
- Test username uniqueness validation
- Interrupt onboarding and resume successfully
- Test avatar upload and cropping
- Verify all required fields are validated
- Test profile completion redirect to dashboard

## Files to Modify
- `src/components/onboarding/` - New onboarding components
- `src/app/dashboard/page.tsx` - Add NUX trigger logic
- `src/lib/auth.ts` - Profile completion checking
- `src/app/api/settings/profile/route.ts` - Profile API endpoints
- `src/app/(app)/layout.tsx` - Add NUX provider

## Implementation Notes
- Use progressive disclosure to avoid overwhelming users
- Implement proper error handling for API failures
- Add keyboard shortcuts for power users
- Ensure accessibility compliance (ARIA labels, etc.)
- Add analytics tracking for onboarding completion rates