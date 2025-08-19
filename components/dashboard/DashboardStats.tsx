'use client'

import { Brain, Clock, Target, Flame } from 'lucide-react'

interface DashboardStatsProps {
  title: string
  value: string
  change: string
  icon: 'brain' | 'clock' | 'target' | 'fire'
}

export function DashboardStats({ title, value, change, icon }: DashboardStatsProps) {
  const icons = {
    brain: Brain,
    clock: Clock,
    target: Target,
    fire: Flame,
  }
  
  const Icon = icons[icon]
  
  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <Icon className="h-5 w-5 text-brand-400" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-500">{change}</p>
      </div>
    </div>
  )
}