# Deployment Guide

This guide will help you deploy your Medium-style AI blog platform to production.

## Prerequisites

Before deploying, ensure you have accounts for:

1. **Vercel** (https://vercel.com) - Hosting platform
2. **PostgreSQL Database** - Choose one:
   - Vercel Postgres (recommended)
   - Supabase (https://supabase.com)
   - Neon (https://neon.tech)
3. **Clerk** (https://clerk.com) - Authentication
4. **UploadThing** (https://uploadthing.com) - File uploads
5. **OpenAI** (https://platform.openai.com) - AI generation

## Step 1: Set Up Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string (it starts with `postgres://`)
4. Save it as `DATABASE_URL`

### Option B: Supabase

1. Create a new project at https://supabase.com
2. Go to Project Settings → Database
3. Copy the connection string (choose "Transaction" mode)
4. Replace `[YOUR-PASSWORD]` with your database password
5. Save it as `DATABASE_URL`

## Step 2: Set Up Authentication (Clerk)

1. Go to https://clerk.com and create an account
2. Create a new application
3. Go to API Keys
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)
5. In Clerk Dashboard → Configure → Paths:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

## Step 3: Set Up File Uploads (UploadThing)

1. Go to https://uploadthing.com and sign in
2. Create a new app
3. Copy:
   - `UPLOADTHING_SECRET` (starts with `sk_live_`)
   - `UPLOADTHING_APP_ID`

## Step 4: Set Up OpenAI

1. Go to https://platform.openai.com
2. Navigate to API Keys
3. Create a new secret key
4. Copy the key (starts with `sk-`)
5. Save it as `OPENAI_API_KEY`

## Step 5: Deploy to Vercel

### Via Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Via GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect Next.js

## Step 6: Configure Environment Variables

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add all variables from `.env.example`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
OPENAI_API_KEY=sk-...
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

3. Make sure to select all environments (Production, Preview, Development)

## Step 7: Run Database Migrations

After your first deployment:

```powershell
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database
npm run db:seed
```

Or use Vercel CLI:

```powershell
vercel env pull .env.local
npx prisma migrate deploy
```

## Step 8: Verify Deployment

1. Visit your deployed URL
2. Test the following:
   - ✅ Home page loads with AI generation hero
   - ✅ Sign up / Sign in works
   - ✅ Create a new post
   - ✅ Upload cover image
   - ✅ Publish post
   - ✅ View published post
   - ✅ Like and comment on post
   - ✅ Edit profile

## Step 9: Configure Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Troubleshooting

### Database Connection Issues

**Problem**: `Can't reach database server`

**Solution**:
- Verify `DATABASE_URL` is correct
- Check if database is in the same region as Vercel deployment
- For Supabase: Use "Transaction" mode connection string, not "Session"

### Clerk Authentication Not Working

**Problem**: Redirect loops or authentication errors

**Solution**:
- Verify middleware is detected (check Vercel build logs)
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Check Clerk Dashboard → Configure → Paths are correct

### UploadThing Uploads Failing

**Problem**: Upload button doesn't work

**Solution**:
- Verify `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` are set
- Check UploadThing dashboard for API key status
- Ensure file size limits are not exceeded

### OpenAI Generation Errors

**Problem**: AI generation fails

**Solution**:
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has credits
- Review API rate limits

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Clerk authentication working
- [ ] File uploads working
- [ ] AI generation working
- [ ] Custom domain configured (if applicable)
- [ ] Test create → publish → view flow
- [ ] Test engagement features (likes, comments)
- [ ] Verify SEO metadata
- [ ] Check mobile responsiveness
- [ ] Enable error tracking (optional: Sentry)
- [ ] Set up analytics (optional: PostHog/Umami)

## Maintenance

### Update Database Schema

When you modify `schema.prisma`:

```powershell
# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

### Monitor Usage

- **Clerk**: Monitor MAUs (Monthly Active Users)
- **UploadThing**: Check storage usage
- **OpenAI**: Monitor token usage and costs
- **Database**: Check storage and connection limits

## Cost Estimates (Monthly)

- **Vercel**: Free for hobby projects, Pro starts at $20/month
- **Vercel Postgres**: Free for hobby (256MB), Pro starts at $20/month
- **Clerk**: Free up to 10K MAUs, Pro starts at $25/month
- **UploadThing**: Free tier includes 2GB storage
- **OpenAI**: Pay-as-you-go (est. $5-50/month depending on usage)

**Total estimated monthly cost**: $0-$100+ depending on traffic

## Support

For issues:
- Check Vercel build logs
- Review Clerk Dashboard logs
- Check browser console for errors
- Review Next.js error messages

Happy deploying! 🚀


