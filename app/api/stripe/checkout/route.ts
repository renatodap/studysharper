import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, PLANS } from '@/lib/stripe/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()

    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = PLANS[plan as keyof typeof PLANS].priceId

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    const session = await createCheckoutSession(
      user.id,
      user.email!,
      priceId,
      `${origin}/dashboard?success=true`,
      `${origin}/pricing?canceled=true`
    )

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}