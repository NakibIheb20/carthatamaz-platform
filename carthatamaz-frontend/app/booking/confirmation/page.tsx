"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Calendar, MapPin, Users, Download, MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function BookingConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams?.get("id")

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        // Simuler un appel API - remplacez par votre vraie API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setBooking({
          id: bookingId,
          status: "confirmed",
          confirmationNumber: `BK${bookingId}`,
          listing: {
            title: "Magnifique Villa avec Vue sur Mer",
            city: "Hammamet",
            address: "123 Avenue de la Plage, Hammamet 8050",
            price: 150
          },
          host: {
            name: "Ahmed Ben Ali",
            phone: "+216 20 123 456",
            email: "ahmed.benali@email.com",
            avatar: "/placeholder.svg"
          },
          guest: {
            name: "Jean Dupont",
            email: "jean.dupont@email.com",
            phone: "+33 6 12 34 56 78"
          },
          dates: {
            checkIn: "2024-08-15",
            checkOut: "2024-08-20"
          },
          guests: 4,
          nights: 5,
          pricing: {
            subtotal: 750,
            serviceFee: 75,
            taxes: 37.5,
            total: 862.5
          },
          createdAt: new Date().toISOString()
        })
      } catch (error) {
        console.error("Erreur lors du chargement de la réservation:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  const handleDownloadConfirmation = () => {
    // Simuler le téléchargement d'un PDF
    console.log("Téléchargement de la confirmation...")
  }

  const handleContactHost = () => {
    if (booking?.host?.phone) {
      window.open(`tel:${booking.host.phone}`)
    }
  }

  const handleMessageHost = () => {
    router.push(`/messages?host=${booking?.host?.id}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Réservation non trouvée</p>
          <Button onClick={() => router.push("/")}>
            Retourner à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header de confirmation */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Réservation confirmée !
        </h1>
        <p className="text-lg text-gray-600">
          Votre voyage est confirmé. Vous allez passer un séjour fantastique !
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
            Confirmation N° {booking.confirmationNumber}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informations de réservation */}
        <div className="space-y-6">
          {/* Détails du séjour */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Votre séjour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{booking.listing.title}</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{booking.listing.address}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Arrivée</p>
                    <p className="font-semibold">
                      {new Date(booking.dates.checkIn).toLocaleDateString("fr-FR", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">À partir de 15h00</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Départ</p>
                    <p className="font-semibold">
                      {new Date(booking.dates.checkOut).toLocaleDateString("fr-FR", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Avant 11h00</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-600" />
                  <span>{booking.guests} voyageur{booking.guests > 1 ? 's' : ''}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de l'hôte */}
          <Card>
            <CardHeader>
              <CardTitle>Votre hôte : {booking.host.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Votre hôte vous contactera bientôt pour finaliser les détails de votre arrivée.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={handleContactHost}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={handleMessageHost}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => window.open(`mailto:${booking.host.email}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Vos prochaines étapes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Préparez votre voyage</p>
                    <p className="text-sm text-gray-600">Consultez les recommandations locales et planifiez vos activités</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Contactez votre hôte</p>
                    <p className="text-sm text-gray-600">Coordonnez les détails d'arrivée et posez vos questions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Profitez de votre séjour !</p>
                    <p className="text-sm text-gray-600">N'oubliez pas de laisser un avis après votre séjour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Récapitulatif financier */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif du paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{booking.listing.price} TND × {booking.nights} nuit{booking.nights > 1 ? 's' : ''}</span>
                  <span>{booking.pricing.subtotal} TND</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Frais de service</span>
                  <span>{booking.pricing.serviceFee} TND</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{booking.pricing.taxes} TND</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total payé</span>
                  <span>{booking.pricing.total} TND</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadConfirmation}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger la confirmation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Politique d'annulation */}
          <Card>
            <CardHeader>
              <CardTitle>Politique d'annulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Annulation gratuite jusqu'à 48h avant l'arrivée</span>
                </div>
                <p className="text-gray-600">
                  Après cette période, des frais d'annulation peuvent s'appliquer selon la politique de l'hôte.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support client */}
          <Card>
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe de support est disponible 24h/24 et 7j/7 pour vous aider.
              </p>
              <Button variant="outline" className="w-full">
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Boutons d'action principaux */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <Button
          onClick={() => router.push("/bookings")}
          className="bg-red-600 hover:bg-red-700"
        >
          Voir mes réservations
        </Button>
        
        <Button
          variant="outline"
          onClick={() => router.push("/")}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  )
}
