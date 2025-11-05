# Testing Guide

This document outlines how to test all features of the Medium AI Blog Platform to ensure everything is connected and working properly.

## Pre-Testing Setup

1. **Environment Variables**
   ```powershell
   # Copy and fill in your credentials
   copy .env.example .env.local
   ```

2. **Install Dependencies**
   ```powershell
   npm install
   ```

3. **Database Setup**
   ```powershell
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed
   ```

4. **Start Development Server**
   ```powershell
   npm run dev
   ```

## Test Checklist

### ✅ Authentication Flow (Clerk)

**Anonymous User:**
- [ ] Visit home page - should load without errors
- [ ] See "Get Started" / "Sign In" buttons in header
- [ ] Browse posts (if any exist)
- [ ] Search functionality works
- [ ] Tag pages accessible
- [ ] Viewing posts works

**Sign Up:**
- [ ] Click "Get Started" or "Sign Up"
- [ ] Complete Clerk sign-up flow
- [ ] Redirected to home page after sign-up
- [ ] User appears in database with profile
- [ ] Username auto-generated correctly
- [ ] Avatar from Clerk displayed

**Sign In:**
- [ ] Click "Sign In"
- [ ] Complete Clerk sign-in flow
- [ ] Redirected to home page
- [ ] User menu appears in header
- [ ] Can access dashboard

### ✅ AI Generation (OpenAI)

**Anonymous Users (localStorage):**
- [ ] Home page shows AI input box
- [ ] Enter a prompt (e.g., "How to learn React")
- [ ] Select tone and length options
- [ ] Click "Generate with AI"
- [ ] Post generates successfully
- [ ] Counter shows remaining posts (X/3)
- [ ] Draft saved to localStorage
- [ ] After 3 posts, shows "Sign in for more"

**Authenticated Users:**
- [ ] Sign in
- [ ] Use AI generation on home page
- [ ] Post creates as draft in database
- [ ] Redirects to editor with generated content
- [ ] Can generate up to 10 posts/day
- [ ] Rate limit enforced

### ✅ Post Editor (TipTap)

**Create New Post:**
- [ ] Click "Write" in header
- [ ] Editor page loads
- [ ] Can upload cover image (UploadThing)
- [ ] Cover image preview shows
- [ ] Can remove cover image
- [ ] Title input works
- [ ] Excerpt input works
- [ ] Tag selector opens
- [ ] Can add existing tags
- [ ] Can create new tags
- [ ] Rich text editor toolbar visible
- [ ] Bold, italic, headings work
- [ ] Lists (bullet, ordered) work
- [ ] Code blocks work
- [ ] Quotes work
- [ ] Links work
- [ ] Can undo/redo

**Save & Auto-save:**
- [ ] Click "Save Draft"
- [ ] Draft saved to database
- [ ] URL updates with post ID
- [ ] "Saved at" timestamp appears
- [ ] Auto-save works (wait 30 seconds)

**Publish:**
- [ ] Click "Publish" button
- [ ] Validation: requires title
- [ ] Validation: requires at least 1 tag
- [ ] Slug generated automatically
- [ ] Reading time calculated
- [ ] Redirects to published post
- [ ] Post visible on home page

**Edit Existing Post:**
- [ ] Go to Dashboard
- [ ] Click "Edit" on a post
- [ ] Editor loads with existing content
- [ ] Can modify and save
- [ ] Changes persist

### ✅ Dashboard

**Access:**
- [ ] Click "Dashboard" in header (authenticated only)
- [ ] Dashboard page loads

**Stats Cards:**
- [ ] Total Posts count correct
- [ ] Total Views count shows
- [ ] Total Likes count shows

**Drafts Tab:**
- [ ] Shows all unpublished posts
- [ ] Each draft shows title, excerpt, tags
- [ ] Shows "last edited" date
- [ ] Can click "Continue Editing"
- [ ] Can delete draft
- [ ] Empty state shows if no drafts

