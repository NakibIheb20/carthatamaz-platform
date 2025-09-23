"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Home, 
  Star, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Search,
  Plus,
  Filter
} from "lucide-react"
import { ApiService, type User, type Review } from "@/components/services/api-complete"

// Interfaces pour les données
interface Guesthouse {
  id: string
  title: string
  location: string
  status: string
  created_at: string
}

interface DashboardStats {
  totalUsers: number
  totalGuesthouses: number
  totalReviews: number
  totalRevenue: number
}

interface RecentActivity {
  id: string
  type: "user" | "guesthouse" | "review" | "booking"
  title: string
  description: string
  timestamp: Date
  user?: User
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGuesthouses: 0,
    totalReviews: 0,
    totalRevenue: 0
  })

  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentGuesthouses, setRecentGuesthouses] = useState<Guesthouse[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Récupérer les données du tableau de bord
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Récupérer les statistiques
        const [allUsers, allGuesthousesRaw, allReviews] = await Promise.all([
          ApiService.getUsers({ limit: 1000 }), // Get all users to count them
          ApiService.fetchGuesthouses(), // Get all guesthouses to count them
          ApiService.fetchAllReviews() // Get all reviews to count them
        ])

        const usersCount = allUsers.length
        const guesthousesCount = allGuesthousesRaw.length
        const reviewsCount = allReviews.length

        // Récupérer les données récentes
        const [users, guesthousesRaw, reviews] = await Promise.all([
          ApiService.getUsers({ limit: 5 }),
          ApiService.fetchGuesthouses(),
          ApiService.fetchAllReviews()
        ])

        // Adapter les listings pour correspondre à Guesthouse
        const guesthouses: Guesthouse[] = guesthousesRaw.map((listing: any) => ({
          id: listing.id,
          title: listing.title,
          location: listing.location || '',
          status: listing.status || '',
          created_at: listing.created_at || ''
        }))

        const allGuesthouses: Guesthouse[] = allGuesthousesRaw.map((listing: any) => ({
          id: listing.id,
          title: listing.title,
          location: listing.location || '',
          status: listing.status || '',
          created_at: listing.created_at || ''
        }))

        // Mettre à jour les états
        setStats({
          totalUsers: usersCount,
          totalGuesthouses: guesthousesCount,
          totalReviews: reviewsCount,
          totalRevenue: 0
        })

  setRecentUsers(users)
  setRecentGuesthouses(guesthouses)
  setRecentReviews(reviews)

        const activity: RecentActivity[] = []

        // Ajouter les nouveaux utilisateurs
        users.forEach((user: User) => {
          activity.push({
            id: user.id,
            type: "user",
            title: "Nouvel utilisateur",
            description: `${user.fullName || user.email} s'est inscrit`,
            timestamp: new Date((user as any).created_at || Date.now()),
            user: user
          })
        })

        // Ajouter les nouveaux gîtes
        guesthouses.forEach((guesthouse: Guesthouse) => {
          activity.push({
            id: guesthouse.id,
            type: "guesthouse",
            title: "Nouveau gîte",
            description: `${guesthouse.title} a été ajouté`,
            timestamp: new Date(guesthouse.created_at || Date.now())
          })
        })

        // Ajouter les nouveaux avis
        reviews.forEach((review: Review) => {
          activity.push({
            id: (review as any).id,
            type: "review",
            title: "Nouvel avis",
            description: `Nouvelle évaluation de ${(review as any).rating} étoiles`,
            timestamp: new Date((review as any).created_at || Date.now())
          })
        })

        // Trier par date (les plus récents en premier)
        activity.sort((a: RecentActivity, b: RecentActivity) => b.timestamp.getTime() - a.timestamp.getTime())

        setRecentActivity(activity.slice(0, 10)) // Garder seulement les 10 plus récents

      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Rendu des statistiques
  const renderStats = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            +12% depuis le mois dernier
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gîtes</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGuesthouses}</div>
          <p className="text-xs text-muted-foreground">
            +8% depuis le mois dernier
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avis</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            +15% depuis le mois dernier
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}€</div>
          <p className="text-xs text-muted-foreground">
            +20% depuis le mois dernier
          </p>
        </CardContent>
      </Card>
    </div>
  )

  // Rendu de l'activité récente
  const renderRecentActivity = () => (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>
          Les dernières actions sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleDateString()} à {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Aucune activité récente</p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Rendu des utilisateurs récents
  const renderRecentUsers = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Utilisateurs récents</CardTitle>
            <CardDescription>
              Les derniers utilisateurs inscrits
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Voir tous
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div key={user.id} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.fullName || "Utilisateur inconnu"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Aucun utilisateur récent</p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Rendu des gîtes récents
  const renderRecentGuesthouses = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gîtes récents</CardTitle>
            <CardDescription>
              Les derniers gîtes ajoutés
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Voir tous
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentGuesthouses.length > 0 ? (
            recentGuesthouses.map((guesthouse) => (
              <div key={guesthouse.id} className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                    <Home className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {guesthouse.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {guesthouse.location}
                  </p>
                  <Badge variant={guesthouse.status === "APPROVED" ? "default" : "secondary"}>
                    {guesthouse.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Aucun gîte récent</p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Rendu des avis récents
  const renderRecentReviews = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Avis récents</CardTitle>
            <CardDescription>
              Les derniers avis des clients
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Voir tous
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReviews.length > 0 ? (
            recentReviews.map((review: any) => (
              <div key={review.id} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
                <div className="ml-4 space-y-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                  </div>
                  <p className="text-sm font-medium leading-none">
                    {review.comment || ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Par {review.userFullName || "Anonyme"} le {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Aucun avis récent</p>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
      </div>

      {renderStats()}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="guesthouses">Gîtes</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {renderRecentActivity()}
            {renderRecentUsers()}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {renderRecentGuesthouses()}
            {renderRecentReviews()}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {renderRecentUsers()}
        </TabsContent>

        <TabsContent value="guesthouses" className="space-y-4">
          {renderRecentGuesthouses()}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {renderRecentReviews()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
