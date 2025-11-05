# Mission 9: HN Enrichment Toggle + Inline Citations

## Goal
Provide Hacker News context without clutter, with proper citation support.

## Tasks
1. **HN Enrichment Toggle**
   - Add toggle in editor details panel
   - Show "Using HN context" chip when active
   - Persist toggle preference per user/post
   - Add rate limiting awareness

2. **Inline Citation System**
   - Implement hovercards for `[HN-X]` citations
   - Auto-append sources to post content
   - Create proper citation formatting
   - Add 5-minute caching for HN data

3. **Context Integration**
   - Enhance existing HN search functionality
   - Improve citation generation and formatting
   - Add graceful failure handling for rate limits
   - Implement context relevance scoring

## Acceptance Criteria
- Toggle preference persists across sessions
- Citations appear correctly when HN context is enabled
- Hovercards show relevant HN discussion details
- Graceful degradation when HN API is rate limited
- Cache improves performance for repeated requests

## Verification Steps
- Enable HN toggle and verify citations appear
- Test hovercard functionality on citations
- Disable toggle and verify citations disappear
- Test behavior during HN API rate limits
- Verify cache performance with repeated requests
- Test citation formatting and source attribution

## Files to Modify
- `src/components/editor/HNToggle.tsx` - Enhanced toggle component
- `src/lib/hn-search.ts` - Improve citation generation
- `src/lib/hn/enhanced-enrichment.ts` - Context integration
- `src/app/api/hn-context/route.ts` - API with caching
- `src/components/editor/CitationRenderer.tsx` - New component
- `src/lib/openai.ts` - Enhanced prompt building with citations

## Implementation Notes
- Use React Query or SWR for HN data caching
- Implement proper error boundaries for HN components
- Add accessibility features for citation hovercards
- Consider offline support for cached HN data
- Add analytics for HN enrichment usage patterns