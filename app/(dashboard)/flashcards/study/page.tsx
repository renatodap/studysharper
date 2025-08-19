import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getDueCards } from '@/lib/flashcards/spaced-repetition'
import { StudySession } from '@/components/flashcards/StudySession'

interface StudyPageProps {
  searchParams: Promise<{ deck?: string }>
}

export default async function FlashcardStudyPage({ searchParams }: StudyPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // If deck ID is provided, fetch cards from that deck
  let cards: any[] = []
  let deckName = "Study Session"

  if (params.deck) {
    // Fetch deck info
    const { data: deck } = await supabase
      .from('flashcard_decks')
      .select('name')
      .eq('id', params.deck)
      .eq('user_id', user.id)
      .single()

    if (deck) {
      deckName = deck.name
    }

    // Fetch cards from specific deck
    const { data: deckCards } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', params.deck)
      .eq('user_id', user.id)

    cards = getDueCards(deckCards || [])
  } else {
    // Fetch all due cards from all decks
    const { data: allCards } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', user.id)

    cards = getDueCards(allCards || [])
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Cards to Study</h1>
          <p className="text-gray-600 mb-6">
            {params.deck 
              ? "This deck has no cards due for review right now." 
              : "You have no cards due for review right now."}
          </p>
          <a 
            href="/flashcards" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Flashcards
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{deckName}</h1>
          <p className="text-gray-600">
            {cards.length} card{cards.length !== 1 ? 's' : ''} due for review
          </p>
        </div>

        <StudySession
          cards={cards}
          userId={user.id}
          onComplete={() => {
            // Redirect back to flashcards page after completion
            window.location.href = '/flashcards'
          }}
        />
      </div>
    </div>
  )
}