**Published Tab:**
- [ ] Shows all published posts
- [ ] Shows views, likes, comments count
- [ ] Can click "Edit"
- [ ] Can click "View" (opens public page)
- [ ] Can unpublish post
- [ ] Can delete post
- [ ] Confirmation dialog for delete
- [ ] Empty state shows if no published posts

### ✅ Public Post View

**Page Load:**
- [ ] Visit `/p/[slug]` for a published post
- [ ] Cover image displays (if present)
- [ ] Title displays correctly
- [ ] Tags clickable
- [ ] Excerpt shows (if present)
- [ ] Author info displays with avatar
- [ ] Published date shows
- [ ] Reading time shows
- [ ] View count increments on visit
- [ ] Content renders properly
- [ ] TipTap content displays correctly

**Engagement:**
- [ ] Like button shows current count
- [ ] Click like (authenticated) - count increments
- [ ] Like button fills with color
- [ ] Click again - unlike works
- [ ] Optimistic UI updates immediately

**Comments:**
- [ ] Comments section loads
- [ ] Shows existing comments
- [ ] If signed in, can add comment
- [ ] Comment form appears
- [ ] Type and submit comment
- [ ] Comment appears immediately
- [ ] Can delete own comments
- [ ] Post author can delete any comment
- [ ] If not signed in, shows "Sign in to comment"

**Author Bio:**
- [ ] Author bio section displays
- [ ] Avatar, name, bio shown
- [ ] "View Profile" link works

### ✅ User Profiles

**View Profile:**
- [ ] Visit `/u/[username]`
- [ ] Profile header with gradient
- [ ] Large avatar displays
- [ ] Display name and username show
- [ ] Bio displays (if present)
- [ ] Joined date shows
- [ ] Website link (if present)

**Stats:**
- [ ] Total posts count
- [ ] Total views count
- [ ] Total likes count

**Posts Grid:**
- [ ] All published posts display
- [ ] Posts clickable
- [ ] Empty state if no posts

**Own Profile:**
- [ ] "Edit Profile" button appears
- [ ] Can click to edit

**Edit Profile:**
- [ ] Visit `/settings/profile`
- [ ] Form loads with current data
- [ ] Can upload new avatar
- [ ] Avatar preview updates
- [ ] Can change display name
- [ ] Can update bio (500 char limit)
- [ ] Character counter works
- [ ] Can add website URL
- [ ] Username shown as readonly
- [ ] Click "Save Changes"
- [ ] Changes persist
- [ ] Redirects to profile page

### ✅ Discovery Features

**Search:**
- [ ] Use search box in header
- [ ] Enter query and press Enter
- [ ] Search results page loads
- [ ] Searches title, excerpt, tags
- [ ] Results display correctly
- [ ] "No results" shows if nothing found

**Tag Pages:**
- [ ] Click a tag badge anywhere
- [ ] Tag page loads at `/tag/[slug]`
- [ ] Tag name displays with icon
- [ ] Post count shows
- [ ] All posts with that tag display
- [ ] Can click posts to view

**Home Feed:**
- [ ] "Latest" tab shows recent posts
- [ ] "Trending" tab shows popular posts
- [ ] Popular topics section displays
- [ ] Tag badges clickable
- [ ] Post cards display properly

### ✅ API Endpoints

Test via browser DevTools Network tab or API client:

**Public Endpoints:**
- [ ] `GET /api/tags` - returns all tags
- [ ] `GET /api/posts/[id]/comments` - returns comments

**Protected Endpoints (require auth):**
- [ ] `POST /api/posts/[id]/like` - toggle like
- [ ] `GET /api/posts/[id]/like/check` - check if liked
- [ ] `POST /api/posts/[id]/comments` - create comment
- [ ] `DELETE /api/posts/[id]/comments/[commentId]` - delete comment
- [ ] `PATCH /api/profile` - update profile

