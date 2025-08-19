# 🚀 StudySharper - Real Service Setup & Testing

## STEP 1: Set Up Real Supabase Project

### Create Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization
4. Project name: `studysharper-test`
5. Database password: `StudySharper2024!`
6. Region: closest to you
7. Click "Create new project"

### Get Credentials
Once project is created:
1. Go to Settings → API
2. Copy these values:
   - Project URL: `https://[your-id].supabase.co`
   - `anon` public key
   - `service_role` secret key

## STEP 2: Run Database Migration

1. In Supabase dashboard, go to SQL Editor
2. Click "New query"
3. Copy entire contents of `supabase/migrations/0001_init.sql`
4. Paste and click "Run"
5. Verify tables created in Table Editor

## STEP 3: Configure Environment

Update `.env.local` with real values:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-real-service-key

# Disable AI/payments for testing
ENABLE_AI_FEATURES=false
ENABLE_PAYMENTS=false
ENABLE_ANALYTICS=false
```

## STEP 4: Test Authentication

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/sign-up
3. Create test account: test@studysharper.com
4. Check Supabase auth users table
5. Verify profile created in profiles table

## STEP 5: Test Flashcard System

1. Sign in with test account
2. Go to /flashcards
3. Click "Create Manually"
4. Create deck: "Test Deck"
5. Add cards:
   - Front: "What is the capital of France?"
   - Back: "Paris"
6. Verify data in flashcard_decks and flashcards tables

## STEP 6: Test Study Session

1. Click "Study" on created deck
2. Go through study session
3. Rate recall quality
4. Verify spaced repetition updates in database
5. Check study_sessions table for session record

## STEP 7: Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Test live URL

## STEP 8: Verify Production

1. Test signup on live site
2. Create flashcards on live site
3. Study session on live site
4. Check database for real data
5. Confirm everything works

This is REAL testing with REAL data and REAL users.