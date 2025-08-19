import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FlashcardDashboard } from '@/components/flashcards/FlashcardDashboard'
import DeckList from '@/components/flashcards/DeckList'
import StudyStats from '@/components/flashcards/StudyStats'
import { getDueCards } from '@/lib/flashcards/spaced-repetition'

export default async function FlashcardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch user's flashcard decks
  const { data: decks } = await supabase
    .from('flashcard_decks')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  // Fetch all flashcards for due calculation
  const { data: allCards } = await supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', user.id)

  const dueCards = getDueCards(allCards || [])
  
  // Calculate stats
  const totalCards = allCards?.length || 0
  const totalDecks = decks?.length || 0
  const dueToday = dueCards.length
  const masteredCards = allCards?.filter(c => c.review_count > 5 && c.success_rate > 0.8).length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Flashcards</h1>
        <p className="text-gray-400 mt-2">
          Master your subjects with AI-powered flashcards and spaced repetition
        </p>
      </div>

      {/* Stats Overview */}
      <StudyStats
        totalCards={totalCards}
        totalDecks={totalDecks}
        dueToday={dueToday}
        masteredCards={masteredCards}
      />

      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Study Section */}
        <div className="lg:col-span-2">
          <FlashcardDashboard 
            dueCards={dueCards}
            userId={user.id}
          />
        </div>

        {/* Deck List */}
        <div className="lg:col-span-1">
          <DeckList 
            decks={decks || []}
            userId={user.id}
          />
        </div>
      </div>
    </div>
  )
}