"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Home, Calendar, Star } from "lucide-react"

interface ChartData {
  revenue: { month: string; amount: number }[]
  bookings: { status: string; count: number; color: string }[]
  users: { role: string; count: number; color: string }[]
  ratings: { rating: number; count: number }[]
}

interface InteractiveChartsProps {
  data: ChartData
  loading?: boolean
}

export default function InteractiveCharts({ data, loading = false }: InteractiveChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const maxRevenue = Math.max(...data.revenue.map(r => r.amount))
  const maxBookings = Math.max(...data.bookings.map(b => b.count))
  const maxUsers = Math.max(...data.users.map(u => u.count))
  const maxRatings = Math.max(...data.ratings.map(r => r.count))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Graphique des revenus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Évolution des Revenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.revenue.map((item, index) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium w-12">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(item.amount / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600 w-20 text-right">
                  {item.amount.toLocaleString()}€
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique des réservations par statut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Réservations par Statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.bookings.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium capitalize">
                    {item.status.toLowerCase()}
                  </span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(item.count / maxBookings) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique des utilisateurs par rôle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Utilisateurs par Rôle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.users.map((item) => (
              <div key={item.role} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">
                    {item.role === "GUEST" ? "Voyageurs" : 
                     item.role === "OWNER" ? "Propriétaires" : "Admins"}
                  </span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(item.count / maxUsers) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique de distribution des notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Distribution des Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.ratings.map((item) => (
              <div key={item.rating} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < item.rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {item.rating} étoile{item.rating > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(item.count / maxRatings) * 100}%` }}
                    />
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}