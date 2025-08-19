/**
 * Spaced Repetition Algorithm (SM-2 variant)
 * Based on SuperMemo 2 algorithm with modifications for better learning
 */

export interface ReviewData {
  quality: number // 0-5 rating of recall quality
  repetitions: number // number of consecutive correct recalls
  easeFactor: number // difficulty multiplier (default 2.5)
  interval: number // days until next review
  lastReviewed: Date
}

export interface FlashcardSchedule {
  nextReview: Date
  interval: number
  easeFactor: number
  repetitions: number
}

/**
 * Calculate next review date based on SM-2 algorithm
 * @param quality - User's self-assessment (0-5)
 *   5: Perfect response
 *   4: Correct with hesitation
 *   3: Correct with difficulty
 *   2: Incorrect, but remembered with hint
 *   1: Incorrect, but recognized
 *   0: Complete blackout
 * @param previousData - Previous review data
 * @returns Updated schedule for the flashcard
 */
export function calculateNextReview(
  quality: number,
  previousData?: Partial<ReviewData>
): FlashcardSchedule {
  // Initialize with defaults if no previous data
  const repetitions = previousData?.repetitions ?? 0
  const easeFactor = previousData?.easeFactor ?? 2.5
  const interval = previousData?.interval ?? 0

  let newRepetitions = repetitions
  let newEaseFactor = easeFactor
  let newInterval = interval

  // Validate quality input
  const validQuality = Math.max(0, Math.min(5, Math.floor(quality)))

  if (validQuality >= 3) {
    // Correct response
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      // First correct response
      newInterval = 1
    } else if (newRepetitions === 2) {
      // Second correct response
      newInterval = 6
    } else {
      // Subsequent correct responses
      newInterval = Math.round(interval * newEaseFactor)
    }

    // Adjust ease factor based on quality
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEaseFactor = easeFactor + (0.1 - (5 - validQuality) * (0.08 + (5 - validQuality) * 0.02))
  } else {
    // Incorrect response - reset repetitions
    newRepetitions = 0
    newInterval = 1
  }

  // Ensure ease factor doesn't go below 1.3 (too difficult)
  newEaseFactor = Math.max(1.3, newEaseFactor)

  // Calculate next review date
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    nextReview,
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions
  }
}

/**
 * Get cards due for review
 * @param cards - Array of flashcards with review data
 * @param now - Current date (optional, defaults to now)
 * @returns Cards that are due for review
 */
export function getDueCards<T extends { nextReview?: Date | string }>(
  cards: T[],
  now: Date = new Date()
): T[] {
  return cards.filter(card => {
    if (!card.nextReview) return true // New cards are always due
    const reviewDate = typeof card.nextReview === 'string' 
      ? new Date(card.nextReview) 
      : card.nextReview
    return reviewDate <= now
  })
}

/**
 * Calculate study load for a given date range
 * @param cards - Array of flashcards with review data
 * @param days - Number of days to look ahead
 * @returns Array of daily review counts
 */
export function calculateStudyLoad<T extends { nextReview?: Date | string }>(
  cards: T[],
  days: number = 30
): number[] {
  const load = new Array(days).fill(0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  cards.forEach(card => {
    if (!card.nextReview) {
      load[0]++ // New cards count for today
      return
    }

    const reviewDate = typeof card.nextReview === 'string'
      ? new Date(card.nextReview)
      : card.nextReview
    
    const daysDiff = Math.floor((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff >= 0 && daysDiff < days) {
      load[daysDiff]++
    }
  })

  return load
}

/**
 * Calculate retention statistics
 * @param reviews - Array of review history
 * @returns Retention statistics
 */
export function calculateRetentionStats(
  reviews: Array<{ quality: number; timestamp: Date | string }>
): {
  retentionRate: number
  averageQuality: number
  totalReviews: number
  successfulReviews: number
  failedReviews: number
  streak: number
} {
  if (reviews.length === 0) {
    return {
      retentionRate: 0,
      averageQuality: 0,
      totalReviews: 0,
      successfulReviews: 0,
      failedReviews: 0,
      streak: 0
    }
  }

  const successfulReviews = reviews.filter(r => r.quality >= 3).length
  const failedReviews = reviews.filter(r => r.quality < 3).length
  const totalQuality = reviews.reduce((sum, r) => sum + r.quality, 0)
  
  // Calculate current streak
  let streak = 0
  for (let i = reviews.length - 1; i >= 0; i--) {
    if (reviews[i].quality >= 3) {
      streak++
    } else {
      break
    }
  }

  return {
    retentionRate: (successfulReviews / reviews.length) * 100,
    averageQuality: totalQuality / reviews.length,
    totalReviews: reviews.length,
    successfulReviews,
    failedReviews,
    streak
  }
}

/**
 * Fuzzing function to add slight randomization to intervals
 * This prevents cards from clustering on the same days
 * @param interval - Base interval in days
 * @param fuzzRange - Percentage of fuzz (0-1, default 0.05 = 5%)
 * @returns Fuzzed interval
 */
export function fuzzInterval(interval: number, fuzzRange: number = 0.05): number {
  if (interval < 2) return interval // Don't fuzz very short intervals
  
  const fuzz = interval * fuzzRange
  const minInterval = Math.max(1, interval - fuzz)
  const maxInterval = interval + fuzz
  
  return Math.round(minInterval + Math.random() * (maxInterval - minInterval))
}

/**
 * Optimize review schedule to distribute load
 * @param cards - Cards with their scheduled reviews
 * @param maxDailyReviews - Maximum reviews per day
 * @returns Optimized schedule
 */
export function optimizeReviewSchedule<T extends { 
  id: string
  nextReview: Date | string
  easeFactor?: number 
}>(
  cards: T[],
  maxDailyReviews: number = 50
): Map<string, Date> {
  const schedule = new Map<string, Date>()
  const dailyLoad = new Map<string, number>()
  
  // Sort cards by next review date
  const sortedCards = [...cards].sort((a, b) => {
    const dateA = typeof a.nextReview === 'string' ? new Date(a.nextReview) : a.nextReview
    const dateB = typeof b.nextReview === 'string' ? new Date(b.nextReview) : b.nextReview
    return dateA.getTime() - dateB.getTime()
  })

  sortedCards.forEach(card => {
    let reviewDate = typeof card.nextReview === 'string' 
      ? new Date(card.nextReview) 
      : new Date(card.nextReview)
    
    const dateKey = reviewDate.toISOString().split('T')[0]
    const currentLoad = dailyLoad.get(dateKey) || 0
    
    // If this day is overloaded, try to reschedule
    if (currentLoad >= maxDailyReviews) {
      // Try next 3 days
      for (let i = 1; i <= 3; i++) {
        const alternativeDate = new Date(reviewDate)
        alternativeDate.setDate(alternativeDate.getDate() + i)
        const altDateKey = alternativeDate.toISOString().split('T')[0]
        const altLoad = dailyLoad.get(altDateKey) || 0
        
        if (altLoad < maxDailyReviews) {
          reviewDate = alternativeDate
          dailyLoad.set(altDateKey, altLoad + 1)
          break
        }
      }
    } else {
      dailyLoad.set(dateKey, currentLoad + 1)
    }
    
    schedule.set(card.id, reviewDate)
  })
  
  return schedule
}