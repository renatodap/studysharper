'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Clock, Target, Smile } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface StudySessionFormProps {
  userId: string
}

const techniques = [
  'Pomodoro',
  'Active Recall',
  'Spaced Repetition',
  'Mind Mapping',
  'Feynman Technique',
  'Cornell Notes',
  'SQ3R Method',
  'Flashcards',
]

const moods = {
  before: [
    { value: 'excited', label: '😊 Excited', color: 'text-green-500' },
    { value: 'motivated', label: '💪 Motivated', color: 'text-blue-500' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-500' },
    { value: 'tired', label: '😴 Tired', color: 'text-yellow-500' },
    { value: 'stressed', label: '😰 Stressed', color: 'text-red-500' },
  ],
  after: [
    { value: 'accomplished', label: '🎉 Accomplished', color: 'text-green-500' },
    { value: 'satisfied', label: '😌 Satisfied', color: 'text-blue-500' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-500' },
    { value: 'frustrated', label: '😤 Frustrated', color: 'text-yellow-500' },
    { value: 'exhausted', label: '😫 Exhausted', color: 'text-red-500' },
  ],
}

export function StudySessionForm({ userId }: StudySessionFormProps) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState(30)
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [moodBefore, setMoodBefore] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a session title')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          title: title.trim(),
          subject: subject.trim() || null,
          duration_minutes: duration,
          techniques_used: selectedTechniques.length > 0 ? selectedTechniques : null,
          mood_before: moodBefore || null,
          notes: notes.trim() || null,
          completed: false,
          focus_score: null,
        })

      if (error) throw error

      toast.success('Study session started!')
      
      // Reset form
      setTitle('')
      setSubject('')
      setDuration(30)
      setSelectedTechniques([])
      setMoodBefore('')
      setNotes('')
      
      // Refresh the page to show new session
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create study session')
    } finally {
      setLoading(false)
    }
  }

  const toggleTechnique = (technique: string) => {
    setSelectedTechniques(prev =>
      prev.includes(technique)
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    )
  }

  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Log Study Session</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <BookOpen className="inline h-4 w-4 mr-1" />
            What are you studying?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Chapter 5 - Photosynthesis"
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subject (Optional)
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Biology, Mathematics, History"
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Planned Duration
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-white font-medium w-20 text-right">
              {duration} min
            </span>
          </div>
        </div>

        {/* Study Techniques */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Target className="inline h-4 w-4 mr-1" />
            Study Techniques
          </label>
          <div className="grid grid-cols-2 gap-2">
            {techniques.map((technique) => (
              <button
                key={technique}
                type="button"
                onClick={() => toggleTechnique(technique)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTechniques.includes(technique)
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500'
                    : 'bg-dark-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {technique}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Before */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Smile className="inline h-4 w-4 mr-1" />
            How are you feeling?
          </label>
          <div className="flex space-x-2">
            {moods.before.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setMoodBefore(mood.value)}
                className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                  moodBefore === mood.value
                    ? 'bg-dark-700 border-2 border-brand-500'
                    : 'bg-dark-800 border border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className={mood.color}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any goals or thoughts before starting..."
            rows={3}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Start Session'}
        </Button>
      </form>
    </div>
  )
}