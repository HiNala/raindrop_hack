# Blog App Startup Script
# Run this script to start the development server

Write-Host "🚀 Starting Blog App..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local not found!" -ForegroundColor Yellow
    Write-Host "Please copy .env.example to .env.local and fill in your credentials" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        exit
    }
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if Prisma Client is generated
Write-Host "🔧 Checking Prisma Client..." -ForegroundColor Cyan
npx prisma generate --silent

# Clean .next folder if it has permission issues
if (Test-Path ".next") {
    Write-Host "🧹 Cleaning build cache..." -ForegroundColor Cyan
    try {
        Get-ChildItem .next -Recurse -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "⚠️  Some cache files couldn't be deleted (this is OK)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Starting development server..." -ForegroundColor Green
Write-Host "📍 Your app will be available at:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000 (or another port if 3000 is busy)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the dev server
npm run dev


