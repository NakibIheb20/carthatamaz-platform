"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ListingCard from "@/components/listing-card"
import { ApiService } from "@/components/services/api"
import type { Listing } from "@/components/types/listing"
// If SearchFilters is not exported, define it locally or import the correct type:
type SearchFilters = {
  q?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  propertyType?: string
  maxGuests?: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    minPrice: undefined,
    maxPrice: undefined,
    amenities: [],
    propertyType: "",
    maxGuests: undefined,
  })
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true)
      try {
        console.log("SearchPage: Loading listings with filters:", filters)
        const data = await ApiService.searchGuesthouses(filters)
        console.log("SearchPage: Received listings:", data.length)

        // Appliquer le tri
        const sortedData = [...data]
        switch (sortBy) {
          case "price-low":
            sortedData.sort((a, b) => {
              const priceA = typeof a.price === "number" ? a.price : Number.parseFloat(String(a.price ?? "0"))
              const priceB = typeof b.price === "number" ? b.price : Number.parseFloat(String(b.price ?? "0"))
              return priceA - priceB
            })
            break
          case "price-high":
            sortedData.sort((a, b) => {
              const priceA = typeof a.price === "number" ? a.price : Number.parseFloat(String(a.price ?? "0"))
              const priceB = typeof b.price === "number" ? b.price : Number.parseFloat(String(b.price ?? "0"))
              return priceB - priceA
            })
            break
          case "rating":
            sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0))
            break
          default:
            // Garder l'ordre par défaut (pertinence)
            break
        }
        setListings(sortedData)
      } catch (error) {
        console.error("SearchPage: Error loading listings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [filters, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Les filtres sont déjà appliqués via useEffect
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }))
  }

  const clearFilters = () => {
    setFilters({
      q: "",
      city: "",
      minPrice: undefined,
      maxPrice: undefined,
      amenities: [],
      propertyType: "",
      maxGuests: undefined,
    })
  }

  const popularAmenities = [
    "Wi-Fi",
    "Parking",
    "Piscine",
    "Climatisation",
    "Cuisine équipée",
    "Petit-déjeuner",
    "Terrasse",
    "Vue mer",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Où souhaitez-vous aller ?"
                    value={filters.q || ""}
                    onChange={(e) => handleFilterChange("q", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des filtres */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700">
                  Effacer tout
                </Button>
              </div>

              <div className="space-y-6">
                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <Input
                    type="text"
                    placeholder="Entrez une ville"
                    value={filters.city || ""}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix par nuit (TND)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice || ""}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value ? Number.parseInt(e.target.value) : undefined)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice || ""}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value ? Number.parseInt(e.target.value) : undefined)
                      }
                    />
                  </div>
                </div>

                {/* Type de propriété */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de logement</label>
                  <Select
                    value={filters.propertyType || "tous"}
                    onValueChange={(value) => handleFilterChange("propertyType", value === "tous" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les types</SelectItem>
                      <SelectItem value="Maison d'hôtes">Maison d'hôtes</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Appartement">Appartement</SelectItem>
                      <SelectItem value="Riad">Riad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nombre de voyageurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de voyageurs</label>
                  <Select
                    value={filters.maxGuests?.toString() || "peu-importe"}
                    onValueChange={(value) =>
                      handleFilterChange("maxGuests", value === "peu-importe" ? undefined : Number.parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nombre de voyageurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peu-importe">Peu importe</SelectItem>
                      <SelectItem value="1">1 voyageur</SelectItem>
                      <SelectItem value="2">2 voyageurs</SelectItem>
                      <SelectItem value="4">4 voyageurs</SelectItem>
                      <SelectItem value="6">6 voyageurs</SelectItem>
                      <SelectItem value="8">8+ voyageurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Équipements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Équipements</label>
                  <div className="space-y-2">
                    {popularAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={filters.amenities?.includes(amenity) || false}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <label htmlFor={amenity} className="text-sm text-gray-700 cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1">
            {/* Header des résultats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? "Recherche en cours..." : `${listings.length} hébergements trouvés`}
                </h2>
                {(filters.q || filters.city) && (
                  <p className="text-gray-600 mt-1">
                    {filters.q && `Recherche: "${filters.q}"`}
                    {filters.q && filters.city && " • "}
                    {filters.city && `Ville: ${filters.city}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Mieux notés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grille des résultats */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl aspect-[4/3] animate-pulse"></div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun hébergement trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou explorez d'autres destinations.
                </p>
                <Button onClick={clearFilters} className="bg-red-600 hover:bg-red-700">
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
