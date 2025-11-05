# 🚀 Quick Database Setup (30 seconds)

## Your app needs a PostgreSQL database to work!

The white screen you're seeing is because the app can't connect to a database.

---

## ✨ Get FREE Database (No Credit Card)

### Step 1: Sign up at Neon
**Go to:** https://neon.tech
- Click "Sign Up"  
- Use GitHub (instant) or email

### Step 2: Create Project
- Name it anything (e.g., "blog-app")
- Choose region closest to you
- Click "Create Project"

### Step 3: Copy Connection String
After project is created, you'll see a connection string like:
```
postgresql://username:password@ep-quiet-feather-a5xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Copy that entire string!**

### Step 4: Update Your .env Files
Open **`.env`** and **`.env.local`** in your project and replace line 3:

**Change from:**
```env
DATABASE_URL="REPLACE_WITH_YOUR_NEON_DATABASE_URL"
```

**Change to:**
```env
DATABASE_URL="your-actual-connection-string-that-you-just-copied"
```

### Step 5: Run Migrations
```powershell
npx prisma migrate dev --name init
```

### Step 6: Start Your App
```powershell
npm run dev
```

### Step 7: Open App
```
http://localhost:3000
```

**It should now work!** 🎉

---

## 🎥 Video Guide (1 minute)

If you prefer video: https://www.youtube.com/watch?v=6vMF6dUPSjU

---

## Alternative: Use Supabase

If Neon doesn't work, try Supabase (also free):
1. Go to: https://supabase.com
2. Create account
3. New Project → wait 2 minutes for it to provision
4. Settings → Database → Connection string (Transaction mode)
5. Copy it to `.env` and `.env.local`
6. Run `npx prisma migrate dev --name init`
7. Run `npm run dev`

---

## What's Happening?

Your app uses:
- **Clerk** for authentication ✅ (working)
- **PostgreSQL** for data storage ❌ (needs setup)
- **OpenAI** for AI posts ✅ (working)

Once you add the database URL, everything will work!

---

## Why PostgreSQL?

Your app uses JSON fields and advanced features that SQLite doesn't support. PostgreSQL is required.

But don't worry - **Neon's free tier is generous:**
- 0.5GB storage (plenty for blog)
- Always-on database
- No credit card required
- Takes 30 seconds to set up

---

## Need Help?

If you have any issues:
1. Make sure you copied the ENTIRE connection string (including the password part)
2. Make sure it starts with `postgresql://`
3. Make sure it includes `?sslmode=require` at the end
4. Make sure you updated BOTH `.env` and `.env.local`

The connection string should look like:
```
postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

All parts are provided by Neon automatically - just copy and paste!

