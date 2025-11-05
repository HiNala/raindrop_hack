# Mission 20: E2E & CI Quality Gates

## Goal
Comprehensive automated testing that prevents regressions before deployment.

## Tasks
1. **Playwright E2E Journeys**
   - Complete user flow: auth → NUX → draft → HN toggle → schedule → preview → publish → edit settings
   - Add cross-browser testing (Chrome, Firefox, Safari)
   - Implement visual regression testing
   - Add mobile viewport testing

2. **Lighthouse CI Integration**
   - Set up LHCI for desktop and mobile testing
   - Configure performance budgets and thresholds
   - Add performance regression detection
   - Implement performance trend tracking

3. **CI Quality Gates**
   - Add schema diff validation for database changes
   - Implement TypeScript strict mode checks
   - Add ESLint and Prettier validation
   - Create build failure notifications

## Acceptance Criteria
- All green checks → merge allowed
- Any test failure blocks deployment
- Performance regressions caught automatically
- Schema changes reviewed before deployment
- Type safety enforced at build time

## Verification Steps
- Run complete CI pipeline locally
- Test failure scenarios (broken tests, performance drops)
- Verify LHCI reports are generated correctly
- Test schema validation with database changes
- Check merge block functionality on failures

## Files to Modify
- `e2e/` - Comprehensive Playwright test suite
- `playwright.config.ts` - Enhanced test configuration
- `.github/workflows/ci.yml` - CI pipeline setup
- `lighthouserc.json` - LHCI configuration
- `package.json` - Add quality gate scripts
- `validate-missions.js` - Mission validation logic

## CI Scripts to Add
```json
{
  "scripts": {
    "ci:validate": "npm run typecheck && npm run lint && npm run build",
    "ci:test": "npm run test:unit && npm run test:e2e",
    "ci:performance": "lhci autorun --upload.target=temporary-public-storage",
    "ci:all": "npm run ci:validate && npm run ci:test && npm run ci:performance"
  }
}
```

## Implementation Notes
- Use matrix builds for cross-browser testing
- Implement proper test data management
- Add performance budgets and alerts
- Consider flaky test detection and retry logic
- Add security scanning to CI pipeline
- Document test environment setup clearly

## Quality Metrics to Track
- Test coverage percentage
- Lighthouse scores trends
- Build time performance
- Flaky test rates
- Security vulnerability count
- Bundle size changes