# Mission 10: User Settings (Account/Profile/Security/Notifications)

## Goal
Robust self-service settings management with comprehensive user control.

## Tasks
1. **Four-Tab Settings Structure**
   - Account: Email, password, deletion
   - Profile: Username, bio, avatar, social links
   - Security: MFA, sessions, 2FA backup codes
   - Notifications: Email preferences, push settings

2. **Enhanced Validation & UX**
   - Comprehensive Zod validation for all forms
   - Real-time username uniqueness checking
   - Avatar crop/upload with preview
   - Social media profile linking

3. **Session Management**
   - Clerk session list display
- Individual session revocation
   - "Sign out all devices" functionality
   - Active session indicators

## Acceptance Criteria
- All saves use optimistic updates with rollback
- Inline error messages are clear and actionable
- No full page navigations during settings changes
- Username conflicts detected in real-time
- Avatar upload includes proper validation

## Verification Steps
- Change username to already taken name → friendly error
- Upload invalid image format → proper validation error
- Revoke specific session → immediate effect
- Enable/disable MFA → smooth flow
- Change notification preferences → instant save
- Test social profile linking validation

## Files to Modify
- `src/app/(app)/settings/` - Settings pages structure
- `src/components/settings/SettingsLayout.tsx` - Tab navigation
- `src/components/settings/AccountSettingsForm.tsx` - Account management
- `src/components/settings/ProfileSettingsForm.tsx` - Profile editing
- `src/components/settings/SecuritySettingsForm.tsx` - Security features
- `src/components/settings/NotificationSettingsForm.tsx` - Preferences
- `src/app/api/settings/` - Settings API endpoints

## Implementation Notes
- Use React Hook Form with Zod for type-safe validation
- Implement proper file upload security for avatars
- Add audit logging for sensitive security changes
- Ensure accessibility compliance for all form controls
- Add comprehensive error handling and user feedback