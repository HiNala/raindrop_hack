# 🚀 Deployment Guide

This guide will help you deploy your blog platform to production on Vercel.

## 📋 Prerequisites

Before deploying, make sure you have:

- ✅ All environment variables configured
- ✅ Database set up and accessible
- ✅ Clerk application configured
- ✅ OpenAI API key ready
- ✅ UploadThing application set up
- ✅ Code pushed to GitHub repository

## 🔧 Environment Variables

### Required Variables

Add these to your Vercel project settings:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# OpenAI API (Required)
OPENAI_API_KEY="sk-proj-..."

# UploadThing (Required)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your_app_id"

# App Configuration
NEXT_PUBLIC_API_URL="https://yourdomain.com"
JWT_SECRET="your-super-secret-jwt-key"
```

## 🗄️ Database Setup

### Neon Database

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for free tier

2. **Create Database**
   - Click "New Project"
   - Choose region closest to your users
   - Copy connection string

3. **Configure Connection String**
   ```
   postgresql://username:password@ep-xxx.us-west-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
   ```

4. **Test Connection**
   ```bash
   npx prisma db push
   npx prisma studio
   ```

## 🔐 Clerk Configuration

### 1. Create Clerk Application

1. Go to [clerk.com](https://clerk.com)
2. Create new application
3. Configure "User & Authentication" settings:
   - Email addresses: Allow
   - Phone numbers: Optional
   - Social connections: Configure as needed

### 2. Get API Keys

1. Go to API Keys section
2. Copy Publishable Key and Secret Key
3. Add to environment variables

### 3. Configure URLs

In Clerk dashboard → Paths → Configure:

```
Sign in URL: /sign-in
Sign up URL: /sign-up
After sign in: /dashboard
After sign up: /dashboard
Sign in fallback: /
Sign up fallback: /
```

### 4. Customize Appearance

1. Go to "Theme & Branding"
2. Upload your logo
3. Customize colors to match your brand
4. Test the sign-in flow

## 🤖 OpenAI Setup

### 1. Get API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account and add payment method
3. Generate API key
4. Add to environment variables

### 2. Configure Usage Limits

1. Set usage limits in OpenAI dashboard
2. Monitor usage to control costs
3. Consider rate limiting in your application

## 📁 UploadThing Setup

### 1. Create Application

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create new application
3. Configure file types and sizes

### 2. Get Credentials

1. Get App ID and Secret Key
2. Add to environment variables
3. Configure CORS settings

## 🚀 Deploy to Vercel

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Connect your GitHub repository
4. Select the blog-app directory

### 2. Configure Build Settings

Vercel will auto-detect Next.js settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 3. Set Environment Variables

1. Go to "Environment Variables" tab
2. Add all required variables
3. Mark sensitive variables as "Secret"
4. Save and re-deploy

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Test the deployed application

## 🔄 Database Migration

### First Time Setup

After deployment, run database migration:

1. Access your deployed app
2. Navigate to `https://yourdomain.com/api/db/migrate` (if you created this endpoint)
3. Or run locally and push to production:
   ```bash
   npx prisma db push
   ```

### Schema Updates

When updating database schema:

1. Make changes to `prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name migration_name
   ```
3. Deploy with new migrations

## 🔍 Testing Your Deployment

### Checklist

- [ ] Homepage loads correctly
- [ ] Sign up/sign in flow works
- [ ] Can create new post
- [ ] AI generation works
- [ ] Image uploads work
- [ ] Post publishing works
- [ ] Mobile responsive

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check IP whitelist settings
   - Ensure SSL is enabled

2. **Clerk Authentication Issues**
   - Verify API keys are correct
   - Check redirect URLs
   - Ensure CORS is configured

3. **Image Upload Failures**
   - Verify UploadThing credentials
   - Check file size limits
   - Ensure CORS allows your domain

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor page views, performance
3. Set up custom events

### Error Tracking

Consider adding Sentry or similar:

```bash
npm install @sentry/nextjs
```

### Database Monitoring

Monitor your Neon database:
- Connection usage
- Storage usage
- Query performance

## 🛡️ Security Checklist

### Environment Variables
- [ ] All secrets are marked as such
- [ ] No hardcoded credentials in code
- [ ] Production URLs are correctly set

### Headers & Security
Vercel automatically adds:
- HTTPS
- Security headers
- Rate limiting basics

### Database Security
- [ ] Connection uses SSL
- [ ] IP whitelist configured
- [ ] Regular backups enabled

## 📈 Performance Optimization

### Build Optimization

Vercel automatically optimizes:
- Next.js builds
- Image optimization
- Static asset serving

### Caching Strategy

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  }
}
```

### CDN Configuration

Vercel Edge Network provides:
- Global CDN
- Automatic caching
- Edge functions support

## 🔄 CI/CD Pipeline

### Automatic Deployments

1. Push to main branch → Deploy to production
2. Push to develop branch → Deploy to preview
3. Pull requests → Preview deployments

### Build Hooks

```bash
# Add to package.json scripts
"scripts": {
  "postbuild": "prisma generate",
  "prebuild": "npm run db:generate"
}
```

## 🆘 Troubleshooting

### Common Build Errors

1. **Prisma Generation Failed**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **TypeScript Errors**
   ```bash
   npx tsc --noEmit
   ```

3. **Environment Variable Issues**
   - Check Vercel dashboard
   - Restart deployment
   - Verify variable names

### Production Debugging

1. Check Vercel Function Logs
2. Use Vercel CLI for local debugging
3. Monitor browser console
4. Test with production environment variables

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Clerk Deployment Guide](https://clerk.com/docs/deployments)
- [Neon Documentation](https://neon.tech/docs)
- [UploadThing Docs](https://uploadthing.com/docs)

---

🎉 **Congratulations!** Your blog platform is now live and ready for users.

For issues or questions, check the troubleshooting section or open a support ticket with the respective service provider.