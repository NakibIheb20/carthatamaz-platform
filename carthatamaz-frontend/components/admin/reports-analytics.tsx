"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Home, DollarSign, Calendar, MapPin, Star, Activity, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiService, type User, type Reservation, type Review } from "@/components/services/api"
import InteractiveCharts from "./interactive-charts"
import RealTimeMetrics from "./real-time-metrics"

interface AnalyticsData {
  revenue: {
    total: number
    growth: number
    byMonth: { month: string; amount: number }[]
  }
  bookings: {
    total: number
    growth: number
    conversionRate: number
    byStatus: { status: string; count: number }[]
  }
  users: {
    total: number
    newThisMonth: number
    activeUsers: number
    byRole: { role: string; count: number }[]
  }
  listings: {
    total: number
    active: number
    pending: number
    topRegions: { name: string; count: number }[]
  }
  reviews: {
    total: number
    averageRating: number
    byStatus: { status: string; count: number }[]
  }
}

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: { total: 0, growth: 0, byMonth: [] },
    bookings: { total: 0, growth: 0, conversionRate: 0, byStatus: [] },
    users: { total: 0, newThisMonth: 0, activeUsers: 0, byRole: [] },
    listings: { total: 0, active: 0, pending: 0, topRegions: [] },
    reviews: { total: 0, averageRating: 0, byStatus: [] },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedPeriod])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger toutes les données
      const [users, listings, reservations, reviews] = await Promise.all([
        ApiService.getAllUsers(),
        ApiService.fetchGuesthouses(),
        ApiService.getAllReservations(),
        ApiService.getAllReviews(),
      ])

      // Calculer les statistiques des revenus
      const totalRevenue = reservations
        .filter(r => r.status === "CONFIRMED" || r.status === "COMPLETED")
        .reduce((sum, r) => sum + r.totalPrice, 0)

      // Calculer les revenus par mois (simulation)
      const revenueByMonth = [
        { month: "Jan", amount: Math.floor(totalRevenue * 0.15) },
        { month: "Fév", amount: Math.floor(totalRevenue * 0.12) },
        { month: "Mar", amount: Math.floor(totalRevenue * 0.18) },
        { month: "Avr", amount: Math.floor(totalRevenue * 0.16) },
        { month: "Mai", amount: Math.floor(totalRevenue * 0.20) },
        { month: "Juin", amount: Math.floor(totalRevenue * 0.19) },
      ]

      // Statistiques des réservations
      const bookingsByStatus = [
        { status: "PENDING", count: reservations.filter(r => r.status === "PENDING").length },
        { status: "CONFIRMED", count: reservations.filter(r => r.status === "CONFIRMED").length },
        { status: "CANCELLED", count: reservations.filter(r => r.status === "CANCELLED").length },
        { status: "COMPLETED", count: reservations.filter(r => r.status === "COMPLETED").length },
      ]

      const conversionRate = reservations.length > 0 
        ? ((bookingsByStatus.find(b => b.status === "CONFIRMED")?.count || 0) + 
           (bookingsByStatus.find(b => b.status === "COMPLETED")?.count || 0)) / reservations.length * 100
        : 0

      // Statistiques des utilisateurs
      const usersByRole = [
        { role: "GUEST", count: users.filter(u => u.role === "GUEST").length },
        { role: "OWNER", count: users.filter(u => u.role === "OWNER").length },
        { role: "ADMIN", count: users.filter(u => u.role === "ADMIN").length },
      ]

      const activeUsers = users.filter(u => u.status === "active").length

      // Statistiques des hébergements
      const activeListings = listings.filter(l => (l as any).status === "active").length
      const pendingListings = listings.filter(l => (l as any).status === "pending").length

      // Top régions (simulation basée sur les villes)
      const cityCount: { [key: string]: number } = {}
      listings.forEach(listing => {
        if (listing.city) {
          cityCount[listing.city] = (cityCount[listing.city] || 0) + 1
        }
      })

      const topRegions = Object.entries(cityCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

      // Statistiques des avis
      const reviewsByStatus = [
        { status: "approved", count: reviews.filter(r => (r as any).status === "approved").length },
        { status: "pending", count: reviews.filter(r => (r as any).status === "pending").length },
        { status: "rejected", count: reviews.filter(r => (r as any).status === "rejected").length },
        { status: "reported", count: reviews.filter(r => (r as any).status === "reported").length },
      ]

      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0

      setAnalyticsData({
        revenue: {
          total: totalRevenue,
          growth: 18.2, // Simulation
          byMonth: revenueByMonth,
        },
        bookings: {
          total: reservations.length,
          growth: 23.1, // Simulation
          conversionRate,
          byStatus: bookingsByStatus,
        },
        users: {
          total: users.length,
          newThisMonth: Math.floor(users.length * 0.1), // Simulation
          activeUsers,
          byRole: usersByRole,
        },
        listings: {
          total: listings.length,
          active: activeListings,
          pending: pendingListings,
          topRegions,
        },
        reviews: {
          total: reviews.length,
          averageRating,
          byStatus: reviewsByStatus,
        },
      })

    } catch (err) {
      console.error("Erreur lors du chargement des analytics:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des analytics")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics & Rapports</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <Button 
            onClick={loadAnalyticsData} 
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="realtime">Temps Réel</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="listings">Hébergements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Chargement des analytics...
              </div>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.revenue.total.toLocaleString()}€</div>
                <p className="text-xs text-green-600">+{analyticsData.revenue.growth}% ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.bookings.total}</div>
                <p className="text-xs text-green-600">+{analyticsData.bookings.growth}% ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.users.activeUsers}</div>
                <p className="text-xs text-blue-600">{analyticsData.users.newThisMonth} nouveaux ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.bookings.conversionRate}%</div>
                <p className="text-xs text-green-600">+2.1% ce mois</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Regions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Régions Populaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.listings.topRegions.map((region, index) => (
                  <div key={region.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-medium">{region.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{region.count} hébergements</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(region.count / analyticsData.listings.topRegions[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                {/* Graphiques Interactifs */}
                <InteractiveCharts 
                  data={{
                    revenue: analyticsData.revenue.byMonth,
                    bookings: analyticsData.bookings.byStatus.map(b => ({
                      ...b,
                      color: b.status === "CONFIRMED" ? "#10b981" :
                             b.status === "PENDING" ? "#f59e0b" :
                             b.status === "CANCELLED" ? "#ef4444" : "#6366f1"
                    })),
                    users: analyticsData.users.byRole.map(u => ({
                      ...u,
                      color: u.role === "GUEST" ? "#3b82f6" :
                             u.role === "OWNER" ? "#10b981" : "#8b5cf6"
                    })),
                    ratings: [
                      { rating: 5, count: Math.floor(analyticsData.reviews.total * 0.4) },
                      { rating: 4, count: Math.floor(analyticsData.reviews.total * 0.3) },
                      { rating: 3, count: Math.floor(analyticsData.reviews.total * 0.2) },
                      { rating: 2, count: Math.floor(analyticsData.reviews.total * 0.08) },
                      { rating: 1, count: Math.floor(analyticsData.reviews.total * 0.02) },
                    ]
                  }}
                  loading={loading}
                />
              </CardContent>
            </Card>
              </>
          )}
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <RealTimeMetrics 
            onRefresh={loadAnalyticsData}
            loading={loading}
            lastUpdate={new Date()}
          />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.revenue.byMonth.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-lg font-bold">{month.amount.toLocaleString()}€</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Utilisateurs Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.users.total}</div>
                <p className="text-sm text-gray-600 mt-2">{analyticsData.users.newThisMonth} nouveaux ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Utilisateurs Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.users.activeUsers}</div>
                <p className="text-sm text-gray-600 mt-2">
                  {((analyticsData.users.activeUsers / analyticsData.users.total) * 100).toFixed(1)}% du total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.7/5</div>
                <p className="text-sm text-gray-600 mt-2">Note moyenne des avis</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Statut des Hébergements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Actifs</span>
                  <Badge className="bg-green-100 text-green-800">{analyticsData.listings.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>En attente</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{analyticsData.listings.pending}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <Badge variant="outline">{analyticsData.listings.total}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Distribution Géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.listings.topRegions.slice(0, 3).map((region) => (
                    <div key={region.name} className="flex items-center justify-between">
                      <span>{region.name}</span>
                      <span className="font-medium">{region.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
