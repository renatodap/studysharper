'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, AlertCircle } from 'lucide-react'

interface SchoolFormProps {
  userId: string
  school?: any
  onSuccess: () => void
  onCancel: () => void
}

export function SchoolForm({ userId, school, onSuccess, onCancel }: SchoolFormProps) {
  const [formData, setFormData] = useState({
    name: school?.name || '',
    type: school?.type || 'college'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/schools', {
        method: school ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: school?.id,
          userId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save school')
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
        <CardTitle>{school ? 'Edit School' : 'Add School'}</CardTitle>
        <CardDescription>
          {school ? 'Update your school information' : 'Add a new educational institution'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              placeholder="e.g., University of California"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">School Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select school type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="college">College</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="community_college">Community College</SelectItem>
                <SelectItem value="trade_school">Trade School</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
                school ? 'Update School' : 'Add School'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}