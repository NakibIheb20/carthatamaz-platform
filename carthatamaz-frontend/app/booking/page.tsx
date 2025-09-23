"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, Users, CreditCard, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import RoleBasedHeader from "@/components/role-based-header"
import { ApiService } from "@/components/services/api"
import type { Listing } from "@/components/types/listing"

export default function BookingDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const listingId = searchParams?.get("listing")
  const checkInParam = searchParams?.get("checkin")
  const checkOutParam = searchParams?.get("checkout")
  const guestsParam = searchParams?.get("guests")

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  
  // Informations de réservation
  const [checkIn, setCheckIn] = useState(checkInParam || "")
  const [checkOut, setCheckOut] = useState(checkOutParam || "")
  const [guests, setGuests] = useState(parseInt(guestsParam || "1"))
  const [message, setMessage] = useState("")
  
  // Informations de paiement
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      if (!listingId) return

      try {
        setLoading(true)
        // Utiliser l'ApiService pour récupérer les détails de l'hébergement
        const data = await ApiService.fetchGuesthouseById(listingId)
        
        if (data) {
          setListing(data)
        } else {
          // En cas d'erreur, utiliser des données de démonstration
          setListing({
            id: parseInt(listingId) || 1,
            title: "Magnifique Villa avec Vue sur Mer",
            city: "Hammamet",
            price: 150,
            description: "Villa moderne avec piscine privée",
            maxGuests: 6,
            amenities: ["Wi-Fi gratuit", "Piscine privée", "Parking gratuit"],
            hostName: "Ahmed Ben Ali",
            hostAvatar: "/placeholder-user.jpg",
            images: ["/placeholder.jpg"],
            reviews: [],
            rating: 4.8,
            latitude: 36.4,
            longitude: 10.6,
            thumbnailUrl: "/placeholder.jpg",
            externalUrl: "",
            ratingAccuracy: 4.8,
            ratingCleanliness: 4.9,
            ratingCommunication: 4.7,
            ratingLocation: 4.8,
            ratingValue: 4.6,
            ratingGuestSatisfaction: 4.8,
            owner: null,
            instantBook: true,
            availableDates: []
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
        // En cas d'erreur, utiliser des données de démonstration
        setListing({
          id: parseInt(listingId || "1"),
          title: "Magnifique Villa avec Vue sur Mer",
          city: "Hammamet",
          price: 150,
          description: "Villa moderne avec piscine privée",
          maxGuests: 6,
          amenities: ["Wi-Fi gratuit", "Piscine privée", "Parking gratuit"],
          hostName: "Ahmed Ben Ali",
          hostAvatar: "/placeholder-user.jpg",
          images: ["/placeholder.jpg"],
          reviews: [],
          rating: 4.8,
          latitude: 36.4,
          longitude: 10.6,
          thumbnailUrl: "/placeholder.jpg",
          externalUrl: "",
          ratingAccuracy: 4.8,
          ratingCleanliness: 4.9,
          ratingCommunication: 4.7,
          ratingLocation: 4.8,
          ratingValue: 4.6,
          ratingGuestSatisfaction: 4.8,
          owner: null,
          instantBook: true,
          availableDates: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [listingId])

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    if (!listing) return 0
    const nights = calculateNights()
    const subtotal = listing.price * nights
    const serviceFee = Math.round(subtotal * 0.1) // 10% de frais de service
    const taxes = Math.round(subtotal * 0.05) // 5% de taxes
    return subtotal + serviceFee + taxes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simuler l'envoi de la réservation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Rediriger vers une page de confirmation
      router.push(`/booking/confirmation?id=${Date.now()}`)
    } catch (error) {
      console.error("Erreur lors de la réservation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <RoleBasedHeader />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div>
        <RoleBasedHeader />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Hébergement non trouvé</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const nights = calculateNights()
  const subtotal = listing.price * nights
  const serviceFee = Math.round(subtotal * 0.1)
  const taxes = Math.round(subtotal * 0.05)
  const total = calculateTotal()

  return (
    <div>
      <RoleBasedHeader />
      <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Confirmer et payer
          </h1>
          <p className="text-gray-600 mt-1">
            Votre voyage commence ici
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de réservation */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Votre voyage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Votre voyage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin">Date d'arrivée</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Date de départ</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guests">Nombre de voyageurs</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message pour l'hôte (optionnel)</Label>
                  <Textarea
                    id="message"
                    placeholder="Dites bonjour à votre hôte et mentionnez pourquoi vous voyagez"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d'expiration</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Vos informations de paiement sont sécurisées et cryptées</span>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Traitement en cours...
                </>
              ) : (
                "Confirmer et payer"
              )}
            </Button>
          </form>
        </div>

        {/* Récapitulatif */}
        <div className="lg:sticky lg:top-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <img
                  src="/placeholder.svg?height=80&width=80"
                  alt={listing.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  <p className="text-gray-600">{listing.city}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Hébergé par {listing.hostName}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Separator className="mb-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Dates</span>
                  <span>
                    {checkIn && checkOut ? 
                      `${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()}` :
                      "Non sélectionnées"
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Voyageurs</span>
                  <span>{guests} voyageur{guests > 1 ? 's' : ''}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{listing.price} TND × {nights} nuit{nights > 1 ? 's' : ''}</span>
                  <span>{subtotal} TND</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Frais de service</span>
                  <span>{serviceFee} TND</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{taxes} TND</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{total} TND</span>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  <span>Annulation gratuite pendant 48h</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  <span>Support client 24h/24</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-2" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}
