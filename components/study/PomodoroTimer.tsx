'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface PomodoroTimerProps {
  userId: string
}

export function PomodoroTimer({ userId }: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const WORK_MINUTES = 25
  const SHORT_BREAK_MINUTES = 5
  const LONG_BREAK_MINUTES = 15

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handleTimerComplete()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, minutes, seconds])

  const handleTimerComplete = async () => {
    setIsActive(false)
    
    // Play notification sound
    const audio = new Audio('/notification.mp3')
    audio.play().catch(() => {})

    if (!isBreak) {
      // Work session completed
      setCycles(cycles + 1)
      toast.success('Great work! Time for a break.')
      
      // Update pomodoro session in database
      if (sessionId) {
        await supabase
          .from('pomodoro_sessions')
          .update({
            cycles_completed: cycles + 1,
            total_focus_time: (cycles + 1) * WORK_MINUTES,
          })
          .eq('id', sessionId)
      }

      // Start break
      if (cycles % 4 === 3) {
        // Long break after 4 cycles
        setMinutes(LONG_BREAK_MINUTES)
        toast.success('You earned a long break!')
      } else {
        setMinutes(SHORT_BREAK_MINUTES)
      }
      setIsBreak(true)
      setIsActive(true)
    } else {
      // Break completed
      toast.success('Break over! Ready to focus?')
      setMinutes(WORK_MINUTES)
      setIsBreak(false)
    }
    setSeconds(0)
  }

  const startTimer = async () => {
    setIsActive(true)
    
    if (!sessionId && !isBreak) {
      // Create new pomodoro session
      const { data } = await supabase
        .from('pomodoro_sessions')
        .insert({
          user_id: userId,
          work_duration: WORK_MINUTES,
          break_duration: SHORT_BREAK_MINUTES,
          cycles_completed: 0,
          total_focus_time: 0,
          interruptions: 0,
        })
        .select()
        .single()
      
      if (data) {
        setSessionId(data.id)
      }
    }
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const resetTimer = async () => {
    setIsActive(false)
    setMinutes(WORK_MINUTES)
    setSeconds(0)
    setIsBreak(false)
    
    if (sessionId) {
      // Mark interruption if reset during active session
      if (isActive) {
        await supabase
          .from('pomodoro_sessions')
          .update({
            interruptions: cycles + 1,
          })
          .eq('id', sessionId)
      }
    }
    
    setSessionId(null)
    setCycles(0)
  }

  const formatTime = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = isBreak
    ? ((SHORT_BREAK_MINUTES * 60 - (minutes * 60 + seconds)) / (SHORT_BREAK_MINUTES * 60)) * 100
    : ((WORK_MINUTES * 60 - (minutes * 60 + seconds)) / (WORK_MINUTES * 60)) * 100

  return (
    <div className="bg-dark-900/50 border border-gray-800 rounded-xl p-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {isBreak ? (
            <Coffee className="h-8 w-8 text-green-500" />
          ) : (
            <Brain className="h-8 w-8 text-brand-400" />
          )}
        </div>

        <h2 className="text-2xl font-semibold text-white mb-2">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h2>

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="text-7xl font-mono font-bold text-white">
            {formatTime()}
          </div>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-800"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className={isBreak ? 'text-green-500' : 'text-brand-500'}
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
        </div>

        {/* Cycles Counter */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < cycles % 4
                  ? 'bg-brand-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Cycle {cycles + 1} • {cycles > 0 ? `${cycles * WORK_MINUTES} minutes focused` : 'First session'}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isActive ? (
            <Button
              onClick={startTimer}
              size="lg"
              className="bg-brand-500 hover:bg-brand-600"
            >
              <Play className="mr-2 h-5 w-5" />
              Start
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              size="lg"
              variant="outline"
              className="border-gray-700"
            >
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="border-gray-700"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-dark-800 rounded-lg">
          <p className="text-sm text-gray-400">
            {isBreak
              ? '💡 Step away from your screen, stretch, or grab some water!'
              : '💡 Focus on one task. Minimize distractions. You got this!'}
          </p>
        </div>
      </div>
    </div>
  )
}