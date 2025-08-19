import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { queryClaudeAI, estimateClaudeCost } from '@/lib/ai/claude'
import { queryOpenAI, estimateOpenAICost } from '@/lib/ai/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile and check limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check usage limits
    if (profile.ai_queries_used >= profile.ai_queries_limit) {
      return NextResponse.json(
        { error: 'AI query limit reached. Please upgrade your plan.' },
        { status: 429 }
      )
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let response: string
    let cost: number

    try {
      // Try Claude first (better quality)
      response = await queryClaudeAI(message)
      cost = estimateClaudeCost(message, response)
    } catch (claudeError) {
      console.error('Claude failed, falling back to OpenAI:', claudeError)
      // Fallback to OpenAI
      response = await queryOpenAI(message)
      cost = estimateOpenAICost(message, response)
    }

    // Update usage
    await supabase
      .from('profiles')
      .update({
        ai_queries_used: profile.ai_queries_used + 1,
        monthly_cost: profile.monthly_cost + cost,
      })
      .eq('id', user.id)

    // Track usage for analytics
    await supabase
      .from('usage_tracking')
      .insert({
        user_id: user.id,
        feature: 'ai_chat',
        action: 'query',
        metadata: { context, model: 'claude-3-sonnet' },
        cost_usd: cost,
      })

    // Save conversation
    await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        title: message.substring(0, 50),
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: response },
        ],
        tokens_used: Math.ceil((message.length + response.length) / 4),
        model: 'claude-3-sonnet',
      })

    return NextResponse.json({ message: response, cost })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process AI request' },
      { status: 500 }
    )
  }
}