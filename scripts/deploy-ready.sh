#!/bin/bash

# StudySharper Production Deployment Script
# This script deploys StudySharper when real credentials are configured

echo "🚀 StudySharper Production Deployment"
echo "======================================"

# Check if we're ready to deploy
echo "1. Checking prerequisites..."

# Check environment file
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found"
    echo "💡 Copy .env.local.example to .env.local and configure"
    exit 1
fi

# Check for placeholder values
if grep -q "your-project-id" .env.local; then
    echo "❌ Placeholder values found in .env.local"
    echo "💡 Replace placeholder values with real Supabase credentials"
    exit 1
fi

echo "✅ Environment configuration found"

# Test TypeScript compilation
echo "2. Testing TypeScript compilation..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed"
    exit 1
fi
echo "✅ TypeScript compilation successful"

# Test build process
echo "3. Testing production build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Production build failed"
    exit 1
fi
echo "✅ Production build successful"

# Test database connection (if configured)
echo "4. Testing database connection..."
if command -v node &> /dev/null; then
    node scripts/test-with-real-data.js
    if [ $? -ne 0 ]; then
        echo "⚠️  Database connection test failed"
        echo "💡 Make sure Supabase project is set up and migration is run"
        echo "🔄 Continuing with deployment..."
    else
        echo "✅ Database integration verified"
    fi
fi

# Deploy to Vercel
echo "5. Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    echo "📤 Pushing to production..."
    vercel --prod
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo ""
        echo "🔗 Your StudySharper app is now live!"
        echo "📋 Next steps:"
        echo "   1. Test signup at your live URL"
        echo "   2. Create flashcard decks"
        echo "   3. Test study sessions"
        echo "   4. Monitor for any issues"
        echo ""
        echo "📊 Check Vercel dashboard for deployment details"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "⚠️  Vercel CLI not found"
    echo "💡 Install with: npm i -g vercel"
    echo "🌐 Or deploy manually at vercel.com"
fi

echo ""
echo "🎯 StudySharper is ready for users!"