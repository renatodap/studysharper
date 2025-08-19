"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Play, BookOpen, Calendar, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

interface Deck {
  id: string
  name: string
  description?: string
  card_count: number
  updated_at: string
  created_at: string
}

interface DeckListProps {
  decks: Deck[]
  userId?: string
}

export default function DeckList({ decks, userId }: DeckListProps) {
  const router = useRouter()

  const onStudyDeck = (deckId: string) => {
    router.push(`/flashcards/study?deck=${deckId}`)
  }

  const onEditDeck = (deckId: string) => {
    router.push(`/flashcards/edit/${deckId}`)
  }
  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcard decks yet</h3>
        <p className="text-gray-500">Create your first deck to start studying!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Card key={deck.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{deck.name}</CardTitle>
            {deck.description && (
              <p className="text-sm text-gray-600">{deck.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="h-4 w-4" />
                {deck.card_count} cards
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(deck.updated_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => onStudyDeck(deck.id)}
                className="flex-1"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Study
              </Button>
              <Button 
                onClick={() => onEditDeck(deck.id)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}