# StudySharper Deployment Guide
## Complete Step-by-Step Instructions for Production Deployment

---

## 📋 Prerequisites

Before deployment, ensure you have:
- [ ] GitHub account with repository created
- [ ] Vercel account (free tier works)
- [ ] Supabase account and project
- [ ] Stripe account with products configured
- [ ] Anthropic API key (Claude)
- [ ] OpenAI API key (fallback)
- [ ] Upstash Redis account (for rate limiting)
- [ ] PostHog account (analytics)

---

## 🚀 Quick Deploy (15 Minutes)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/renatodap/studysharper.git
cd studysharper

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### Step 2: Configure Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for provisioning (~2 minutes)

2. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your project
   supabase link --project-ref your-project-ref

   # Run migrations
   supabase db push
   ```

3. **Enable Authentication Providers**
   - Go to Authentication → Providers
   - Enable Email/Password
   - Enable Google OAuth:
     - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
     - Add authorized redirect: `https://your-project.supabase.co/auth/v1/callback`
   - Enable Magic Link

4. **Get Supabase Keys**
   - Settings → API
   - Copy:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Configure Stripe

1. **Create Products**
   ```javascript
   // In Stripe Dashboard, create:
   
   // Starter Plan - $5/month
   {
     name: "StudySharper Starter",
     price: 500, // cents
     recurring: "monthly",
     features: "1000 AI queries, Priority support"
   }
   
   // Pro Plan - $10/month
   {
     name: "StudySharper Pro",
     price: 1000, // cents
     recurring: "monthly",
     features: "Unlimited AI, Teams, API access"
   }
   ```

2. **Get Stripe Keys**
   - Developers → API keys
   - Copy:
     - `STRIPE_SECRET_KEY`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

3. **Setup Webhook**
   - Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
   - Copy `STRIPE_WEBHOOK_SECRET`

### Step 4: Configure AI Services

1. **Anthropic (Claude)**
   - Get API key from [console.anthropic.com](https://console.anthropic.com)
   - Add to `.env.local`: `ANTHROPIC_API_KEY`

2. **OpenAI (Fallback)**
   - Get API key from [platform.openai.com](https://platform.openai.com)
   - Add to `.env.local`: `OPENAI_API_KEY`

### Step 5: Setup Rate Limiting

1. **Create Upstash Redis**
   - Go to [upstash.com](https://upstash.com)
   - Create Redis database
   - Copy:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`

### Step 6: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Add all environment variables
   - Deploy

3. **Configure Domain**
   - Settings → Domains
   - Add custom domain
   - Update DNS records

---

## 🔧 Environment Variables

Complete `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# AI Services
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...

# Redis Rate Limiting
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://studysharper.com
NEXT_PUBLIC_APP_NAME=StudySharper

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email (Optional)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@studysharper.com
```

---

## 📊 Post-Deployment Setup

### 1. Verify Core Functions

```bash
# Test authentication
curl https://yourdomain.com/api/health

# Test AI endpoint
curl -X POST https://yourdomain.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Test payment webhook
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 2. Setup Monitoring

1. **Vercel Analytics**
   - Automatically enabled
   - Check Web Vitals

2. **PostHog Events**
   - Verify events firing
   - Setup funnels
   - Create dashboards

3. **Error Tracking**
   - Monitor Vercel Functions logs
   - Setup alerts for failures

### 3. Configure n8n Automations

Deploy these workflows to your n8n instance:

1. **Welcome Email Flow**
   - Trigger: Webhook from signup
   - Send welcome email
   - Schedule follow-ups

2. **Usage Alert Flow**
   - Trigger: Daily cron
   - Check usage limits
   - Send notifications

3. **Churn Prevention**
   - Trigger: Inactivity webhook
   - Send re-engagement emails
   - Offer discounts

---

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   ```bash
   # Check service role key
   # Verify RLS policies
   # Check CORS settings
   ```

2. **Stripe Webhooks Not Working**
   ```bash
   # Verify webhook secret
   # Check endpoint URL
   # Test with Stripe CLI
   ```

3. **AI Queries Failing**
   ```bash
   # Verify API keys
   # Check rate limits
   # Monitor usage/costs
   ```

4. **Build Failures**
   ```bash
   # Run locally first
   npm run build
   npm run typecheck
   
   # Check for missing env vars
   # Verify dependencies
   ```

---

## 🚦 Production Checklist

### Security
- [ ] Environment variables secured
- [ ] RLS policies enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Input validation working

### Performance
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Caching configured
- [ ] Database indexed

### Monitoring
- [ ] Analytics tracking
- [ ] Error logging
- [ ] Performance monitoring
- [ ] Usage tracking

### Legal
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Cookie consent (if needed)
- [ ] GDPR compliance

---

## 📈 Scaling Strategy

### Phase 1: Launch (0-100 users)
- Single Vercel deployment
- Supabase free tier
- Basic monitoring

### Phase 2: Growth (100-1000 users)
- Enable Vercel Pro
- Upgrade Supabase
- Add CDN for assets
- Implement caching

### Phase 3: Scale (1000+ users)
- Database replication
- Edge functions
- Advanced caching
- Load balancing

---

## 💰 Cost Estimation

### Monthly Costs at Different Scales

| Users | Vercel | Supabase | AI APIs | Redis | Total |
|-------|--------|----------|---------|-------|-------|
| 0-100 | $0 | $0 | ~$10 | $0 | ~$10 |
| 100-500 | $20 | $25 | ~$50 | $10 | ~$105 |
| 500-2000 | $20 | $25 | ~$200 | $10 | ~$255 |
| 2000+ | $150 | $399 | ~$500+ | $59 | ~$1108+ |

---

## 🎉 Launch Day Tasks

1. **Soft Launch**
   - Deploy to production
   - Test all critical paths
   - Invite beta users

2. **Marketing**
   - Post on social media
   - Submit to directories
   - Reach out to communities

3. **Monitor**
   - Watch error logs
   - Track signups
   - Monitor performance

4. **Iterate**
   - Gather feedback
   - Fix critical bugs
   - Deploy updates

---

## 📞 Support Resources

- **Documentation**: [docs.studysharper.com](https://docs.studysharper.com)
- **Discord**: [discord.gg/studysharper](https://discord.gg/studysharper)
- **Email**: support@studysharper.com
- **Status Page**: [status.studysharper.com](https://status.studysharper.com)

---

## 🚀 Quick Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Type checking
npm run typecheck

# Deploy
git push origin main
# Vercel auto-deploys

# Database migrations
supabase db push

# Test payments
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

*Remember: Ship fast, iterate based on feedback, focus on revenue!*