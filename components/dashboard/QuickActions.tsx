'use client'

import Link from 'next/link'
import { Plus, BookOpen, Clock, Brain, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function QuickActions() {
  const actions = [
    { icon: FileText, label: 'New Note', href: '/notes/new', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'Create Flashcards', href: '/flashcards/new', color: 'bg-green-500' },
    { icon: Clock, label: 'Start Study Session', href: '/study/new', color: 'bg-purple-500' },
    { icon: Brain, label: 'Ask AI', href: '#ai-assistant', color: 'bg-brand-500' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.label} href={action.href}>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center space-y-2 border-gray-800 hover:bg-dark-800 hover:border-brand-500/50 transition-all"
            >
              <div className={`${action.color} p-2 rounded-lg bg-opacity-20`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-gray-300">{action.label}</span>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}