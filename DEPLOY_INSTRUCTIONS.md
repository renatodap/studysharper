# 🎯 StudySharper Deployment Instructions

## EXACTLY WHAT YOU HAVE TO DO

I've built the code. Here's exactly what YOU need to do to deploy it, step by step.

---

## ⚠️ BEFORE YOU START

**What I've Done:**
- ✅ Built complete Next.js application
- ✅ Created database schema
- ✅ Implemented all features
- ✅ Verified code compiles and builds
- ✅ Created deployment scripts

**What I HAVEN'T Done:**
- ❌ Set up actual Supabase project
- ❌ Tested with real users
- ❌ Connected real payment system
- ❌ Deployed to live server

**Your Job:** Connect real services and deploy

---

## STEP 1: SET UP SUPABASE DATABASE (5 minutes)

### 1.1 Create Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up/login with GitHub
4. Click "New project"
5. Choose organization
6. Project name: `studysharper`
7. Database password: **Write this down** (you'll need it)
8. Region: Choose closest to your users
9. Click "Create new project"
10. **Wait 2-3 minutes** for project to be ready

### 1.2 Run Database Migration
1. In Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Open this file: `studysharper-deploy/supabase/migrations/0001_init.sql`
4. **Copy ALL the contents** (it's 399 lines)
5. **Paste into Supabase SQL editor**
6. Click "Run" button
7. Should see:
   ```
   ✅ SUCCESS: All 14 tables created successfully!
   📊 Created tables: profiles, study_sessions, notes, flashcards, flashcard_decks, ai_conversations, study_goals, study_streaks, pomodoro_sessions, usage_tracking, referrals, achievements, team_study_rooms, team_study_members
   ```
8. Go to "Table Editor" to verify 14 tables were created

**If you see any errors:**
- The migration will automatically drop existing tables first
- This is safe to run multiple times
- All tables will be recreated with correct structure

### 1.3 Get Your Credentials
1. Go to Settings → API
2. Copy these 3 values:
   - **Project URL**: `https://[something].supabase.co`
   - **anon public key**: `eyJ...` (long string)
   - **service_role secret key**: `eyJ...` (long string)

---

## STEP 2: CONFIGURE ENVIRONMENT (2 minutes)

### 2.1 Edit Environment File
1. Open `studysharper-deploy/.env.local`
2. Replace these lines with YOUR values:

```bash
# Replace with YOUR Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY-HERE
```

### 2.2 Test Database Connection
1. Open terminal in `studysharper-deploy` folder
2. Run: `node scripts/test-with-real-data.js`
3. Should see: "✅ Database connection successful"
4. If you see errors, your credentials are wrong

---

## STEP 3: TEST LOCALLY (3 minutes)

### 3.1 Start Development Server
1. In terminal: `npm run dev`
2. Go to http://localhost:3000
3. Should see StudySharper homepage

### 3.2 Test User Signup
1. Click "Sign Up" or go to http://localhost:3000/sign-up
2. Create account with YOUR email
3. Check your email for verification
4. Click verification link
5. Should redirect to dashboard

### 3.3 Test Flashcards
1. Go to http://localhost:3000/flashcards
2. Click "Create Manually"
3. Create deck: "Test Deck"
4. Add card:
   - Front: "What is 2+2?"
   - Back: "4"
5. Click "Create Deck"
6. Should see your deck listed

### 3.4 Test Study Session
1. Click "Study" on your deck
2. Should see your flashcard
3. Click to reveal answer
4. Rate your recall (1-5)
5. Should complete successfully

**If ANY of these steps fail, STOP. The app is not ready.**

---

## STEP 4: DEPLOY TO VERCEL (5 minutes)

### 4.1 Push to GitHub
1. Create GitHub repository
2. Push your code:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 4.2 Deploy with Vercel
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Import Project"
4. Select your GitHub repo
5. Click "Import"

### 4.3 Add Environment Variables
In Vercel deployment settings, add:
```
NEXT_PUBLIC_SUPABASE_URL = your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
ENABLE_AI_FEATURES = false
ENABLE_PAYMENTS = false
ENABLE_ANALYTICS = false
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Get your live URL: `https://your-app.vercel.app`

---

## STEP 5: TEST LIVE DEPLOYMENT (5 minutes)

### 5.1 Test Live Signup
1. Go to your Vercel URL
2. Click "Sign Up"
3. Create NEW account with different email
4. Verify email works
5. Login successful

### 5.2 Test Live Flashcards
1. Create flashcard deck on live site
2. Add cards on live site
3. Test study session on live site
4. Verify everything works

---

## STEP 6: SET UP PAYMENTS (OPTIONAL - 10 minutes)

### 6.1 Create Stripe Account
1. Go to https://stripe.com
2. Create account
3. Get test API keys from dashboard

### 6.2 Add Stripe to Environment
Update Vercel environment variables:
```
STRIPE_SECRET_KEY = sk_test_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_your-key
ENABLE_PAYMENTS = true
```

### 6.3 Create Stripe Products
1. In Stripe dashboard, go to Products
2. Create "StudySharper Starter" - $5/month
3. Create "StudySharper Pro" - $10/month
4. Copy price IDs to environment

---

## 🚨 TROUBLESHOOTING

### Database Issues
- **Error: relation does not exist**
  → Migration didn't run. Redo Step 1.2

- **Error: authentication failed**
  → Wrong credentials. Check Step 1.3

### Build Issues
- **TypeScript errors**
  → Run: `npm run typecheck` to see errors

- **Build fails**
  → Run: `npm run build` locally first

### Deployment Issues
- **Environment variables not working**
  → Check spelling and regenerate deployment

---

## ✅ SUCCESS CRITERIA

**You know it's working when:**
1. ✅ Local signup/login works
2. ✅ Can create flashcard decks
3. ✅ Study sessions work with spaced repetition
4. ✅ Live deployment works same as local
5. ✅ Users can sign up on live site

---

## 📞 IF YOU GET STUCK

**Common Issues:**
1. **Supabase credentials wrong** → Double-check Step 1.3
2. **Environment not loading** → Check `.env.local` file exists
3. **Build fails** → Run `npm install` then `npm run build`
4. **Vercel deployment fails** → Check environment variables

**Debug Steps:**
1. Run `node scripts/test-with-real-data.js`
2. Check browser console for errors
3. Check Vercel deployment logs
4. Check Supabase logs in dashboard

---

## 🎯 WHAT YOU'LL HAVE

**When complete:**
- Live StudySharper app at your Vercel URL
- User authentication working
- Flashcard creation and study
- Spaced repetition algorithm
- Production database
- Ready for real users

**Total Time:** 20-30 minutes

**Difficulty:** Medium (requires following steps exactly)

This is what YOU need to do. The code is ready. The deployment just needs real services connected.