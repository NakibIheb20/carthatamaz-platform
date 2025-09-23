"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NavigationMenu from "@/components/navigation/navigation-menu"
import { ApiService, type Reservation } from "@/components/services/api-complete"

interface Booking {
  id: string
  title: string
  location: string
  image: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "upcoming" | "current" | "completed" | "cancelled"
  host: string
  bookingDate: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les réservations depuis l'API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const apiBookings = await ApiService.fetchMyReservations()
        
        // Transformer les données de l'API pour correspondre à notre interface
        const formattedBookings: Booking[] = apiBookings.map(booking => ({
          id: booking.id,
          title: booking.guestHouseTitle,
          location: "Lieu à récupérer depuis l'API", // À remplacer par les vraies données
          image: booking.guestHouseImage || "/placeholder.svg?height=200&width=300",
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          totalPrice: booking.totalPrice,
          status: booking.status.toLowerCase() as "upcoming" | "current" | "completed" | "cancelled",
          host: booking.hostName,
          bookingDate: booking.bookingDate,
        }))
        
        setBookings(formattedBookings)
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookings()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">À venir</Badge>
      case "current":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const filterBookings = (status: string) => {
    if (status === "all") return bookings
    return bookings.filter((booking) => booking.status === status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <img src={booking.image || "/placeholder.svg"} alt={booking.title} className="w-48 h-32 object-cover" />
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{booking.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{booking.location}</span>
              </div>
              <p className="text-sm text-gray-600">Hôte: {booking.host}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <p className="font-medium">Arrivée</p>
                <p>{formatDate(booking.checkIn)}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <p className="font-medium">Départ</p>
                <p>{formatDate(booking.checkOut)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>
                {booking.guests} voyageur{booking.guests > 1 ? "s" : ""}
              </span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-gray-900">{booking.totalPrice}€ total</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              {booking.status === "completed" && (
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-1" />
                  Avis
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Réservations</h1>
          <p className="text-gray-600">Gérez toutes vos réservations d'hébergements</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="current">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bookings.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                  <p className="text-gray-600 mb-6">Vous n'avez pas encore effectué de réservation</p>
                  <Button className="bg-red-600 hover:bg-red-700">Découvrir des hébergements</Button>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {filterBookings("upcoming").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="current" className="space-y-4">
            {filterBookings("current").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterBookings("completed").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filterBookings("cancelled").map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
