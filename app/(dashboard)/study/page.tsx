import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PomodoroTimer } from '@/components/study/PomodoroTimer'
import { StudySessionForm } from '@/components/study/StudySessionForm'
import { RecentSessions } from '@/components/study/RecentSessions'
import { StudyStats } from '@/components/study/StudyStats'

export default async function StudyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch recent study sessions
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate stats
  const totalMinutes = sessions?.reduce((acc, s) => acc + s.duration_minutes, 0) || 0
  const totalSessions = sessions?.length || 0
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
  const avgFocus = sessions?.reduce((acc, s) => acc + (s.focus_score || 0), 0) || 0
  const avgFocusScore = totalSessions > 0 ? Math.round(avgFocus / totalSessions) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Study Sessions</h1>
        <p className="text-gray-400 mt-2">
          Track your study time and stay focused with the Pomodoro technique
        </p>
      </div>

      {/* Stats */}
      <StudyStats
        totalMinutes={totalMinutes}
        totalSessions={totalSessions}
        avgDuration={avgDuration}
        avgFocusScore={avgFocusScore}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pomodoro Timer */}
        <div>
          <PomodoroTimer userId={user.id} />
        </div>

        {/* Session Form */}
        <div>
          <StudySessionForm userId={user.id} />
        </div>
      </div>

      {/* Recent Sessions */}
      <RecentSessions sessions={sessions || []} />
    </div>
  )
}