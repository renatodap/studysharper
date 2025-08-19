'use client'

import { Clock, TrendingUp, Target, Award } from 'lucide-react'

interface StudyStatsProps {
  totalMinutes: number
  totalSessions: number
  avgDuration: number
  avgFocusScore: number
}

export function StudyStats({ totalMinutes, totalSessions, avgDuration, avgFocusScore }: StudyStatsProps) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Clock className="h-5 w-5" />}
        title="Total Study Time"
        value={`${hours}h ${minutes}m`}
        subtitle={`${totalSessions} sessions`}
        color="text-blue-500"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        title="Average Duration"
        value={`${avgDuration} min`}
        subtitle="per session"
        color="text-green-500"
      />
      <StatCard
        icon={<Target className="h-5 w-5" />}
        title="Focus Score"
        value={`${avgFocusScore}%`}
        subtitle="average focus"
        color="text-purple-500"
      />
      <StatCard
        icon={<Award className="h-5 w-5" />}
        title="Productivity"
        value={getProductivityLevel(avgFocusScore)}
        subtitle="current level"
        color="text-yellow-500"
      />
    </div>
  )
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  color: string
}) {
  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
    </div>
  )
}

function getProductivityLevel(score: number): string {
  if (score >= 90) return 'Elite'
  if (score >= 75) return 'Expert'
  if (score >= 60) return 'Proficient'
  if (score >= 45) return 'Developing'
  return 'Beginner'
}