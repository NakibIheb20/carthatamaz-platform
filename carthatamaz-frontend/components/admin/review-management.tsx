"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Review {
  id: string
  username: string
  language: string
  rating: number
  reviewText: string
  title: string
  city_listing: string
  createdAt: string
  sentiment_score: number
  status: "approved" | "pending" | "rejected" | "reported"
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")
        if (!token) {
          setError("Aucun token d'authentification trouvé. Veuillez vous reconnecter.")
          return
        }

        const allReviews: Review[] = []

        for (let offset = 0; offset < 300; offset += 100) {
          const res = await fetch(`http://localhost:8080/api/admin/reviews?limit=100&offset=${offset}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (res.status === 401) {
            setError("Session expirée. Veuillez vous reconnecter.")
            return
          }

          if (res.status === 403) {
            setError("Accès refusé. Vous n'avez pas les permissions nécessaires.")
            return
          }

          if (!res.ok) {
            throw new Error(`Erreur API ${res.status}: ${res.statusText}`)
          }

          const data = await res.json()

          const reviewsWithStatus = data.map((review: any) => ({
            ...review,
            status: review.status || "pending",
          }))

          allReviews.push(...reviewsWithStatus)

          // Si on récupère moins de 100, plus rien à charger
          if (data.length < 100) break
        }

        // Supprimer les doublons par ID
        const uniqueReviews = Array.from(
          new Map(allReviews.map((r) => [r.id, r])).values()
        )

        setReviews(uniqueReviews)
      } catch (err) {
        console.error("Erreur lors du chargement des avis :", err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.city_listing?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || review.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>
      case "reported":
        return <Badge className="bg-orange-100 text-orange-800">Signalé</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const handleReviewAction = (reviewId: string, action: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          return { ...review, status: action as any }
        }
        return review
      })
    )
    // 🔧 Tu peux ici envoyer une requête PUT/POST pour sauvegarder le statut modifié
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Avis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un avis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              <option value="all">Tous les statuts</option>
              <option value="approved">Approuvé</option>
              <option value="pending">En attente</option>
              <option value="rejected">Rejeté</option>
              <option value="reported">Signalé</option>
            </select>

            <Button variant="outline" disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Chargement des avis...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-400 mr-2" />
                <div className="text-red-800">{error}</div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Hébergement</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Commentaire</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Aucun avis trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={review.username} />
                            <AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{review.username}</div>
                        </div>
                      </TableCell>
                      <TableCell>{review.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm">{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.reviewText}</TableCell>
                      <TableCell>{new Date(review.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{getStatusBadge(review.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            {review.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleReviewAction(review.id, "approved")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReviewAction(review.id, "rejected")}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleReviewAction(review.id, "reported")}>
                              <Flag className="mr-2 h-4 w-4" />
                              Signaler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
