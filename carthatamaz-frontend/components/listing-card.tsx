"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Listing as ListingCardProps } from "@/components/types/listing"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")                       // accents → caractères de base
    .replace(/[\u0300-\u036f]/g, "")       // supprime les diacritiques
    .replace(/[^a-z0-9\s-]/g, "")          // supprime caractères spéciaux
    .replace(/[\s_-]+/g, "-")              // remplace espaces et underscores par des tirets
    .replace(/^-+|-+$/g, "")               // supprime les tirets en début/fin
}

export default function ListingCard({ listing }: { listing: ListingCardProps }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=300&width=400&text=Image+non+disponible")

  useEffect(() => {
    if (!listing.title) return

    const slug = slugify(listing.title)
    const localPath = `/images/housegate-${slug}.jpeg`
    setImageUrl(localPath)
  }, [listing.title])

  const reviews = listing.reviews || []
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
      : 0

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleCardClick = () => {
    router.push(`/listing/${listing.id}`)
  }

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/booking?listing=${listing.id}`)
  }

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.title || "Hébergement"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=300&width=400&text=Image+non+disponible"
          }}
        />
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {listing.title || "Titre non disponible"}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listing.city || "Ville non disponible"}</span>
            </div>
          </div>
          {averageRating > 0 && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {typeof listing.price === "number" ? `${listing.price} TND` : listing.price || ""}
            </span>
            <span className="text-gray-600 text-sm ml-1">/ nuit</span>
          </div>
          <Button size="sm" onClick={handleBookClick} className="bg-red-600 hover:bg-red-700 text-xs">
            Réserver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
