import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { StudyStreak } from '@/components/dashboard/StudyStreak'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AIAssistant } from '@/components/ai/AIAssistant'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch user data
  const [profileResult, streakResult, sessionsResult, notesResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('study_streaks').select('*').eq('user_id', user.id).single(),
    supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
  ])

  const profile = profileResult.data
  const streak = streakResult.data
  const recentSessions = sessionsResult.data || []
  const recentNotes = notesResult.data || []

  // Calculate stats
  const totalStudyTime = recentSessions.reduce((acc, session) => acc + (session.duration_minutes || 0), 0)
  const averageFocusScore = recentSessions.length > 0 
    ? recentSessions.reduce((acc, session) => acc + (session.focus_score || 0), 0) / recentSessions.length
    : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {profile?.full_name || 'Student'}!
        </h1>
        <p className="text-gray-400 mt-2">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStats
          title="Study Streak"
          value={`${streak?.current_streak || 0} days`}
          change={streak?.current_streak > 0 ? '+1' : '0'}
          icon="fire"
        />
        <DashboardStats
          title="Total Study Time"
          value={`${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`}
          change={`+${totalStudyTime} this week`}
          icon="clock"
        />
        <DashboardStats
          title="Focus Score"
          value={`${Math.round(averageFocusScore)}%`}
          change={averageFocusScore > 70 ? 'Great!' : 'Keep going!'}
          icon="target"
        />
        <DashboardStats
          title="AI Queries"
          value={`${profile?.ai_queries_used || 0}/${profile?.ai_queries_limit || 100}`}
          change={`${profile?.ai_queries_limit - profile?.ai_queries_used} remaining`}
          icon="brain"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Streak */}
        <div className="lg:col-span-1">
          <StudyStreak streak={streak} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity sessions={recentSessions} notes={recentNotes} />
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant profile={profile} />
    </div>
  )
}