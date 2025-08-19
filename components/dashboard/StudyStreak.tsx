'use client'

import { Flame, TrendingUp } from 'lucide-react'

export function StudyStreak({ streak }: { streak: any }) {
  const currentStreak = streak?.current_streak || 0
  const longestStreak = streak?.longest_streak || 0
  const totalDays = streak?.total_study_days || 0

  // Generate calendar view for last 30 days
  const today = new Date()
  const days = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toISOString().split('T')[0],
      studied: Math.random() > 0.3, // Mock data - replace with real data
    })
  }

  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Study Streak</h2>
        <Flame className="h-6 w-6 text-orange-500" />
      </div>

      {/* Current Streak */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-brand-400 mb-2">{currentStreak}</div>
        <p className="text-gray-400">Day Streak</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Longest</span>
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
          <p className="text-lg font-semibold text-white">{longestStreak} days</p>
        </div>
        <div className="bg-dark-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Total</span>
            <Flame className="h-3 w-3 text-orange-500" />
          </div>
          <p className="text-lg font-semibold text-white">{totalDays} days</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Last 30 Days</p>
        <div className="grid grid-cols-10 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`aspect-square rounded ${
                day.studied
                  ? 'bg-brand-500/40 border border-brand-500/60'
                  : 'bg-dark-800 border border-gray-700'
              }`}
              title={day.date}
            />
          ))}
        </div>
      </div>

      {/* Motivation */}
      <div className="mt-4 p-3 bg-brand-500/10 rounded-lg border border-brand-500/30">
        <p className="text-sm text-brand-300">
          {currentStreak === 0
            ? "Start studying today to begin your streak!"
            : currentStreak < 7
            ? "Great start! Keep it up for a week!"
            : currentStreak < 30
            ? "Amazing progress! Can you reach 30 days?"
            : "You're on fire! Keep the momentum going!"}
        </p>
      </div>
    </div>
  )
}