'use client'

import { useState } from 'react'
import { Brain, ChevronRight, Zap, BookOpen, Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StudySession } from './StudySession'
import CreateFlashcardModal from './CreateFlashcardModal'
import AIFlashcardGenerator from './AIFlashcardGenerator'

interface FlashcardDashboardProps {
  dueCards: any[]
  userId: string
}

export function FlashcardDashboard({ dueCards, userId }: FlashcardDashboardProps) {
  const [isStudying, setIsStudying] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  if (isStudying && dueCards.length > 0) {
    return (
      <StudySession
        cards={dueCards}
        userId={userId}
        onComplete={() => setIsStudying(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Study Now Card */}
      {dueCards.length > 0 ? (
        <div className="bg-gradient-to-r from-brand-500/20 to-purple-500/20 border border-brand-500/50 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {dueCards.length} Cards Due for Review
              </h2>
              <p className="text-gray-300 mb-4">
                Keep your streak going! Review these cards to strengthen your memory.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Estimated time: {Math.ceil(dueCards.length * 0.5)} minutes
                </span>
                <span className="flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                  Streak bonus active
                </span>
              </div>
              <Button
                onClick={() => setIsStudying(true)}
                className="bg-brand-500 hover:bg-brand-600"
                size="lg"
              >
                Start Study Session
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="hidden sm:block">
              <Brain className="h-24 w-24 text-brand-400 opacity-50" />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Cards Due for Review
          </h3>
          <p className="text-gray-400 mb-6">
            Great job! You're all caught up. Create new flashcards to continue learning.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="outline"
              className="border-gray-700"
            >
              Create Manually
            </Button>
            <Button
              onClick={() => setShowAIGenerator(true)}
              className="bg-brand-500 hover:bg-brand-600"
            >
              <Brain className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction
          icon={<Brain className="h-6 w-6" />}
          title="AI Generator"
          description="Create flashcards from any text"
          onClick={() => setShowAIGenerator(true)}
          color="bg-purple-500"
        />
        <QuickAction
          icon={<BookOpen className="h-6 w-6" />}
          title="Import Notes"
          description="Convert your notes to flashcards"
          onClick={() => {/* TODO: Implement import */}}
          color="bg-blue-500"
        />
        <QuickAction
          icon={<Target className="h-6 w-6" />}
          title="Practice Mode"
          description="Review without affecting stats"
          onClick={() => {/* TODO: Implement practice mode */}}
          color="bg-green-500"
        />
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateFlashcardModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
      
      {showAIGenerator && (
        <AIFlashcardGenerator
          userId={userId}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </div>
  )
}

function QuickAction({ 
  icon, 
  title, 
  description, 
  onClick,
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className="bg-dark-900/50 border border-gray-800 rounded-xl p-6 text-left hover:border-brand-500/50 transition-colors"
    >
      <div className={`${color} bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  )
}