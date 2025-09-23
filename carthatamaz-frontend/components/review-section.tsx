"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Review {
  id: number
  author: string
  rating: number
  date: string
  language: string
  text: string
  location: string
  avatar: string
}

const reviews: Review[] = [
  {
    id: 1,
    author: "Marie Dubois",
    rating: 5,
    date: "2024-01-15",
    language: "FR",
    text: "Séjour absolument magique ! L'hospitalité tunisienne à son meilleur. La villa était impeccable et la vue sur la mer à couper le souffle. Ahmed, notre hôte, était aux petits soins.",
    location: "France",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    author: "Marco Rossi",
    rating: 4,
    date: "2024-01-10",
    language: "IT",
    text: "Esperienza autentica nel cuore della medina. Il riad tradizionale era bellissimo e Fatma ci ha fatto sentire come a casa. Colazione tipica deliziosa ogni mattina.",
    location: "Italie",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    author: "Sarah Johnson",
    rating: 5,
    date: "2024-01-08",
    language: "EN",
    text: "Outstanding experience in Hammamet! The apartment was modern, clean, and perfectly located. Mohamed was incredibly helpful with local recommendations. Will definitely return!",
    location: "États-Unis",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    author: "Hans Mueller",
    rating: 4,
    date: "2024-01-05",
    language: "DE",
    text: "Wunderbare Gastfreundschaft und authentische Erfahrung. Die Unterkunft war sauber und komfortabel. Besonders die traditionellen Gerichte waren ein Highlight unseres Aufenthalts.",
    location: "Allemagne",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function ReviewSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const reviewsPerPage = 2
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)

  const getCurrentReviews = () => {
    const start = currentPage * reviewsPerPage
    return reviews.slice(start, start + reviewsPerPage)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      FR: "🇫🇷",
      EN: "🇺🇸",
      IT: "🇮🇹",
      DE: "🇩🇪",
    }
    return flags[language] || "🌍"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getCurrentReviews().map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {getLanguageFlag(review.language)} {review.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <Globe className="h-3 w-3" />
                    <span>{review.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? "default" : "outline"}
                size="sm"
                className={`w-8 h-8 p-0 ${i === currentPage ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-red-50 rounded-lg p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-red-600 mb-2">4.7</div>
            <div className="text-sm text-gray-600">Note moyenne</div>
            <div className="flex items-center justify-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 mb-2">156</div>
            <div className="text-sm text-gray-600">Avis vérifiés</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Recommandations</div>
          </div>
        </div>
      </div>
    </div>
  )
}
