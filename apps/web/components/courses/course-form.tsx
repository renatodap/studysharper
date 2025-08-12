'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

interface CourseFormProps {
  termId: string
  course?: any
  onSuccess: () => void
  onCancel: () => void
}

const courseColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
]

export function CourseForm({ termId, course, onSuccess, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: course?.name || '',
    code: course?.code || '',
    credits: course?.credits || 3,
    color: course?.color || courseColors[0]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/courses', {
        method: course ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: course?.id,
          termId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save course')
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
        <CardTitle>{course ? 'Edit Course' : 'Add Course'}</CardTitle>
        <CardDescription>
          {course ? 'Update course information' : 'Add a new course to your term'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Course Code (Optional)</Label>
            <Input
              id="code"
              placeholder="e.g., CS 101"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Credit Hours</Label>
            <Input
              id="credits"
              type="number"
              min="0"
              max="10"
              value={formData.credits}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                credits: parseInt(e.target.value) || 0 
              }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Course Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {courseColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-foreground scale-110' 
                      : 'border-muted hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
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
                course ? 'Update Course' : 'Add Course'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}