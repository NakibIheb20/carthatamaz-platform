"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Coffee,
  Waves,
  Shield,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface ListingDetailProps {
  listingId: string
  action?: string
}

// Mock data - remplacez par un appel API réel
const mockListing = {
  id: 1,
  title: "Villa Luxueuse avec Piscine - Sidi Bou Said",
  location: "Sidi Bou Said, Tunis",
  price: 180,
  rating: 4.9,
  reviewCount: 127,
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  description:
    "Magnifique villa traditionnelle tunisienne avec une vue imprenable sur la mer Méditerranée. Située dans le pittoresque village de Sidi Bou Said, cette propriété offre un mélange parfait entre authenticité et confort moderne.",
  amenities: [
    { name: "Piscine privée", icon: Waves },
    { name: "WiFi gratuit", icon: Wifi },
    { name: "Parking gratuit", icon: Car },
    { name: "Cuisine équipée", icon: Coffee },
    { name: "Climatisation", icon: Shield },
    { name: "Terrasse", icon: Shield },
  ],
  specifications: {
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    beds: 6,
  },
  host: {
    name: "Ahmed Ben Ali",
    avatar: "/placeholder.svg?height=60&width=60",
    verified: true,
    joinedDate: "2019",
    responseRate: 98,
    responseTime: "1 heure",
    reviews: 156,
    description: "Passionné par l'hospitalité tunisienne, je partage ma culture avec mes invités depuis plus de 5 ans.",
  },
  rules: [
    "Arrivée après 15h00",
    "Départ avant 11h00",
    "Non-fumeur",
    "Animaux non autorisés",
    "Pas de fêtes ou événements",
  ],
  reviews: [
    {
      id: 1,
      user: "Marie Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "Décembre 2023",
      comment:
        "Séjour absolument parfait ! La villa est encore plus belle qu'en photos. Ahmed est un hôte exceptionnel.",
    },
    {
      id: 2,
      user: "Jean Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "Novembre 2023",
      comment: "Vue magnifique, propriété impeccable et accueil chaleureux. Je recommande vivement !",
    },
  ],
}

export default function ListingDetail({ listingId, action }: ListingDetailProps) {
  const [listing] = useState(mockListing)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [showBookingForm, setShowBookingForm] = useState(action === "book")
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Lien copié dans le presse-papiers !")
    }
  }

  const handleContactHost = () => {
    router.push(`/messages?host=${listing.host.name}&listing=${listing.id}`)
  }

  const handleBooking = () => {
    // Logique de réservation
    alert("Réservation en cours de traitement...")
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
  }

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return nights * listing.price
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button variant="ghost" onClick={handleFavoriteToggle}>
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title and Rating */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{listing.rating}</span>
              <span className="text-gray-500 ml-1">({listing.reviewCount} avis)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {listing.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={listing.images[currentImageIndex] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-red-500" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              {/* Specifications */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Détails de la propriété</h2>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {listing.specifications.guests} voyageurs
                  </div>
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    {listing.specifications.bedrooms} chambres
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    {listing.specifications.bathrooms} salles de bain
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Équipements</h2>
                <div className="grid grid-cols-2 gap-4">
                  {listing.amenities.map((amenity, index) => {
                    const Icon = amenity.icon
                    return (
                      <div key={index} className="flex items-center">
                        <Icon className="h-5 w-5 mr-3 text-gray-600" />
                        <span>{amenity.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Host Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Votre hôte</h2>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={listing.host.avatar || "/placeholder.svg"} alt={listing.host.name} />
                    <AvatarFallback>{listing.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{listing.host.name}</h3>
                      {listing.host.verified && <Badge className="bg-green-100 text-green-800">Vérifié</Badge>}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Hôte depuis {listing.host.joinedDate}</p>
                      <p>
                        {listing.host.reviews} avis · Taux de réponse: {listing.host.responseRate}%
                      </p>
                      <p>Répond généralement en {listing.host.responseTime}</p>
                    </div>
                    <p className="text-gray-700 mt-3">{listing.host.description}</p>
                    <Button variant="outline" className="mt-4 bg-transparent" onClick={handleContactHost}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter l'hôte
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rules */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Règles de la maison</h2>
                <ul className="space-y-2">
                  {listing.rules.map((rule, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Reviews */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Avis ({listing.reviewCount})</h2>
                <div className="space-y-6">
                  {listing.reviews.map((review) => (
                    <div key={review.id} className="flex space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                        <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.date}</p>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">{listing.price}€</span>
                    <span className="text-gray-600 text-base font-normal">/nuit</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{listing.rating}</span>
                    <span className="text-gray-500 ml-1">({listing.reviewCount})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Arrivée</label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Départ</label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>

                {/* Guests Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">Voyageurs</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {[...Array(listing.specifications.guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} voyageur{i > 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Breakdown */}
                {checkIn && checkOut && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>
                        {listing.price}€ ×{" "}
                        {Math.ceil(
                          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        nuits
                      </span>
                      <span>{calculateTotal()}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de service</span>
                      <span>{Math.round(calculateTotal() * 0.1)}€</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{calculateTotal() + Math.round(calculateTotal() * 0.1)}€</span>
                    </div>
                  </div>
                )}

                {/* Booking Button */}
                <Button
                  onClick={handleBooking}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!checkIn || !checkOut}
                >
                  Réserver maintenant
                </Button>

                <p className="text-center text-sm text-gray-600">Vous ne serez pas débité pour le moment</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
