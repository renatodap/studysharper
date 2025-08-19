"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { X, Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Flashcard {
  front: string
  back: string
}

interface CreateFlashcardModalProps {
  userId: string
  onClose: () => void
}

export default function CreateFlashcardModal({ 
  userId, 
  onClose 
}: CreateFlashcardModalProps) {
  const [deckName, setDeckName] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [cards, setCards] = useState<Flashcard[]>([{ front: "", back: "" }])
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Always show modal since it's controlled by parent

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }])
  }

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index))
    }
  }

  const updateCard = (index: number, field: 'front' | 'back', value: string) => {
    const updatedCards = cards.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    )
    setCards(updatedCards)
  }

  const handleSubmit = async () => {
    if (!deckName.trim() || !cards.some(card => card.front.trim() && card.back.trim())) {
      setError("Please provide a deck name and at least one valid card")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const validCards = cards.filter(card => card.front.trim() && card.back.trim())
      
      // Create the deck first
      const { data: deck, error: deckError } = await supabase
        .from('flashcard_decks')
        .insert({
          user_id: userId,
          name: deckName.trim(),
          description: deckDescription.trim() || null,
          card_count: validCards.length
        })
        .select('id')
        .single()

      if (deckError) throw deckError

      // Create all flashcards
      const flashcardInserts = validCards.map(card => ({
        user_id: userId,
        deck_id: deck.id,
        front: card.front.trim(),
        back: card.back.trim(),
        next_review: new Date() // Make new cards immediately available
      }))

      const { error: cardsError } = await supabase
        .from('flashcards')
        .insert(flashcardInserts)

      if (cardsError) throw cardsError

      // Reset form and close
      setDeckName("")
      setDeckDescription("")
      setCards([{ front: "", back: "" }])
      onClose()
      
      // Refresh the page to show new deck
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deck')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Flashcard Deck</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Deck Name</label>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter deck name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (optional)</label>
            <input
              type="text"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter deck description"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">Flashcards</label>
              <Button onClick={addCard} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>

            <div className="space-y-4">
              {cards.map((card, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Card {index + 1}</CardTitle>
                      {cards.length > 1 && (
                        <Button 
                          onClick={() => removeCard(index)} 
                          size="sm" 
                          variant="ghost"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Front</label>
                      <textarea
                        value={card.front}
                        onChange={(e) => updateCard(index, 'front', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        placeholder="Enter the question or prompt"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Back</label>
                      <textarea
                        value={card.back}
                        onChange={(e) => updateCard(index, 'back', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        placeholder="Enter the answer"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={isCreating || !deckName.trim() || !cards.some(card => card.front.trim() && card.back.trim())}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Deck'
              )}
            </Button>
            <Button onClick={onClose} variant="outline" disabled={isCreating}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}