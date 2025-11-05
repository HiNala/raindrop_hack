# Quick Start Guide

Get your Medium AI Blog Platform up and running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Git installed

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```powershell
# Install all packages
npm install
```

Expected output: All packages installed successfully

### 2. Set Up Environment Variables (3 minutes)

```powershell
# Copy the example file
copy .env.example .env.local
```

**Fill in the following in `.env.local`:**

#### Required for Development:

```env
# Database - Use one of these:
# Option 1: Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/blog_app"

# Option 2: Supabase (free tier)
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Clerk Auth - Get from https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# OpenAI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# UploadThing - Get from https://uploadthing.com/dashboard
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

**Quick Links to Get Keys:**
- Clerk: https://dashboard.clerk.com → Create Application → API Keys
- OpenAI: https://platform.openai.com/api-keys → Create New Key
- UploadThing: https://uploadthing.com/dashboard → Create App → Copy Keys

### 3. Set Up Database (2 minutes)

```powershell
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed demo data (optional but recommended)
npm run db:seed
```

**Verification:** You should see:
- ✓ Prisma schema loaded
- ✓ Database connected
- ✓ Migrations applied
- ✓ Seed data created (10 tags)

### 4. Start Development Server (1 minute)

```powershell
npm run dev
```

**Server should start at:** http://localhost:3000

### 5. Verify Everything Works (2 minutes)

**Open your browser to http://localhost:3000**

✅ **Checklist:**
1. Home page loads with AI generation input
2. No errors in browser console
3. Click "Get Started" → Clerk sign-up modal appears
4. Sign up with email (or use test credentials)
5. After sign-up, you're redirected back
6. Your avatar appears in header
7. Click "Write" → Editor opens
8. Type a title → auto-save works (wait 30s)
9. Dashboard is accessible

**If all checks pass, you're ready to build! 🚀**

---

## Troubleshooting

### Issue: Database connection failed

**Error:** `Can't reach database server`

**Solution:**
```powershell
# Check if PostgreSQL is running (local)
# OR verify your DATABASE_URL is correct

# Test connection
npx prisma studio
# If this opens, connection works!
```

### Issue: Clerk not working

**Error:** Redirect loops or "Invalid publishable key"

**Solution:**
- Verify keys start with `pk_test_` and `sk_test_`
- Check no extra spaces in `.env.local`
- Restart dev server after changing env vars

### Issue: npm install fails

**Error:** Various dependency errors

**Solution:**
```powershell
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Solution:**
```powershell
# Use different port
PORT=3001 npm run dev
```

---

## Next Steps

### 1. Create Your First Post

1. Click "Write" in header
2. Try AI generation: "A guide to Next.js 14 App Router"
3. Or write manually with the rich text editor
4. Add a cover image
5. Add tags
6. Click "Publish"
7. View your published post!

### 2. Customize Your Profile

1. Click your avatar → View Profile
2. Click "Edit Profile"
3. Upload an avatar
4. Add a bio
5. Add your website
6. Save changes

### 3. Explore Features

- Browse the home page feed
- Search for posts
- Click tags to filter
- Like and comment on posts
- Check your dashboard analytics

---

## Development Tips

### Useful Commands

```powershell
# Database management
npx prisma studio              # Visual database editor
npx prisma migrate reset       # Reset & reseed database
npx prisma db push             # Quick schema sync (dev only)

# Development
npm run dev                    # Start dev server
npm run build                  # Test production build
npm run lint                   # Check for errors

# Check what's running
netstat -ano | findstr :3000   # Check port usage
```

### Environment Variables

**After changing `.env.local`, always restart the server:**
```powershell
# Stop server (Ctrl + C)
npm run dev  # Start again
```

### Database Changes

**When you modify `prisma/schema.prisma`:**
```powershell
# Create migration
npx prisma migrate dev --name describe_your_change

# Regenerate Prisma Client
npx prisma generate
```

---

## Production Deployment

When ready to deploy, follow **DEPLOYMENT.md** for detailed instructions.

**Quick deploy to Vercel:**
```powershell
npm i -g vercel
vercel
```

Then set environment variables in Vercel dashboard and run migrations.

---

## Getting Help

- **Documentation:** See README.md for full feature list
- **API Reference:** See API_REFERENCE.md for all endpoints
- **Testing:** See TESTING.md for complete test checklist
- **Deployment:** See DEPLOYMENT.md for production setup

---

## Success! 🎉

You now have a fully functional AI-powered blogging platform!

**What you can do:**
- ✅ Generate blog posts with AI
- ✅ Write and edit with rich text editor
- ✅ Upload images
- ✅ Manage drafts and publications
- ✅ Engage with likes and comments
- ✅ Browse and search content
- ✅ Customize your profile

**Start creating amazing content!** 🚀


