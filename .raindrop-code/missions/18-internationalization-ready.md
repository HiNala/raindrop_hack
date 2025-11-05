# Mission 18: Internationalization-Ready (Minimal)

## Goal
Future-proof copy management with minimal i18n foundation.

## Tasks
1. **String Extraction**
   - Extract all user-facing strings to dictionary
   - Create simple string replacement system
   - Implement locale-based string lookup
   - Add placeholder for English and future languages

2. **Date & Number Formatting**
   - Format dates with locale awareness
   - Implement number formatting for different locales
   - Add relative time formatting with locale support
   - Ensure date/time inputs work internationally

3. **RTL-Safe Foundation**
   - Use logical properties (margin-inline, padding-inline)
   - Ensure layout doesn't break with RTL text
   - Test with pseudo-locale (accented characters)
   - Add direction switching capability

## Acceptance Criteria
- Language switch (en placeholder) doesn't break layout
- All strings come from centralized dictionary
- Date formatting respects locale conventions
- Layout holds with RTL text and pseudo-locales
- System is ready for real language translations

## Verification Steps
- Toggle pseudo-locale (ëñgLïSH) and verify UI holds
- Test date formatting with different locales
- Verify all text is extractable from dictionary
- Check layout with Arabic/Hebrew text simulation
- Test number formatting for different regions

## Files to Modify
- `src/lib/i18n/` - New i18n utilities and dictionaries
- `src/lib/i18n/dictionary.ts` - String definitions
- `src/hooks/useTranslation.ts` - Translation hook
- `src/components/` - Replace hardcoded strings
- `src/app/layout.tsx` - Locale provider setup
- Tailwind config for RTL support

## Implementation Notes
- Keep it simple - avoid over-engineering i18n
- Use interpolation for dynamic values in strings
- Consider pluralization rules for future languages
- Add namespace organization for different feature areas
- Ensure extraction scripts can find all strings

## Future Extensions
- Real language support (Spanish, French, etc.)
- Pluralization and gender rules
- Currency and timezone formatting
- SEO-friendly localized URLs
- Content translation workflows