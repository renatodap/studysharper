import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null as any

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      aiQueries: 100,
      notes: 'unlimited',
      flashcards: 'unlimited',
      studyGroups: false,
      export: false,
      priority: false,
    },
  },
  starter: {
    name: 'Starter',
    price: 500, // $5 in cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: {
      aiQueries: 1000,
      notes: 'unlimited',
      flashcards: 'unlimited',
      studyGroups: true,
      export: true,
      priority: true,
    },
  },
  pro: {
    name: 'Pro',
    price: 1000, // $10 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: {
      aiQueries: 'unlimited',
      notes: 'unlimited',
      flashcards: 'unlimited',
      studyGroups: true,
      export: true,
      priority: true,
      api: true,
      whiteLabel: true,
    },
  },
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        userId,
      },
    },
  })

  return session
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })

  return subscription
}