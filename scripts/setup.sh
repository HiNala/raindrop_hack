#!/bin/bash

# 🚀 Blog Platform Setup Script
# This script helps verify and set up the blog platform

echo "🌟 Welcome to the Raindrop Blog Platform Setup! 🌟"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the blog-app directory"
    exit 1
fi

echo ""
echo "📋 Checking prerequisites..."

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js: $NODE_VERSION"

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "✅ npm is available"
else
    echo "❌ npm is not found. Please install Node.js and npm."
    exit 1
fi

# Check environment files
echo ""
echo "🔧 Checking environment configuration..."

if [ -f ".env.local" ]; then
    echo "✅ .env.local exists"
else
    echo "⚠️  .env.local not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "📝 Please edit .env.local with your actual environment variables"
    else
        echo "❌ .env.example not found"
        exit 1
    fi
fi

# Check required environment variables
echo ""
echo "🔍 Checking required environment variables..."

REQUIRED_VARS=(
    "DATABASE_URL"
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "OPENAI_API_KEY"
    "UPLOADTHING_SECRET"
    "UPLOADTHING_APP_ID"
)

for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" .env.local; then
        VALUE=$(grep "^${var}=" .env.local | cut -d'=' -f2)
        if [ "$VALUE" = "" ] || [[ "$VALUE" == *"your-"* ]] || [[ "$VALUE" == *"pk_test"* ]] || [[ "$VALUE" == *"sk_test"* ]]; then
            echo "⚠️  $var is set but may need actual values"
        else
            echo "✅ $var is configured"
        fi
    else
        echo "❌ $var is missing from .env.local"
    fi
done

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🗄️  Setting up database..."
npx prisma generate

# Check database connection
echo ""
echo "🔌 Testing database connection..."
if npx prisma db push --accept-data-loss 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your DATABASE_URL"
    echo "   Make sure Neon database is accessible and URL is correct"
fi

# Build project
echo ""
echo "🏗️  Building project..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check the error messages above"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Here's what to do next:"
echo ""
echo "1. 📝 Edit .env.local with your actual API keys and URLs:"
echo "   - Clerk: https://clerk.com (create app, get keys)"
echo "   - Neon: https://neon.tech (create database, get connection string)"
echo "   - OpenAI: https://platform.openai.com (get API key)"
echo "   - UploadThing: https://uploadthing.com (create app, get credentials)"
echo ""
echo "2. 🚀 Start the development server:"
echo "   npm run dev"
echo ""
echo "3. 🌐 Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "4. ✨ Test the features:"
echo "   - Sign up for an account"
echo "   - Try AI post generation"
echo "   - Create and publish posts"
echo "   - Upload images"
echo "   - Leave comments and likes"
echo ""
echo "📚 For more help, check:"
echo "   - README.md: Overview and features"
echo "   - DEPLOYMENT.md: Production deployment guide"
echo "   - API_REFERENCE.md: API documentation"
echo ""
echo "🐛 If you encounter issues:"
echo "   - Check environment variables are correctly set"
echo "   - Verify database connection"
echo "   - Check browser console for errors"
echo "   - Review server logs in terminal"
echo ""
echo "Happy coding! 🚀"