# 🚀 Blog Platform Setup Script (PowerShell)
# This script helps verify and set up the blog platform

Write-Host "🌟 Welcome to the Raindrop Blog Platform Setup! 🌟" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the blog-app directory" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js version
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    npm --version | Out-Null
    Write-Host "✅ npm is available" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not found. Please install Node.js and npm." -ForegroundColor Red
    exit 1
}

# Check environment files
Write-Host ""
Write-Host "🔧 Checking environment configuration..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "📝 Please edit .env.local with your actual environment variables" -ForegroundColor Cyan
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        exit 1
    }
}

# Check required environment variables
Write-Host ""
Write-Host "🔍 Checking required environment variables..." -ForegroundColor Yellow

$requiredVars = @(
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "OPENAI_API_KEY",
    "UPLOADTHING_SECRET",
    "UPLOADTHING_APP_ID"
)

$envContent = Get-Content ".env.local"
foreach ($var in $requiredVars) {
    $line = $envContent | Where-Object { $_ -match "^${var}=" }
    if ($line) {
        $value = ($line -split "=")[1]
        if ($value -eq "" -or $value -match "your-" -or $value -match "pk_test" -or $value -match "sk_test") {
            Write-Host "⚠️  $var is set but may need actual values" -ForegroundColor Yellow
        } else {
            Write-Host "✅ $var is configured" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ $var is missing from .env.local" -ForegroundColor Red
    }
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host ""
Write-Host "🗄️  Setting up database..." -ForegroundColor Yellow
npx prisma generate

# Check database connection
Write-Host ""
Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow
try {
    npx prisma db push --accept-data-loss 2>$null
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Database connection failed. Please check your DATABASE_URL" -ForegroundColor Red
    Write-Host "   Make sure Neon database is accessible and URL is correct" -ForegroundColor Red
}

# Build project
Write-Host ""
Write-Host "🏗️  Building project..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed. Please check the error messages above" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup complete! Here's what to do next:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 📝 Edit .env.local with your actual API keys and URLs:" -ForegroundColor White
Write-Host "   - Clerk: https://clerk.com (create app, get keys)" -ForegroundColor Gray
Write-Host "   - Neon: https://neon.tech (create database, get connection string)" -ForegroundColor Gray
Write-Host "   - OpenAI: https://platform.openai.com (get API key)" -ForegroundColor Gray
Write-Host "   - UploadThing: https://uploadthing.com (create app, get credentials)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🚀 Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🌐 Open your browser to:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "4. ✨ Test the features:" -ForegroundColor White
Write-Host "   - Sign up for an account" -ForegroundColor Gray
Write-Host "   - Try AI post generation" -ForegroundColor Gray
Write-Host "   - Create and publish posts" -ForegroundColor Gray
Write-Host "   - Upload images" -ForegroundColor Gray
Write-Host "   - Leave comments and likes" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 For more help, check:" -ForegroundColor White
Write-Host "   - README.md: Overview and features" -ForegroundColor Gray
Write-Host "   - DEPLOYMENT.md: Production deployment guide" -ForegroundColor Gray
Write-Host "   - API_REFERENCE.md: API documentation" -ForegroundColor Gray
Write-Host ""
Write-Host "🐛 If you encounter issues:" -ForegroundColor Yellow
Write-Host "   - Check environment variables are correctly set" -ForegroundColor Gray
Write-Host "   - Verify database connection" -ForegroundColor Gray
Write-Host "   - Check browser console for errors" -ForegroundColor Gray
Write-Host "   - Review server logs in terminal" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan