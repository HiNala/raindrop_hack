# Deployment Guide

Complete guide to deploying the Blog App to production.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Neon PostgreSQL database (free tier available)
- Clerk account (free tier available)
- OpenAI API key
- UploadThing account (for image uploads)

## Step 1: Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy your connection string from the dashboard
   - Use the **pooler** connection string for better performance
   - Format: `postgresql://user:password@host/dbname?sslmode=require`

## Step 2: Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your API keys from the **API Keys** page:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)
4. Configure URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

## Step 3: UploadThing Setup

1. Go to [uploadthing.com](https://uploadthing.com) and sign in with GitHub
2. Create a new app
3. Copy your credentials:
   - `UPLOADTHING_SECRET` (starts with `sk_live_`)
   - `UPLOADTHING_APP_ID`

## Step 4: Deploy to Vercel

### Option A: Deploy from GitHub

1. Push your code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New Project**
4. Import your GitHub repository (`HiNala/raindrop_hack`)
5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Option B: Deploy via CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 5: Environment Variables

Add these environment variables in Vercel dashboard (Settings → Environment Variables):

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# OpenAI
OPENAI_API_KEY=sk-proj-...

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=your_app_id

# App URL (use your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional Variables

```env
# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Email (Resend)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@yourdomain.com
```

## Step 6: Run Database Migrations

After deployment, run migrations:

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or via Vercel dashboard: add a build command
# Build Command: npm run build && npx prisma migrate deploy
```

## Step 7: Seed Database (Optional)

```bash
npm run db:seed
```

## Step 8: Verify Deployment

1. Visit your Vercel URL
2. Check `/api/health` endpoint
3. Test sign-up flow
4. Create a test post
5. Verify publishing works

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Database migrations run successfully
- [ ] Clerk URLs configured correctly
- [ ] Health endpoint returns 200
- [ ] Sign-up flow works
- [ ] Post creation works
- [ ] Image uploads work
- [ ] SEO metadata generates correctly
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

## Custom Domain Setup

1. In Vercel dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable
5. Update Clerk URLs to use your custom domain

## Performance Optimization

### Enable ISR (Incremental Static Regeneration)

Posts are already configured for ISR. To adjust revalidation:

```typescript
// In post page
export const revalidate = 3600 // Revalidate every hour
```

### Database Connection Pooling

Use Neon's connection pooler for better performance:

```
postgresql://user:password@host-pooler.neon.tech/dbname?sslmode=require
```

### Image Optimization

Configure `next.config.js` for image domains:

```javascript
images: {
  domains: ['utfs.io'], // UploadThing domain
}
```

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard for performance monitoring.

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Vercel's built-in error logs

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Neon dashboard for connection limits
- Use connection pooler URL

### Clerk Authentication Issues

- Verify all Clerk environment variables are set
- Check Clerk dashboard for allowed URLs
- Ensure middleware is configured correctly

### Build Failures

- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Prisma Client is generated (`npx prisma generate`)

### Image Upload Issues

- Verify UploadThing credentials
- Check CORS settings in UploadThing dashboard
- Ensure image domains are configured in `next.config.js`

## Rollback Strategy

1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

## CI/CD Pipeline

See `.github/workflows/ci.yml` for automated testing and deployment.

## Support

For issues:
1. Check Vercel logs
2. Check Neon database logs
3. Review error boundaries in app
4. Check `/api/health` endpoint
