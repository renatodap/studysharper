'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, RotateCw, Check, X, Brain } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { calculateNextReview } from '@/lib/flashcards/spaced-repetition'
import toast from 'react-hot-toast'

interface StudySessionProps {
  cards: any[]
  userId: string
  onComplete: () => void
}

export function StudySession({ cards, userId, onComplete }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
    startTime: new Date()
  })
  const [isFlipping, setIsFlipping] = useState(false)
  const supabase = createClient()

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setShowAnswer(!showAnswer)
        setIsFlipping(false)
      }, 150)
    }
  }

  const handleReview = async (quality: number) => {
    // Calculate next review
    const schedule = calculateNextReview(quality, {
      repetitions: currentCard.review_count || 0,
      easeFactor: currentCard.ease_factor || 2.5,
      interval: currentCard.interval || 0
    })

    // Update card in database
    try {
      await supabase
        .from('flashcards')
        .update({
          last_reviewed: new Date().toISOString(),
          next_review: schedule.nextReview.toISOString(),
          review_count: schedule.repetitions,
          ease_factor: schedule.easeFactor,
          interval: schedule.interval,
          success_rate: quality >= 3 
            ? ((currentCard.success_rate || 0) * currentCard.review_count + 1) / (currentCard.review_count + 1)
            : ((currentCard.success_rate || 0) * currentCard.review_count) / (currentCard.review_count + 1)
        })
        .eq('id', currentCard.id)

      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        correct: quality >= 3 ? prev.correct + 1 : prev.correct,
        incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect
      }))

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowAnswer(false)
      } else {
        // Session complete
        await completeSession()
      }
    } catch (error) {
      toast.error('Failed to save review')
    }
  }

  const completeSession = async () => {
    const duration = Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / 1000 / 60)
    
    // Save study session
    await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        title: `Flashcard Review - ${cards.length} cards`,
        subject: 'Flashcards',
        duration_minutes: duration,
        focus_score: Math.round((sessionStats.correct / sessionStats.reviewed) * 100),
        completed: true,
        notes: `Reviewed ${sessionStats.reviewed} cards. Correct: ${sessionStats.correct}, Incorrect: ${sessionStats.incorrect}`
      })

    toast.success(`Great job! You reviewed ${sessionStats.reviewed} cards with ${Math.round((sessionStats.correct / sessionStats.reviewed) * 100)}% accuracy`)
    onComplete()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        handleFlip()
      } else if (showAnswer) {
        if (e.key === '1') handleReview(1)
        else if (e.key === '2') handleReview(2)
        else if (e.key === '3') handleReview(3)
        else if (e.key === '4') handleReview(4)
        else if (e.key === '5') handleReview(5)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showAnswer, currentIndex])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{sessionStats.correct} correct, {sessionStats.incorrect} incorrect</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-2">
          <div 
            className="bg-brand-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative h-96 mb-8">
        <div 
          className={`absolute inset-0 bg-dark-900/50 border border-gray-800 rounded-xl p-8 cursor-pointer transition-all duration-300 ${
            isFlipping ? 'scale-95 opacity-50' : ''
          }`}
          onClick={handleFlip}
        >
          <div className="h-full flex flex-col">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-400">
                {showAnswer ? 'Answer' : 'Question'}
              </span>
              <div className="flex items-center space-x-2">
                {currentCard.difficulty && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    currentCard.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    currentCard.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {currentCard.difficulty}
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFlip()
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-white whitespace-pre-wrap">
                  {showAnswer ? currentCard.back : currentCard.front}
                </p>
                {currentCard.notes && showAnswer && (
                  <p className="text-sm text-gray-400 mt-4">
                    Note: {currentCard.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="text-center">
              {!showAnswer ? (
                <p className="text-sm text-gray-500">
                  Press spacebar or click to reveal answer
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Rate your recall below
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Buttons */}
      {showAnswer && (
        <div className="space-y-4">
          <p className="text-center text-gray-400 text-sm mb-4">
            How well did you remember?
          </p>
          <div className="grid grid-cols-5 gap-2">
            <ReviewButton
              quality={1}
              label="Forgot"
              color="bg-red-500"
              onClick={() => handleReview(1)}
              shortcut="1"
            />
            <ReviewButton
              quality={2}
              label="Hard"
              color="bg-orange-500"
              onClick={() => handleReview(2)}
              shortcut="2"
            />
            <ReviewButton
              quality={3}
              label="Good"
              color="bg-yellow-500"
              onClick={() => handleReview(3)}
              shortcut="3"
            />
            <ReviewButton
              quality={4}
              label="Easy"
              color="bg-green-500"
              onClick={() => handleReview(4)}
              shortcut="4"
            />
            <ReviewButton
              quality={5}
              label="Perfect"
              color="bg-blue-500"
              onClick={() => handleReview(5)}
              shortcut="5"
            />
          </div>
        </div>
      )}

      {/* Skip/Exit Options */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          className="border-gray-700"
          onClick={onComplete}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Exit Session
        </Button>
        
        {!showAnswer && (
          <Button
            variant="outline"
            className="border-gray-700"
            onClick={() => {
              if (currentIndex < cards.length - 1) {
                setCurrentIndex(currentIndex + 1)
              } else {
                completeSession()
              }
            }}
          >
            Skip Card
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function ReviewButton({ 
  quality, 
  label, 
  color, 
  onClick,
  shortcut 
}: { 
  quality: number
  label: string
  color: string
  onClick: () => void
  shortcut: string
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} bg-opacity-20 hover:bg-opacity-30 border border-gray-700 rounded-lg p-3 transition-colors`}
    >
      <div className="text-white font-semibold">{label}</div>
      <div className="text-xs text-gray-400 mt-1">Press {shortcut}</div>
    </button>
  )
}