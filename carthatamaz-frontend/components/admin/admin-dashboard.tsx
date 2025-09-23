"use client"

import { useState, useEffect } from "react"
import { Users, Home, MessageSquare, TrendingUp, AlertTriangle, Calendar, DollarSign, RefreshCw, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AdminHeader from "./admin-header"
import UserManagement from "./user-management"
import ListingManagement from "./listings-management"
import ReviewManagement from "./review-management"
import ReportsAnalytics from "./reports-analytics"
import ReservationsManagement from "./reservations-management"
import QuickActions from "./quick-actions"
import NotificationCenter from "./notification-center"
import { ApiService, type User, type Reservation, type Review } from "@/components/services/api"

interface DashboardStats {
  totalUsers: number
  totalListings: number
  totalBookings: number
  totalRevenue: number
  pendingReviews: number
  reportedContent: number
  activeUsers: number
  conversionRate: number
  guestUsers: number
  ownerUsers: number
  adminUsers: number
  activeListings: number
  pendingListings: number
  rejectedListings: number
  approvedReviews: number
  pendingBookings: number
  confirmedBookings: number
  cancelledBookings: number
}

interface RecentActivity {
  id: string
  type: "user" | "listing" | "booking" | "review"
  action: string
  description: string
  timestamp: string
  status?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingReviews: 0,
    reportedContent: 0,
    activeUsers: 0,
    conversionRate: 0,
    guestUsers: 0,
    ownerUsers: 0,
    adminUsers: 0,
    activeListings: 0,
    pendingListings: 0,
    rejectedListings: 0,
    approvedReviews: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.role !== "ADMIN") {
      window.location.href = "/"
      return
    }

    // Charger les données du dashboard
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Charger toutes les données en parallèle
      const [users, listings, reservations, reviews] = await Promise.all([
        ApiService.getAllUsers(),
        ApiService.fetchGuesthouses(),
        ApiService.getAllReservations(),
        ApiService.getAllReviews(),
      ])

      // Calculer les statistiques des utilisateurs
      const guestUsers = users.filter(u => u.role === "GUEST").length
      const ownerUsers = users.filter(u => u.role === "OWNER").length
      const adminUsers = users.filter(u => u.role === "ADMIN").length
      const activeUsers = users.filter(u => u.status === "active").length

      // Calculer les statistiques des hébergements
      const activeListings = listings.filter(l => (l as any).status === "active").length
      const pendingListings = listings.filter(l => (l as any).status === "pending").length
      const rejectedListings = listings.filter(l => (l as any).status === "rejected").length

      // Calculer les statistiques des avis
      const approvedReviews = reviews.filter(r => (r as any).status === "approved").length
      const pendingReviews = reviews.filter(r => (r as any).status === "pending").length
      const reportedReviews = reviews.filter(r => (r as any).status === "reported").length

      // Calculer les statistiques des réservations
      const pendingBookings = reservations.filter(r => r.status === "PENDING").length
      const confirmedBookings = reservations.filter(r => r.status === "CONFIRMED").length
      const cancelledBookings = reservations.filter(r => r.status === "CANCELLED").length
      const completedBookings = reservations.filter(r => r.status === "COMPLETED").length

      // Calculer le chiffre d'affaires total
      const totalRevenue = reservations
        .filter(r => r.status === "CONFIRMED" || r.status === "COMPLETED")
        .reduce((sum, r) => sum + r.totalPrice, 0)

      // Calculer le taux de conversion (réservations confirmées / total)
      const conversionRate = reservations.length > 0 
        ? ((confirmedBookings + completedBookings) / reservations.length) * 100 
        : 0

      // Mettre à jour les statistiques
      setStats({
        totalUsers: users.length,
        totalListings: listings.length,
        totalBookings: reservations.length,
        totalRevenue,
        pendingReviews,
        reportedContent: reportedReviews,
        activeUsers,
        conversionRate,
        guestUsers,
        ownerUsers,
        adminUsers,
        activeListings,
        pendingListings,
        rejectedListings,
        approvedReviews,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
      })

      // Générer l'activité récente
      const activity: RecentActivity[] = [
        ...users.slice(-5).map(u => ({
          id: u.id,
          type: "user" as const,
          action: "Inscription",
          description: `${u.fullName || u.email} s'est inscrit`,
          timestamp: new Date().toISOString(),
          status: u.status,
        })),
        ...reservations.slice(-5).map(r => ({
          id: r.id,
          type: "booking" as const,
          action: "Réservation",
          description: `Nouvelle réservation pour ${r.guesthouse?.title || 'un hébergement'}`,
          timestamp: r.createdAt,
          status: r.status,
        })),
        ...reviews.slice(-5).map(r => ({
          id: r.id,
          type: "review" as const,
          action: "Avis",
          description: `Nouvel avis pour ${r.guesthouse?.title || 'un hébergement'}`,
          timestamp: r.createdAt,
          status: (r as any).status,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

      setRecentActivity(activity)
      setLastRefresh(new Date())

    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    loadDashboardData()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <Users className="h-4 w-4" />
      case "listing": return <Home className="h-4 w-4" />
      case "booking": return <Calendar className="h-4 w-4" />
      case "review": return <MessageSquare className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityBadge = (status?: string) => {
    if (!status) return null
    
    switch (status) {
      case "active":
      case "CONFIRMED":
      case "approved":
        return <Badge className="bg-green-100 text-green-800 text-xs">Actif</Badge>
      case "pending":
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">En attente</Badge>
      case "rejected":
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800 text-xs">Rejeté</Badge>
      case "reported":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Signalé</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
            <p className="text-gray-600 mt-2">Gérez votre plateforme CarthaTamaz</p>
            {lastRefresh && (
              <p className="text-sm text-gray-500 mt-1">
                Dernière mise à jour: {lastRefresh.toLocaleTimeString('fr-FR')}
              </p>
            )}
          </div>
          <Button 
            onClick={refreshData} 
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="listings">Hébergements</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Chargement des données...
                </div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-green-600">
                        {stats.activeUsers} actifs ({((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%)
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hébergements</CardTitle>
                      <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalListings}</div>
                      <p className="text-xs text-green-600">
                        {stats.activeListings} actifs, {stats.pendingListings} en attente
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBookings}</div>
                      <p className="text-xs text-blue-600">
                        {stats.confirmedBookings} confirmées, {stats.pendingBookings} en attente
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}€</div>
                      <p className="text-xs text-green-600">
                        Taux de conversion: {stats.conversionRate.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Répartition des Utilisateurs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Voyageurs</span>
                        <Badge className="bg-blue-100 text-blue-800">{stats.guestUsers}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Propriétaires</span>
                        <Badge className="bg-green-100 text-green-800">{stats.ownerUsers}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Administrateurs</span>
                        <Badge className="bg-purple-100 text-purple-800">{stats.adminUsers}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-green-500" />
                        Statut des Hébergements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Actifs</span>
                        <Badge className="bg-green-100 text-green-800">{stats.activeListings}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">En attente</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingListings}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rejetés</span>
                        <Badge className="bg-red-100 text-red-800">{stats.rejectedListings}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-orange-500" />
                        Gestion des Avis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approuvés</span>
                        <Badge className="bg-green-100 text-green-800">{stats.approvedReviews}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">En attente</span>
                        <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingReviews}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Signalés</span>
                        <Badge className="bg-red-100 text-red-800">{stats.reportedContent}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Actions Requises et Centre de Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Actions Requises
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avis en attente</span>
                    <Badge variant="secondary">{stats.pendingReviews}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contenus signalés</span>
                    <Badge variant="destructive">{stats.reportedContent}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hébergements en attente</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingListings}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Réservations en attente</span>
                    <Badge className="bg-blue-100 text-blue-800">{stats.pendingBookings}</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => setActiveTab("reviews")}
                    >
                      Gérer les avis
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => setActiveTab("listings")}
                    >
                      Gérer les hébergements
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {recentActivity.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Aucune activité récente
                      </p>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.action}
                              </p>
                              {getActivityBadge(activity.status)}
                            </div>
                            <p className="text-xs text-gray-600 truncate">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(activity.timestamp).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {recentActivity.length > 0 && (
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={refreshData}
                    >
                      Actualiser l'activité
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Centre de Notifications */}
              <div className="lg:col-span-2">
                <NotificationCenter 
                  onNotificationAction={(notification, action) => {
                    console.log("Notification action:", action, notification)
                    // Gérer les actions sur les notifications
                    switch (action) {
                      case "view":
                        if (notification.category === "listing") {
                          setActiveTab("listings")
                        } else if (notification.category === "review") {
                          setActiveTab("reviews")
                        } else if (notification.category === "booking") {
                          setActiveTab("reservations")
                        } else if (notification.category === "user") {
                          setActiveTab("users")
                        }
                        break
                      case "dismiss":
                        // Notification supprimée
                        break
                    }
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <QuickActions 
              onActionClick={(action) => {
                // Gérer les actions rapides
                switch (action) {
                  case "approve-listings":
                    setActiveTab("listings")
                    break
                  case "moderate-reviews":
                    setActiveTab("reviews")
                    break
                  case "manage-bookings":
                    setActiveTab("reservations")
                    break
                  case "search":
                    // Implémenter la recherche
                    break
                  default:
                    console.log(`Action: ${action}`)
                }
              }}
              pendingCounts={{
                users: stats.activeUsers,
                listings: stats.pendingListings,
                reviews: stats.pendingReviews,
                bookings: stats.pendingBookings,
              }}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="listings">
            <ListingManagement />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationsManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
