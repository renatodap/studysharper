'use client'

import { Clock, BookOpen, Target, CheckCircle, Circle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Session {
  id: string
  title: string
  subject: string | null
  duration_minutes: number
  focus_score: number | null
  completed: boolean
  techniques_used: string[] | null
  mood_before: string | null
  mood_after: string | null
  created_at: string
}

export function RecentSessions({ sessions }: { sessions: Session[] }) {
  const router = useRouter()
  const supabase = createClient()

  const completeSession = async (sessionId: string) => {
    const focusScore = prompt('Rate your focus level (0-100):')
    if (!focusScore) return

    const score = Math.min(100, Math.max(0, parseInt(focusScore)))

    try {
      const { error } = await supabase
        .from('study_sessions')
        .update({
          completed: true,
          focus_score: score,
          ended_at: new Date().toISOString(),
        })
        .eq('id', sessionId)

      if (error) throw error

      toast.success('Session completed!')
      router.refresh()
    } catch (error: any) {
      toast.error('Failed to complete session')
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-8">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No Study Sessions Yet</h3>
          <p className="text-gray-400">Start your first study session to track your progress</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Sessions</h2>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {session.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-yellow-500" />
                  )}
                  <h3 className="text-white font-medium">{session.title}</h3>
                  {session.subject && (
                    <span className="text-xs px-2 py-1 bg-brand-500/20 text-brand-300 rounded">
                      {session.subject}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {session.duration_minutes} min
                  </span>
                  
                  {session.focus_score !== null && (
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {session.focus_score}% focus
                    </span>
                  )}
                  
                  <span>{formatDate(session.created_at)}</span>
                </div>

                {session.techniques_used && session.techniques_used.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {session.techniques_used.map((technique) => (
                      <span
                        key={technique}
                        className="text-xs px-2 py-1 bg-dark-700 text-gray-300 rounded"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!session.completed && (
                <Button
                  onClick={() => completeSession(session.id)}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}