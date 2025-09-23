"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Users, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import RoleBasedHeader from "@/components/role-based-header"
import ListingCard from "@/components/listing-card"
import { ApiService } from "@/components/services/api"
import type { Listing } from "@/components/types/listing"

export default function GuestListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [guestCount, setGuestCount] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  
  const cities = ["Tunis", "Hammamet", "Sousse", "Djerba", "Sidi Bou Said", "Tozeur"]
  const priceRanges = [
    { label: "Moins de 100 TND", value: "0-100" },
    { label: "100 - 200 TND", value: "100-200" },
    { label: "200 - 300 TND", value: "200-300" },
    { label: "Plus de 300 TND", value: "300+" }
  ]

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const data = await ApiService.fetchGuesthouses()
      
      // Transformer les données pour qu'elles correspondent au type Listing
      const normalizedListings = data.map((listing: any) => ({
        id: listing.id,
        title: listing.title ?? "",
        city: listing.city ?? listing.location ?? "",
        price: listing.price ?? 0,
        description: listing.description ?? "",
        maxGuests: listing.maxGuests ?? 1,
        amenities: listing.amenities ?? [],
        hostName: listing.hostName ?? "",
        hostAvatar: listing.hostAvatar ?? "",
        images: listing.images ?? [],
        reviews: listing.reviews ?? [],
        rating: listing.rating ?? 0,
        latitude: listing.latitude ?? 0,
        longitude: listing.longitude ?? 0,
        thumbnailUrl: listing.thumbnailUrl ?? "",
        externalUrl: listing.externalUrl ?? "",
        ratingAccuracy: listing.ratingAccuracy ?? 0,
        ratingCleanliness: listing.ratingCleanliness ?? 0,
        ratingCommunication: listing.ratingCommunication ?? 0,
        ratingLocation: listing.ratingLocation ?? 0,
        ratingValue: listing.ratingValue ?? 0,
        ratingGuestSatisfaction: listing.ratingGuestSatisfaction ?? 0,
        owner: listing.owner ?? null,
        instantBook: listing.instantBook ?? false,
        availableDates: listing.availableDates ?? []
      }))
      
      setListings(normalizedListings)
    } catch (error) {
      console.error("Erreur lors du chargement des hébergements:", error)
      
      // En cas d'erreur, utiliser des données de démonstration
      setListings([
        {
          id: 1,
          title: "Villa Moderne avec Piscine",
          city: "Hammamet",
          price: 150,
          description: "Magnifique villa avec vue sur mer",
          maxGuests: 6,
          amenities: ["Wi-Fi gratuit", "Piscine privée", "Parking"],
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
        },
        {
          id: 2,
          title: "Appartement Centre Ville",
          city: "Tunis",
          price: 80,
          description: "Appartement moderne au cœur de Tunis",
          maxGuests: 4,
          amenities: ["Wi-Fi gratuit", "Climatisation", "Cuisine équipée"],
          hostName: "Fatma Saidi",
          hostAvatar: "/placeholder-user.jpg",
          images: ["/placeholder.jpg"],
          reviews: [],
          rating: 4.5,
          latitude: 36.8,
          longitude: 10.2,
          thumbnailUrl: "/placeholder.jpg",
          externalUrl: "",
          ratingAccuracy: 4.5,
          ratingCleanliness: 4.6,
          ratingCommunication: 4.4,
          ratingLocation: 4.7,
          ratingValue: 4.3,
          ratingGuestSatisfaction: 4.5,
          owner: null,
          instantBook: false,
          availableDates: []
        },
        {
          id: 3,
          title: "Maison Traditionnelle",
          city: "Sidi Bou Said",
          price: 120,
          description: "Maison traditionnelle avec vue sur la mer",
          maxGuests: 5,
          amenities: ["Vue mer", "Terrasse", "Wi-Fi gratuit"],
          hostName: "Karim Sassi",
          hostAvatar: "/placeholder-user.jpg",
          images: ["/placeholder.jpg"],
          reviews: [],
          rating: 4.9,
          latitude: 36.9,
          longitude: 10.3,
          thumbnailUrl: "/placeholder.jpg",
          externalUrl: "",
          ratingAccuracy: 4.9,
          ratingCleanliness: 5.0,
          ratingCommunication: 4.8,
          ratingLocation: 4.9,
          ratingValue: 4.8,
          ratingGuestSatisfaction: 4.9,
          owner: null,
          instantBook: true,
          availableDates: []
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(listing => {
    // Filtre par recherche textuelle
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !listing.city.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Filtre par ville
    if (selectedCity && selectedCity !== "all" && listing.city !== selectedCity) {
      return false
    }
    
    // Filtre par nombre de voyageurs
    if (guestCount && guestCount !== "all" && listing.maxGuests < parseInt(guestCount)) {
      return false
    }
    
    // Filtre par prix
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''))
      const minPrice = parseInt(min)
      const maxPrice = max ? parseInt(max) : Infinity
      
      if (listing.price < minPrice || listing.price > maxPrice) {
        return false
      }
    }
    
    return true
  })

  // Tri des résultats
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "popular":
      default:
        return (b.reviews?.length || 0) - (a.reviews?.length || 0)
    }
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCity("all")
    setPriceRange("all")
    setGuestCount("all")
    setSortBy("popular")
  }

  return (
    <div>
      <RoleBasedHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez nos hébergements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez l'hébergement parfait pour vos vacances en Tunisie
          </p>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Recherche */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom ou ville..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Ville */}
              <div>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prix */}
              <div>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les prix</SelectItem>
                    {priceRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Voyageurs */}
              <div>
                <Select value={guestCount} onValueChange={setGuestCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Voyageurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tout</SelectItem>
                    <SelectItem value="1">1 voyageur</SelectItem>
                    <SelectItem value="2">2 voyageurs</SelectItem>
                    <SelectItem value="4">4+ voyageurs</SelectItem>
                    <SelectItem value="6">6+ voyageurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tri */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popularité</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bouton pour effacer les filtres */}
            {(searchQuery || (selectedCity && selectedCity !== "all") || (priceRange && priceRange !== "all") || (guestCount && guestCount !== "all") || sortBy !== "popular") && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Effacer les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compteur de résultats */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? "Chargement..." : `${sortedListings.length} hébergement(s) trouvé(s)`}
          </p>
          {sortedListings.length > 0 && (
            <div className="flex items-center space-x-2">
              {selectedCity && selectedCity !== "all" && (
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedCity}
                </Badge>
              )}
              {guestCount && guestCount !== "all" && (
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {guestCount}+ voyageurs
                </Badge>
              )}
              {priceRange && priceRange !== "all" && (
                <Badge variant="secondary">
                  {priceRanges.find(r => r.value === priceRange)?.label}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Grille des hébergements */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Aucun hébergement trouvé</h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche ou effacez les filtres
              </p>
              <Button onClick={clearFilters} variant="outline">
                Effacer les filtres
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
