import Anthropic from '@anthropic-ai/sdk'

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null

export async function queryClaudeAI(prompt: string, systemPrompt?: string) {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured')
  }
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      system: systemPrompt || 'You are a helpful AI study assistant. Help students learn effectively.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      return content.text
    }
    
    throw new Error('Unexpected response format')
  } catch (error) {
    console.error('Claude AI error:', error)
    throw error
  }
}

export function estimateClaudeCost(prompt: string, response: string): number {
  // Claude 3 Sonnet pricing (approximate)
  // Input: $0.003 per 1K tokens
  // Output: $0.015 per 1K tokens
  
  // Rough estimation: 1 token ≈ 4 characters
  const inputTokens = Math.ceil(prompt.length / 4)
  const outputTokens = Math.ceil(response.length / 4)
  
  const inputCost = (inputTokens / 1000) * 0.003
  const outputCost = (outputTokens / 1000) * 0.015
  
  return inputCost + outputCost
}