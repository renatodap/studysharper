import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Determine tier based on price
        let tier = 'free'
        const priceId = subscription.items.data[0]?.price.id
        if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
          tier = 'starter'
        } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = 'pro'
        }

        // Update user profile
        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            subscription_tier: tier,
            subscription_status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            ai_queries_limit: tier === 'pro' ? 999999 : tier === 'starter' ? 1000 : 100,
          })
          .eq('id', userId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        // Determine tier based on price
        let tier = 'free'
        const priceId = subscription.items.data[0]?.price.id
        if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
          tier = 'starter'
        } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = 'pro'
        }

        // Update subscription status
        await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_status: subscription.status as any,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            ai_queries_limit: tier === 'pro' ? 999999 : tier === 'starter' ? 1000 : 100,
          })
          .eq('id', profile.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        // Reset to free tier
        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'inactive',
            stripe_subscription_id: null,
            current_period_end: null,
            ai_queries_limit: 100,
          })
          .eq('id', profile.id)

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Reset monthly AI queries on successful payment
        const customerId = invoice.customer as string
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, subscription_tier')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          const limit = profile.subscription_tier === 'pro' ? 999999 : 
                       profile.subscription_tier === 'starter' ? 1000 : 100
          
          await supabase
            .from('profiles')
            .update({
              ai_queries_used: 0,
              ai_queries_limit: limit,
              ai_queries_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              monthly_cost: 0,
            })
            .eq('id', profile.id)
        }
        
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}