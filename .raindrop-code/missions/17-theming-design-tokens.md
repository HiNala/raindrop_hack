# Mission 17: Theming & Design Tokens

## Goal
Visual consistency with centralized design system and dark-first approach.

## Tasks
1. **Centralized Design Tokens**
   - Create comprehensive token system (colors, spacing, radii, shadows)
   - Generate CSS variables from token definitions
   - Remove all inline styles and hardcoded values
   - Ensure tokens cover 95% of UI needs

2. **Component Standardization**
   - Unify all shadcn variant implementations
   - Remove ad-hoc colors and shadows from components
   - Standardize component prop interfaces
   - Ensure consistent design patterns

3. **Dark-First Implementation**
   - Design with dark mode as primary
   - Add optional light mode toggle
   - Ensure proper contrast ratios in both themes
   - Test across all themes and devices

## Acceptance Criteria
- No hardcoded hex codes or styles anywhere
- Centralized tokens control all visual aspects
- Dark mode works perfectly with light mode as toggle
- Design system is maintainable and extensible
- Visual consistency across entire application

## Verification Steps
- Grep codebase for hex codes → expect near-zero results
- Test theme toggle functionality
- Verify all components use design tokens
- Check contrast ratios for accessibility
- Test design system resilience to token changes

## Files to Modify
- `src/lib/design/tokens.ts` - Comprehensive token definitions
- `src/app/globals.css` - Token-based CSS variables
- `tailwind.config.ts` - Integration with design tokens
- All component files → replace hardcoded styles
- `src/components/ui/` - Standardize shadcn variants
- `src/hooks/useTheme.ts` - Theme management

## Implementation Notes
- Use TypeScript for type-safe token access
- Implement proper token naming conventions
- Add token documentation and usage guidelines
- Consider design tokens as part of API contract
- Add automated testing for theme consistency