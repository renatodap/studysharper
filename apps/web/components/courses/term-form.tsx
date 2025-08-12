'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, AlertCircle } from 'lucide-react'

interface TermFormProps {
  schoolId: string
  term?: any
  onSuccess: () => void
  onCancel: () => void
}

export function TermForm({ schoolId, term, onSuccess, onCancel }: TermFormProps) {
  const [formData, setFormData] = useState({
    name: term?.name || '',
    start_date: term?.start_date || '',
    end_date: term?.end_date || '',
    active: term?.active || false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/terms', {
        method: term ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: term?.id,
          schoolId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save term')
      }

      onSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{term ? 'Edit Term' : 'Add Term'}</CardTitle>
        <CardDescription>
          {term ? 'Update term information' : 'Add a new academic term or semester'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Term Name</Label>
            <Input
              id="name"
              placeholder="e.g., Fall 2024, Spring Semester"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked: boolean) => 
                setFormData(prev => ({ ...prev, active: !!checked }))
              }
            />
            <Label htmlFor="active" className="text-sm font-medium">
              Set as active term
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                term ? 'Update Term' : 'Add Term'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}