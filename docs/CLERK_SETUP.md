# Clerk Authentication Setup Guide

This app uses Clerk for authentication. Follow these steps to set it up:

## 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

## 2. Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

## 3. Update Environment Variables

Update the `.env.local` file in your project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
```

**Important:** Never commit `.env.local` to version control! It's already in `.gitignore`.

## 4. Configure Clerk Settings (Optional)

In your Clerk Dashboard:

### Customize Appearance
- Go to **Customization** → **Appearance**
- Match your brand colors
- Upload your logo

### Configure Redirects
- Go to **Paths**  
- Set sign-in URL: `/sign-in`
- Set sign-up URL: `/sign-up`
- Set after sign-in: `/`
- Set after sign-up: `/`

### Social Providers (Optional)
- Go to **User & Authentication** → **Social Connections**
- Enable Google, GitHub, etc.

## 5. Test the Integration

1. Restart your dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign In" in the header
4. Create a test account
5. You should see your avatar/UserButton in the header when signed in

## Protected Routes

The following routes require authentication:

- `/admin` - Admin dashboard and all sub-routes
- `/api/posts` - Post management APIs (POST, PUT, DELETE)
- `/api/categories` - Category APIs
- `/api/comments` - Comment APIs
- `/api/tags` - Tag APIs

## Using Auth in Your Code

### In Server Components

\`\`\`tsx
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const user = await currentUser()
  
  if (!user) {
    return <div>Please sign in</div>
  }
  
  return <div>Hello {user.firstName}!</div>
}
\`\`\`

### In Client Components

\`\`\`tsx
'use client'
import { useUser } from '@clerk/nextjs'

export function Profile() {
  const { isSignedIn, user } = useUser()
  
  if (!isSignedIn) return null
  
  return <div>Hello {user.firstName}!</div>
}
\`\`\`

### In API Routes

\`\`\`ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  
  // Your protected API logic here
  return NextResponse.json({ message: 'Success' })
}
\`\`\`

## Production Deployment

When deploying to Vercel/Netlify/etc:

1. Add your environment variables in the hosting platform's dashboard
2. Use production keys (`pk_live_` and `sk_live_`)
3. Update the allowed domains in Clerk Dashboard → **Domains**

## Troubleshooting

### "Clerk: Publishable key not found"
- Make sure `.env.local` exists with the correct keys
- Restart your dev server after adding keys
- Check that keys start with `pk_test_` or `pk_live_`

### Protected routes not working
- Ensure `middleware.ts` exists in project root
- Check that your route matches the patterns in `createRouteMatcher()`
- Verify Clerk middleware is running with the correct config

### UserButton not showing
- Make sure you're signed in
- Check browser console for errors
- Verify `<ClerkProvider>` wraps your app in `layout.tsx`

## Need Help?

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Community](https://clerk.com/discord)
- [Next.js Integration Guide](https://clerk.com/docs/quickstarts/nextjs)


