# 🚀 Get Your Free Database (30 seconds)

## Option 1: Neon (Recommended - Fastest)

1. **Go to:** https://neon.tech
2. **Click:** "Sign Up" (use GitHub or email)
3. **Create project:** Name it "blog-app"  
4. **Copy the connection string** - it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

5. **Paste it in `.env` and `.env.local`** (replace line 4 in both files)

6. **Run these commands:**
   ```powershell
   npx prisma migrate dev --name init
   npm run dev
   ```

---

## Option 2: Supabase (Also Free)

1. **Go to:** https://supabase.com
2. **Sign up** with GitHub
3. **Create new project** (takes 2 minutes to provision)
4. **Go to:** Settings → Database → Connection string → Transaction
5. **Copy the connection string**
6. **Paste it in `.env` and `.env.local`**
7. **Run:**
   ```powershell
   npx prisma migrate dev --name init
   npm run dev
   ```

---

## Option 3: Railway (Free Tier)

1. **Go to:** https://railway.app  
2. **Sign up** with GitHub
3. **New Project** → **PostgreSQL**
4. **Click the database** → **Connect** → Copy the connection string
5. **Paste it in `.env` and `.env.local`**
6. **Run:**
   ```powershell
   npx prisma migrate dev --name init
   npm run dev
   ```

---

## 🎯 Quick Video Guide

**Neon Setup (1 minute):** https://www.youtube.com/watch?v=6vMF6dUPSjU

---

## After You Get Your Database URL:

1. **Update `.env`** (line 4):
   ```env
   DATABASE_URL="your-actual-connection-string-here"
   ```

2. **Update `.env.local`** (line 4 - same as above)

3. **Run migrations:**
   ```powershell
   npx prisma migrate dev --name init
   ```

4. **Seed sample data (optional):**
   ```powershell
   npm run db:seed
   ```

5. **Start the app:**
   ```powershell
   npm run dev
   ```

6. **Open:** http://localhost:3000

---

## ⚡ Fastest Path

**Use Neon** - it's instant, no credit card, and the connection string is ready immediately after signup.

Just copy-paste the connection string into both `.env` files and run the commands above!

