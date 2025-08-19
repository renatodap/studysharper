"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { TrendingUp, Calendar, Target, Award } from "lucide-react"

interface StudyStatsProps {
  totalDecks: number
  totalCards: number
  dueToday: number
  masteredCards: number
}

export default function StudyStats({ 
  totalDecks, 
  totalCards, 
  dueToday, 
  masteredCards 
}: StudyStatsProps) {
  const stats = [
    {
      title: "Total Decks",
      value: totalDecks,
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Total Cards",
      value: totalCards,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Due Today",
      value: dueToday,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Mastered",
      value: masteredCards,
      icon: Award,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}