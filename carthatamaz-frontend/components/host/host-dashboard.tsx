"use client"

import { useState } from "react"
import { Plus, Home, Eye, Edit, Trash2, Star, Calendar, MessageCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import AddPropertyModal from "./add-property-modal"

interface Property {
  id: number
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  status: "active" | "inactive" | "pending"
  bookings: number
  revenue: number
  lastBooked: string
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Villa Carthage avec vue mer",
    location: "Carthage, Tunis",
    price: 120,
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    bookings: 18,
    revenue: 2160,
    lastBooked: "2024-01-15",
  },
  {
    id: 2,
    title: "Riad traditionnel Médina",
    location: "Médina, Tunis",
    price: 85,
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    bookings: 12,
    revenue: 1020,
    lastBooked: "2024-01-10",
  },
  {
    id: 3,
    title: "Appartement moderne en cours",
    location: "Hammamet, Nabeul",
    price: 95,
    rating: 0,
    reviews: 0,
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
    bookings: 0,
    revenue: 0,
    lastBooked: "Jamais",
  },
]

export default function HostDashboard() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Jamais") return dateString
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const totalRevenue = properties.reduce((sum, property) => sum + property.revenue, 0)
  const totalBookings = properties.reduce((sum, property) => sum + property.bookings, 0)
  const activeProperties = properties.filter((p) => p.status === "active").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord hôte</h1>
            <p className="text-gray-600 mt-2">Gérez vos hébergements et suivez vos performances</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un hébergement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Home className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hébergements</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRevenue}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">{getStatusBadge(property.status)}</div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-red-600 hover:bg-red-700">{property.price}€/nuit</Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{property.title}</h3>
                  {property.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{property.rating}</span>
                      <span className="text-gray-500">({property.reviews})</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{property.location}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Réservations</p>
                    <p className="font-semibold">{property.bookings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenus</p>
                    <p className="font-semibold">{property.revenue}€</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Dernière réservation</p>
                    <p className="font-semibold">{formatDate(property.lastBooked)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Messages
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hébergement</h3>
            <p className="text-gray-600 mb-6">Commencez par ajouter votre premier hébergement</p>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un hébergement
            </Button>
          </div>
        )}
      </div>

      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newProperty: Property) => {
          setProperties((prev) => [...prev, { ...newProperty, id: Date.now() }])
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}
