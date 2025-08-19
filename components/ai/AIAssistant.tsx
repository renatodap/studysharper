'use client'

import { useState } from 'react'
import { Brain, Send, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export function AIAssistant({ profile }: { profile: any }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: 'study_assistant'
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You have reached your AI query limit. Please upgrade to continue.')
        }
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const remainingQueries = profile?.ai_queries_limit - profile?.ai_queries_used
  const showLimit = profile?.subscription_tier === 'free'

  return (
    <div id="ai-assistant" className="bg-dark-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-brand-400" />
          <h2 className="text-xl font-semibold text-white">AI Study Assistant</h2>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
        {showLimit && (
          <span className="text-sm text-gray-400">
            {remainingQueries} queries left
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Ask me anything about your studies!</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">Try asking:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Explain quantum physics simply',
                  'Create flashcards for biology',
                  'Help me with calculus homework',
                  'Study tips for exams'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-xs px-3 py-1 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-brand-500/20 text-white'
                    : 'bg-dark-800 text-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 p-3 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          disabled={loading || remainingQueries <= 0}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim() || remainingQueries <= 0}
          className="bg-brand-500 hover:bg-brand-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {showLimit && remainingQueries <= 10 && (
        <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <p className="text-sm text-yellow-300">
            You have {remainingQueries} AI queries remaining this month.{' '}
            <a href="/pricing" className="underline">Upgrade to Pro</a> for unlimited queries.
          </p>
        </div>
      )}
    </div>
  )
}