**File Upload:**
- [ ] `POST /api/uploadthing` - upload files
- [ ] Cover images upload correctly
- [ ] Avatars upload correctly

### ✅ Server Actions

**Post Actions:**
- [ ] `saveDraft()` - creates/updates drafts
- [ ] `publishPost()` - publishes draft
- [ ] `unpublishPost()` - reverts to draft
- [ ] `deletePost()` - removes post
- [ ] `getOrCreateTags()` - creates tags on-the-fly

**AI Generation:**
- [ ] `generateAuthenticatedPost()` - creates AI draft
- [ ] `generateAnonymousPost()` - returns AI content
- [ ] Rate limiting enforced

### ✅ UI/UX Features

**Responsive Design:**
- [ ] Desktop view (1920px) works
- [ ] Tablet view (768px) works
- [ ] Mobile view (375px) works
- [ ] Hamburger menu on mobile
- [ ] Touch targets are 44px minimum

**Dark Mode:**
- [ ] Toggle dark mode (system preference)
- [ ] All pages render correctly in dark mode
- [ ] Colors have proper contrast
- [ ] Images visible in both modes

**Loading States:**
- [ ] Skeleton loaders on home page
- [ ] "Loading..." states on buttons
- [ ] Spinner animations work
- [ ] Disabled states prevent double-clicks

**Notifications:**
- [ ] Toast notifications appear
- [ ] Success messages (green)
- [ ] Error messages (red)
- [ ] Auto-dismiss after few seconds

**Animations:**
- [ ] Smooth page transitions
- [ ] Hover effects on cards
- [ ] Button press animations
- [ ] Framer Motion animations on home page

### ✅ SEO & Metadata

**Homepage:**
- [ ] Title tag correct
- [ ] Description meta tag present
- [ ] Open Graph tags present

**Post Pages:**
- [ ] Dynamic title with post title
- [ ] Description from excerpt
- [ ] Open Graph image (cover image)
- [ ] Twitter card metadata
- [ ] Canonical URL set
- [ ] JSON-LD structured data (optional check)

**Other Pages:**
- [ ] Tag pages have proper metadata
- [ ] Search page has proper metadata
- [ ] Profile pages have proper metadata

## Common Issues & Solutions

### Issue: Database Connection Error
**Solution:** Verify `DATABASE_URL` in `.env.local` is correct

### Issue: Clerk Auth Not Working
**Solution:** 
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_`
- Check `CLERK_SECRET_KEY` starts with `sk_`
- Verify middleware.ts is in root directory

### Issue: File Upload Fails
**Solution:**
- Verify UploadThing credentials
- Check file size limits
- Review browser console for errors

### Issue: AI Generation Fails
**Solution:**
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Review server logs for detailed errors

### Issue: Pages Not Loading
**Solution:**
- Check for TypeScript errors: `npm run build`
- Review browser console
- Check Next.js terminal for errors

## Performance Testing

**Load Times:**
- [ ] Home page loads in < 2s
- [ ] Post pages load in < 1s
- [ ] Editor loads in < 2s
- [ ] Search results in < 1s

**Database Queries:**
- [ ] No N+1 query issues
- [ ] Proper includes for relations
- [ ] Pagination on large lists

## Security Testing

**Authentication:**
- [ ] Cannot access `/dashboard` without auth
- [ ] Cannot access `/editor` without auth
- [ ] Cannot edit other users' posts
- [ ] Cannot delete other users' comments (except post author)

**Data Validation:**
- [ ] XSS protection (content stored as JSON)
- [ ] File upload size limits enforced
- [ ] SQL injection protected (Prisma ORM)
- [ ] Rate limiting on AI generation

## Deployment Testing

After deploying to Vercel:

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Production build succeeds
- [ ] No console errors in production
- [ ] All features work in production
- [ ] HTTPS enabled
- [ ] Custom domain works (if configured)

## Test Coverage Complete ✅

If all items above are checked, your application is fully functional and ready for production use!


