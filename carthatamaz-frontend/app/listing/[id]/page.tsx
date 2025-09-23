"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  Wifi, 
  Car,
  ArrowLeft,
  MessageCircle,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Waves,
  Shield,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RoleBasedHeader from "@/components/role-based-header"
import { ApiService } from "@/components/services/api"
import type { Listing } from "@/components/types/listing"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function ListingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      if (!listingId) return

      try {
        setLoading(true)
        setError(null)

        // Utiliser l'ApiService pour récupérer les détails de l'hébergement
        const data = await ApiService.fetchGuesthouseById(listingId)
        
        if (data) {
          setListing(data)
        } else {
          throw new Error("Hébergement non trouvé")
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'hébergement:", err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        
        // En cas d'erreur, utiliser des données de démonstration
        setListing({
          id: parseInt(listingId) || 1,
          title: "Magnifique Villa avec Vue sur Mer",
          city: "Hammamet",
          price: 150,
          description: "Découvrez cette superbe villa avec vue imprenable sur la mer Méditerranée. Située dans un quartier calme de Hammamet, cette propriété offre tout le confort moderne pour des vacances inoubliables. La villa dispose d'une piscine privée, d'une terrasse spacieuse avec vue panoramique sur la mer, et d'un jardin luxuriant. L'intérieur est décoré avec goût, alliant modernité et tradition tunisienne.",
          maxGuests: 6,
          amenities: [
            "Wi-Fi gratuit",
            "Piscine privée", 
            "Parking gratuit",
            "Climatisation",
            "Cuisine équipée",
            "Terrasse avec vue mer",
            "Barbecue",
            "Télévision",
            "Machine à laver",
            "Jardin"
          ],
          hostName: "Ahmed Ben Ali",
          hostAvatar: "/placeholder-user.jpg",
          images: [
            "/placeholder.jpg",
            "/placeholder.jpg",
            "/placeholder.jpg"
          ],
          reviews: [
            {
              id: "1",
              username: "Marie Dubois",
              rating: 5,
              comment: "Séjour fantastique ! La villa est exactement comme sur les photos, très propre et bien équipée. La vue sur mer est à couper le souffle."
            },
            {
              id: "2", 
              username: "Jean Martin",
              rating: 4,
              comment: "Très belle propriété dans un cadre magnifique. L'emplacement est parfait pour visiter Hammamet."
            }
          ],
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

  const handleBookClick = () => {
    const params = new URLSearchParams({
      listing: listingId,
      ...(checkIn && { checkin: checkIn }),
      ...(checkOut && { checkout: checkOut }),
      ...(guests > 1 && { guests: guests.toString() })
    })
    router.push(`/booking?${params.toString()}`)
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
  }

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
    }
  }

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }
  }

  if (loading) {
    return (
      <div>
        <RoleBasedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des détails...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div>
        <RoleBasedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold mb-4">Hébergement non trouvé</h2>
            <p className="text-gray-600 mb-6">{error || "L'hébergement que vous recherchez n'existe pas ou n'est plus disponible."}</p>
            <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const slug = slugify(listing.title)
  const imageUrl = `/images/housegate-${slug}.jpeg`
  const images = listing.images && listing.images.length > 0 ? listing.images : [imageUrl, imageUrl, imageUrl]

  const reviews = listing.reviews || []
  const averageRating = listing.rating || 0

  const amenityIcons: { [key: string]: React.ReactNode } = {
    "Wi-Fi gratuit": <Wifi className="w-5 h-5" />,
    "Wifi": <Wifi className="w-5 h-5" />,
    "Parking gratuit": <Car className="w-5 h-5" />,
    "Parking": <Car className="w-5 h-5" />,
    "Piscine": <Waves className="w-5 h-5" />,
    "Piscine privée": <Waves className="w-5 h-5" />,
    "Cuisine équipée": <Coffee className="w-5 h-5" />,
    "Cuisine": <Coffee className="w-5 h-5" />,
    "Sécurité": <Shield className="w-5 h-5" />,
  }

  const amenities = listing.amenities || []
  const displayedAmenities = showAllAmenities ? amenities : amenities.slice(0, 6)

  return (
    <div>
      <RoleBasedHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec navigation */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listing.city}</span>
              {averageRating > 0 && (
                <>
                  <Star className="w-4 h-4 ml-4 mr-1 text-yellow-400 fill-current" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="ml-1">({reviews.length} avis)</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              {isFavorite ? "Retiré" : "Sauvegarder"}
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="w-4 h-4 mr-2" />
              Signaler
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* Galerie d'images */}
            <div className="relative mb-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src={images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg"
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-red-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Informations sur l'hébergement */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Hébergement entier</h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{listing.maxGuests} voyageurs</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src={listing.hostAvatar} alt={listing.hostName || "Hôte"} />
                  <AvatarFallback>{(listing.hostName || "H").charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Hébergé par {listing.hostName || "Hôte"}</p>
                  <p className="text-sm text-gray-600">Hôte depuis 2020</p>
                </div>
              </div>

              <Separator className="mb-6" />

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>
            </div>

            {/* Équipements */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Ce que propose ce logement</h3>
              <div className="grid grid-cols-2 gap-3">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    {amenityIcons[amenity] || <Check className="w-5 h-5" />}
                    <span className="ml-3">{amenity}</span>
                  </div>
                ))}
              </div>
              {amenities.length > 6 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4"
                >
                  {showAllAmenities ? "Voir moins" : `Voir les ${amenities.length - 6} équipements supplémentaires`}
                </Button>
              )}
            </div>

            {/* Avis */}
            {reviews.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                  <h3 className="text-xl font-semibold">{averageRating.toFixed(1)} · {reviews.length} avis</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.slice(0, 6).map((review: any) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarFallback>{review.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.username}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panneau de réservation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">{listing.price} TND</span>
                    <span className="text-gray-600 ml-1">/ nuit</span>
                  </div>
                  {averageRating > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="checkin">Arrivée</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Départ</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="guests">Voyageurs</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max={listing.maxGuests}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                  />
                </div>

                <Button 
                  onClick={handleBookClick}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Réserver
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Aucun prélèvement pour le moment
                </p>

                {checkIn && checkOut && (
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>{listing.price} TND x 1 nuit</span>
                      <span>{listing.price} TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de ménage</span>
                      <span>25 TND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de service</span>
                      <span>15 TND</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{listing.price + 25 + 15} TND</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact de l'hôte */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Contacter l'hôte</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
