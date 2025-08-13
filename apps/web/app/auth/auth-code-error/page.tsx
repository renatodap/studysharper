import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            Sorry, we couldn't sign you in. There was an error processing your authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            This could be due to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>An expired or invalid authentication code</li>
              <li>A network connection issue</li>
              <li>A temporary server problem</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/support">Get Help</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}