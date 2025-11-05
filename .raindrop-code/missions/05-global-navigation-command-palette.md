# Mission 5: Global Navigation & Command Palette

## Goal
Fast, universal navigation system accessible from anywhere in the app.

## Tasks
1. **Command Palette Implementation**
   - Header search opens Cmd+K palette
   - Index posts, tags, and routes for quick access
   - Implement keyboard navigation (arrows, enter)
   - Add mobile full-screen sheet variant

2. **Search Indexing**
   - Create searchable index of all content
   - Implement fuzzy search with relevance scoring
   - Add recent searches and favorites
   - Support keyboard shortcuts and mouse interaction

3. **Performance Optimization**
   - Ensure ≤150ms result render time
   - Implement proper debouncing for search queries
   - Add loading states for search results

## Acceptance Criteria
- Command palette opens instantly with Cmd+K
- Search results render in under 150ms
- Arrow key navigation works smoothly
- Mobile variant is touch-friendly
- Search covers all major app sections

## Verification Steps
- Open command palette with Cmd+K from any page
- Test search for posts, tags, and settings
- Navigate using arrow keys and enter
- Test on mobile devices (touch interaction)
- Search with slow network connection
- Verify keyboard accessibility

## Files to Modify
- `src/components/layout/Header.tsx` - Add search trigger
- `src/components/search/CommandPalette.tsx` - Main component
- `src/components/search/SearchProvider.tsx` - Search state management
- `src/lib/search.ts` - Search indexing and utilities
- `src/app/api/search/route.ts` - Search API endpoint

## Implementation Notes
- Use proper focus management for accessibility
- Implement virtual scrolling for large result sets
- Add analytics for search usage patterns
- Ensure search index updates when content changes
- Test with screen readers for accessibility compliance