'use client'

import { Clock, FileText, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function RecentActivity({ sessions, notes }: { sessions: any[]; notes: any[] }) {
  const activities = [
    ...sessions.map(s => ({ 
      type: 'session', 
      title: s.title, 
      time: s.created_at,
      duration: s.duration_minutes,
      icon: Clock
    })),
    ...notes.map(n => ({ 
      type: 'note', 
      title: n.title, 
      time: n.created_at,
      subject: n.subject,
      icon: FileText
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No recent activity</p>
          <p className="text-sm text-gray-500 mt-1">Start studying to see your progress here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'session' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                }`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-400">
                    {activity.type === 'session' 
                      ? `${(activity as any).duration} minutes`
                      : (activity as any).subject || 'General'}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(activity.time)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}