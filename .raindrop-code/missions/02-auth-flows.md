# Mission 2: Auth Flows (Sign-in/Up/Reset/Verify/MFA)

## Goal
Bulletproof Clerk authentication flows with seamless user experience.

## Tasks
1. **Custom Clerk themes**
   - Enhance existing Clerk appearance configuration
   - Add modal variants for sign-in/up flows
   - Implement consistent branding across all auth components

2. **Multi-method authentication support**
   - Email + magic link authentication
   - OAuth providers (Google, GitHub, etc.)
   - Email verification screen flow
   - MFA opt-in functionality with TOTP

3. **Error handling and redirects**
   - Friendly error messages for all auth states
   - Post-authentication redirect to `/dashboard`
   - Handle session expiration gracefully
   - No full page reloads during auth flows

## Acceptance Criteria
- Every authentication path completes successfully
- Errors are visible and user-friendly
- No full page reloads during auth process
- Redirects work correctly after authentication
- MFA setup and verification works seamlessly

## Verification Steps
- Test new user registration flow
- Test existing user sign-in with email
- Test OAuth provider authentication
- Test wrong password scenarios
- Test unverified email handling
- Test MFA enable/disable scenarios
- Test password reset flow
- Test email verification process

## Files to Modify
- `src/app/layout.tsx` - Enhance ClerkProvider configuration
- `src/app/sign-in/[[...sign-in]]/page.tsx` - Custom sign-in page
- `src/app/sign-up/[[...sign-up]]/page.tsx` - Custom sign-up page
- `src/middleware.ts` - Auth route protection
- `src/lib/auth.ts` - Auth utilities and helpers
- `src/components/auth/` - New auth components directory

## Implementation Notes
- Use Clerk's built-in modal components for seamless UX
- Implement proper error boundaries around auth components
- Add loading states during auth transitions
- Ensure accessibility compliance for all auth forms
- Test across different browsers and devices