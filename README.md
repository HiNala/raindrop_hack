# 🚀 Modern Blog Platform

A production-ready, AI-powered blog platform built with Next.js 15, featuring Clerk authentication, PostgreSQL database, and a stunning Capacity.so-inspired dark UI.

![Blog Platform](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge)

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Blog Generation** - Generate blog posts using OpenAI GPT-4
- 👤 **User Authentication** - Secure authentication with Clerk
- ✍️ **Rich Text Editor** - TipTap editor with markdown support
- 📸 **Image Uploads** - Cover images and media via UploadThing
- 🏷️ **Tag System** - Organize posts with tags
- 💬 **Comments & Likes** - Full engagement system with optimistic UI
- 📊 **User Dashboard** - Manage drafts and published posts
- 🔍 **Search & Discovery** - Find posts by tags, search, trending

### Anonymous User Features
- Create up to 3 posts before signing in
- Posts saved to localStorage
- Automatic migration to database on sign-in

### Technical Highlights
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js App Router
- 🗄️ **PostgreSQL Database** - Hosted on Neon with Prisma ORM
- 🎨 **Modern UI** - Capacity.so-inspired dark theme with teal/orange accents
- 📱 **Fully Responsive** - Mobile-first design
- 🔒 **Type-Safe** - Full TypeScript coverage
- 🎭 **Optimistic UI** - Instant feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Rich Text**: TipTap
- **Animations**: Framer Motion
- **State**: React Hooks + Server Actions

### Backend
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4
- **File Storage**: UploadThing
- **API**: Next.js Route Handlers

### DevOps
- **Deployment**: Vercel
- **Version Control**: Git
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- PostgreSQL database (we recommend [Neon](https://neon.tech))
- Clerk account ([clerk.com](https://clerk.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- UploadThing account ([uploadthing.com](https://uploadthing.com))

### 1. Clone the Repository

```bash
git clone https://github.com/HiNala/raindrop_hack.git
cd raindrop_hack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

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
```

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed demo data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with demo data
```

## 🗂️ Project Structure

```
blog-app/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding
│   └── migrations/       # Migration history
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── actions/     # Server Actions
│   │   ├── api/         # API Routes
│   │   ├── dashboard/   # User dashboard
│   │   ├── editor/      # Post editor
│   │   ├── p/           # Public post pages
│   │   ├── sign-in/     # Auth pages
│   │   └── ...
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── editor/      # Editor components
│   │   ├── post/        # Post-related components
│   │   └── ...
│   ├── lib/             # Utilities & helpers
│   │   ├── prisma.ts    # Prisma client
│   │   ├── auth.ts      # Auth utilities
│   │   ├── openai.ts    # OpenAI integration
│   │   └── ...
│   └── middleware.ts    # Clerk middleware
├── .env.example         # Environment template
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Color Palette (Capacity.so Inspired)

```css
/* Primary Colors */
--teal-500: #14b8a6      /* Primary CTAs */
--teal-600: #0d9488      /* Hover states */
--orange-500: #f97316    /* Accents */
--orange-600: #ea580c    /* Hover accents */

/* Dark Theme */
--dark-bg: #0a0a0b       /* Main background */
--dark-card: #1a1a1d     /* Card backgrounds */
--dark-border: #27272a   /* Borders */

/* Text */
--text-primary: #fafafa  /* Primary text */
--text-secondary: #a1a1aa /* Secondary text */
```

## 🔐 Authentication Flow

1. **Sign Up**: User creates account via Clerk
2. **Database Sync**: User and Profile records created automatically
3. **Protected Routes**: Dashboard and editor require authentication
4. **Anonymous Posts**: Migrate localStorage posts on first sign-in

## 📝 Key Features Explained

### AI Blog Generation
- Enter a prompt describing your blog post
- Choose tone (professional/casual/technical) and length
- AI generates title, content, and suggested tags
- Edit in rich text editor before publishing

### Anonymous Posting
- Users can create up to 3 posts without signing in
- Posts stored in localStorage
- On sign-in, posts automatically migrate to database
- Perfect for trying the platform before committing

### Rich Text Editor
- Full markdown support
- Code blocks with syntax highlighting
- Image embedding
- Link insertion
- Headings, lists, quotes, and more

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HiNala/raindrop_hack)

### Environment Variables for Production

Make sure to set all environment variables in your Vercel project settings:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_*` - All Clerk keys
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication
- [Neon](https://neon.tech/) - Serverless Postgres
- [Prisma](https://prisma.io/) - Database ORM
- [OpenAI](https://openai.com/) - AI Generation
- [TipTap](https://tiptap.dev/) - Rich Text Editor
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Capacity.so](https://capacity.so/) - Design Inspiration

## 📞 Support

For support, email support@yourdomain.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Dark/Light mode toggle
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Analytics dashboard
- [ ] Comment threading
- [ ] Post scheduling
- [ ] Draft collaboration
- [ ] Mobile app

---

Built with ❤️ using Next.js and modern web technologies.
