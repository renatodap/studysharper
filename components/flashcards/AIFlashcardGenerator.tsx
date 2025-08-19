"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Wand2, Upload, FileText, Loader2 } from "lucide-react"

interface Flashcard {
  front: string
  back: string
}

interface AIFlashcardGeneratorProps {
  userId: string
  onClose: () => void
}

export default function AIFlashcardGenerator({ 
  userId, 
  onClose 
}: AIFlashcardGeneratorProps) {
  const [content, setContent] = useState("")
  const [deckName, setDeckName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationMethod, setGenerationMethod] = useState<'text' | 'file'>('text')

  // Always show modal since it's controlled by parent

  const handleGenerate = async () => {
    if (!content.trim() || !deckName.trim()) return

    setIsGenerating(true)
    
    try {
      // Simulate AI generation for now
      // In a real implementation, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock generated flashcards
      const mockCards: Flashcard[] = [
        {
          front: "What is the main topic discussed in this content?",
          back: "The main topic is about the provided study material and key concepts within it."
        },
        {
          front: "What are the key points to remember?",
          back: "The key points include the main concepts, definitions, and important details from the content."
        },
        {
          front: "How does this relate to the overall subject?",
          back: "This content provides foundational knowledge that connects to broader concepts in the subject area."
        }
      ]
      
      // TODO: Save generated cards to database using userId
      console.log('Generated cards:', { mockCards, deckName, userId })
      
      // Reset form
      setContent("")
      setDeckName("")
      onClose()
    } catch (error) {
      console.error('Error generating flashcards:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">AI Flashcard Generator</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Deck Name</label>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter name for the generated deck"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Generation Method</label>
            <div className="flex gap-4 mb-4">
              <Button
                variant={generationMethod === 'text' ? 'default' : 'outline'}
                onClick={() => setGenerationMethod('text')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Text Input
              </Button>
              <Button
                variant={generationMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setGenerationMethod('file')}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                File Upload
              </Button>
            </div>
          </div>

          {generationMethod === 'text' ? (
            <div>
              <label className="block text-sm font-medium mb-2">Study Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={8}
                placeholder="Paste your study material here. The AI will analyze this content and create relevant flashcards..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Upload Study Material</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">Supports PDF, DOCX, TXT files</p>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>
          )}

          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Wand2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">AI Generation Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Provide clear, well-structured content for best results</li>
                    <li>• Include key concepts, definitions, and important facts</li>
                    <li>• The AI will create questions that test comprehension and recall</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleGenerate} 
              className="flex-1"
              disabled={!content.trim() || !deckName.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Flashcards
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}