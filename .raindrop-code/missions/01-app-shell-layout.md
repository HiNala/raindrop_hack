# Mission 1: App Shell & Layout Guardrails

## Goal
Stable, consistent shell for all pages.

## Tasks
1. **Normalize header/footer/shell**
   - Ensure sticky header behavior
   - Add reserved space for toasts
   - Set main content area to use `min-h-[100dvh] pt-header pb-safety`

2. **Add global ErrorBoundary/Loading templates**
   - Create error boundary components per route segment
   - Add loading templates that match final layout
   - Ensure proper fallback states

3. **Layout consistency**
   - Standardize paddings across all layouts
   - Ensure consistent spacing patterns
   - Remove any hardcoded dimensions

## Acceptance Criteria
- No CLS (Cumulative Layout Shift)
- No content overlap between header and main content
- Consistent paddings across all pages
- Error boundaries catch and display errors gracefully
- Loading states match final content layout

## Verification Steps
- Resize browser from 320px to 1440px width
- Navigate rapidly between different routes
- Check for no visual jumps or layout shifts
- Test error states by triggering errors
- Verify loading states appear smooth

## Files to Modify
- `src/app/layout.tsx` - Root layout improvements
- `src/components/layout/Header.tsx` - Sticky header implementation
- `src/app/loading.tsx` - Global loading template
- `src/app/not-found.tsx` - 404 page improvements
- `src/app/(app)/layout.tsx` - App layout consistency
- `src/app/(marketing)/layout.tsx` - Marketing layout consistency

## Implementation Notes
- Use CSS custom properties for header height variables
- Implement proper error boundary with fallback UI
- Ensure loading skeletons match actual content structure
- Test across different device sizes and orientations