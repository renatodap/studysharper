import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export async function queryOpenAI(prompt: string, systemPrompt?: string) {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful AI study assistant. Help students learn effectively.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'No response generated'
  } catch (error) {
    console.error('OpenAI error:', error)
    throw error
  }
}

export function estimateOpenAICost(prompt: string, response: string): number {
  // GPT-3.5 Turbo pricing
  // Input: $0.0005 per 1K tokens
  // Output: $0.0015 per 1K tokens
  
  // Rough estimation: 1 token ≈ 4 characters
  const inputTokens = Math.ceil(prompt.length / 4)
  const outputTokens = Math.ceil(response.length / 4)
  
  const inputCost = (inputTokens / 1000) * 0.0005
  const outputCost = (outputTokens / 1000) * 0.0015
  
  return inputCost + outputCost
}