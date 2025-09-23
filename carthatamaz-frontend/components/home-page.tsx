"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Users, Star, ChevronRight, Wifi, Car, Waves, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import ListingCard from "@/components/listing-card"
import ReviewSection from "@/components/review-section"
import Chatbot from "@/components/chatbot"
import { ApiService } from "@/components/services/api"
import type { Listing } from "@/components/types/listing"

const regions = [
  {
    name: "Tunis",
    image: "/placeholder.svg?height=200&width=300&text=Tunis",
    properties: "120+ propriétés",
    description: "Capitale historique avec médina UNESCO",
  },
  {
    name: "Hammamet",
    image: "/placeholder.svg?height=200&width=300&text=Hammamet",
    properties: "85+ propriétés",
    description: "Station balnéaire de renommée mondiale",
  },
  {
    name: "Sousse",
    image: "/placeholder.svg?height=200&width=300&text=Sousse",
    properties: "95+ propriétés",
    description: "Perle du Sahel, plages et histoire",
  },
  {
    name: "Djerba",
    image: "/placeholder.svg?height=200&width=300&text=Djerba",
    properties: "150+ propriétés",
    description: "Île paradisiaque aux traditions préservées",
  },
  {
    name: "Sidi Bou Said",
    image: "/placeholder.svg?height=200&width=300&text=Sidi+Bou+Said",
    properties: "45+ propriétés",
    description: "Village pittoresque bleu et blanc",
  },
  {
    name: "Tozeur",
    image: "/placeholder.svg?height=200&width=300&text=Tozeur",
    properties: "30+ propriétés",
    description: "Oasis du désert, porte du Sahara",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ApiService.fetchGuesthouses()

        // Ensure each listing has all required properties for ListingCard
        const normalizedListings = data.map((listing: any) => ({
          id: listing.id,
          title: listing.title ?? "",
          location: listing.location ?? "",
          city: listing.city ?? listing.location ?? "",
          rating: listing.rating ?? 0,
          ratingAccuracy: listing.ratingAccuracy ?? 0,
          ratingCleanliness: listing.ratingCleanliness ?? 0,
          ratingCommunication: listing.ratingCommunication ?? 0,
          ratingLocation: listing.ratingLocation ?? 0,
          ratingValue: listing.ratingValue ?? 0,
          ratingGuestSatisfaction: listing.ratingGuestSatisfaction ?? 0,
          images: listing.images ?? [],
          amenities: listing.amenities ?? [],
          price: listing.price ?? 0,
          description: listing.description ?? "",
          latitude: listing.latitude ?? 0,
          longitude: listing.longitude ?? 0,
          thumbnailUrl: listing.thumbnailUrl ?? "",
          externalUrl: listing.externalUrl ?? "",
          hostName: listing.hostName ?? "",
          hostAvatar: listing.hostAvatar ?? "",
          reviews: listing.reviews ?? [],
          maxGuests: listing.maxGuests ?? 1,
          availableDates: listing.availableDates ?? [],
          owner: listing.owner ?? "",
          instantBook: listing.instantBook ?? false,
        }))

        setListings(normalizedListings)
      } catch (err) {
        setError("Erreur lors du chargement des hébergements")
        console.error("Error fetching listings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    router.push(`/search?${params.toString()}`)
  }

  const handleRegionClick = (regionName: string) => {
    router.push(`/search?city=${encodeURIComponent(regionName)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez la <span className="text-red-200">Tunisie Authentique</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Des hébergements uniques pour des expériences inoubliables dans le berceau de la civilisation
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Où souhaitez-vous aller ?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrivée</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input type="date" className="pl-10 h-12" />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-lg font-semibold"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommandations Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Nos Recommandations</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sélectionnés spécialement pour vous : les hébergements les plus populaires et les mieux notés de Tunisie
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.slice(0, 6).map((listing) => (
              <div key={listing.id} className="transform hover:scale-105 transition-transform duration-300">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
          
          {listings.length === 0 && !loading && (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune recommandation disponible</h3>
              <p className="text-gray-500">Nos recommandations seront bientôt disponibles</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push("/search")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Voir toutes nos recommandations
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorez nos Régions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              De la médina historique de Tunis aux plages dorées de Djerba, découvrez la diversité de la Tunisie
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <Card
                key={region.name}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => handleRegionClick(region.name)}
              >
                <div className="relative h-48">
                  <img
                    src={region.image || "/placeholder.svg"}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{region.name}</h3>
                    <p className="text-sm opacity-90">{region.properties}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm">{region.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Listings Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Hébergements Populaires</h2>
              <p className="text-lg text-gray-600">Les mieux notés par nos voyageurs</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/search")}
              className="hidden md:flex items-center bg-transparent"
            >
              Voir tout
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="bg-transparent">
                Réessayer
              </Button>
            </div>
          )}

          {!loading && !error && listings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.slice(0, 6).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Aucun hébergement disponible pour le moment</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="bg-transparent">
                Actualiser
              </Button>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" onClick={() => router.push("/search")} className="bg-transparent">
              Voir tous les hébergements
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi Choisir CarthaTamaz ?</h2>
            <p className="text-lg text-gray-600">Une expérience de voyage authentique et sécurisée</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hébergements Vérifiés</h3>
              <p className="text-gray-600">
                Tous nos hébergements sont vérifiés pour garantir votre sécurité et votre confort.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
              <p className="text-gray-600">
                Notre équipe est disponible 24h/24 pour vous accompagner durant votre séjour.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expérience Locale</h3>
              <p className="text-gray-600">Découvrez la Tunisie authentique avec nos hôtes locaux passionnés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection />

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à Découvrir la Tunisie ?</h2>
          <p className="text-xl mb-8">Rejoignez des milliers de voyageurs qui ont choisi CarthaTamaz</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => router.push("/search")}
            >
              Commencer ma Recherche
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent"
              onClick={() => router.push("/signup")}
            >
              Devenir Hôte
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-red-500 mb-4">CarthaTamaz</h3>
              <p className="text-gray-400 mb-4">
                Votre plateforme de confiance pour découvrir les plus beaux hébergements de Tunisie.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-gray-400">
                  <Wifi className="h-4 w-4 mr-2" />
                  <span className="text-sm">WiFi gratuit</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Car className="h-4 w-4 mr-2" />
                  <span className="text-sm">Parking</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Waves className="h-4 w-4 mr-2" />
                  <span className="text-sm">Piscine</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-gray-400">
                {regions.slice(0, 4).map((region) => (
                  <li key={region.name}>
                    <button
                      onClick={() => handleRegionClick(region.name)}
                      className="hover:text-white transition-colors"
                    >
                      {region.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => router.push("/help")} className="hover:text-white transition-colors">
                    Centre d'aide
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/contact")} className="hover:text-white transition-colors">
                    Nous contacter
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/safety")} className="hover:text-white transition-colors">
                    Sécurité
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/terms")} className="hover:text-white transition-colors">
                    Conditions
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hôtes</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => router.push("/host/signup")} className="hover:text-white transition-colors">
                    Devenir hôte
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/host/resources")} className="hover:text-white transition-colors">
                    Ressources
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/host/community")} className="hover:text-white transition-colors">
                    Communauté
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push("/host/standards")} className="hover:text-white transition-colors">
                    Standards
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CarthaTamaz. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
