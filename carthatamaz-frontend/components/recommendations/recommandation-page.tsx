// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import NavigationMenu from "@/components/navigation/navigation-menu"
// import { Loader2 } from "lucide-react"

// type Recommendation = {
//   id_listing: number
//   title: string
//   city_listing: string
//   description: string
//   rating: number
//   accuracy: number
//   score: number
//   reviews_positives: string[]
//   sentiment_moyen: number
// }

// export default function RecommendationPage() {
//   const [title, setTitle] = useState("")
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const fetchRecommendations = async () => {
//     if (!title.trim()) return
//     setLoading(true)
//     setError("")
//     setRecommendations([])
//     try {
//       const response = await fetch("http://localhost:5000/recommend", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ title }),
//       })

//       if (!response.ok) {
//         throw new Error(`Erreur serveur: ${response.status}`)
//       }

//       const data = await response.json()
//       setRecommendations(data.recommendations || [])
//     } catch (err) {
//       setError("Une erreur est survenue lors de la récupération des recommandations.")
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <NavigationMenu />

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommandations personnalisées</h1>
//           <p className="text-gray-600">Entrez un titre de logement pour obtenir des recommandations</p>
//         </div>

//         <div className="flex gap-4 mb-8">
//           <Input
//             placeholder="Ex : Appartement moderne avec vue mer"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="flex-1"
//           />
//           <Button onClick={fetchRecommendations} disabled={loading || !title.trim()}>
//             {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Recommander"}
//           </Button>
//         </div>

//         {error && <p className="text-red-600 mb-4">{error}</p>}

//         {!loading && recommendations.length === 0 && !error ? (
//           <Card className="text-center py-12">
//             <CardContent>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune recommandation pour le moment</h3>
//               <p className="text-gray-600">Entrez un titre pour voir les recommandations de logements similaires.</p>
//             </CardContent>
//           </Card>
//         ) : null}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recommendations.map((rec) => (
//             <Card key={rec.id_listing}>
//               <CardContent className="p-4">
//                 <h2 className="text-xl font-semibold mb-1">{rec.title}</h2>
//                 <p className="text-gray-500 mb-2">{rec.city_listing}</p>
//                 <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
//                 <p className="text-sm text-gray-600">Note : {rec.rating.toFixed(2)} ⭐</p>
//                 <p className="text-sm text-gray-600">Précision : {rec.accuracy}</p>
//                 <p className="text-sm text-gray-600">Score : {rec.score.toFixed(3)}</p>
//                 <p className="text-sm text-gray-600 mb-2">Sentiment moyen : {rec.sentiment_moyen.toFixed(2)}</p>
//                 {rec.reviews_positives.length > 0 && (
//                   <div className="text-sm text-gray-700 mt-2">
//                     <strong>Avis positif :</strong>
//                     <p>"{rec.reviews_positives[0]}"</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import NavigationMenu from "@/components/navigation/navigation-menu"
import { Loader2, Star, MapPin } from "lucide-react"

type Recommendation = {
  id_listing: number
  title: string
  city_listing: string
  description: string
  rating: number
  accuracy: number
  score: number
  reviews_positives: string[]
  sentiment_moyen: number
  price?: number | string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function RecommendationPage() {
  const [title, setTitle] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRecommendations = async () => {
    if (!title.trim()) return
    setLoading(true)
    setError("")
    setRecommendations([])
    try {
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`)
      }

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      setError("Une erreur est survenue lors de la récupération des recommandations.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommandations personnalisées</h1>
          <p className="text-gray-600">Entrez un titre de logement pour obtenir des recommandations</p>
        </div>

        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Ex : Appartement moderne avec vue mer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1"
          />
          <Button onClick={fetchRecommendations} disabled={loading || !title.trim()}>
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Recommander"}
          </Button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && recommendations.length === 0 && !error ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune recommandation pour le moment</h3>
              <p className="text-gray-600">Entrez un titre pour voir les recommandations de logements similaires.</p>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => {
            const slug = slugify(rec.title)
            const imagePath = `/images/housegate-${slug}.jpeg`

            return (
              <Card key={rec.id_listing} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <img
                    src={imagePath}
                    alt={rec.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=300&width=400&text=Image+non+disponible"
                    }}
                  />
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{rec.title}</h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{rec.city_listing}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{rec.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">{rec.description}</p>
                  <p className="text-sm text-gray-600">Précision : {rec.accuracy}</p>
                  <p className="text-sm text-gray-600">Score : {rec.score.toFixed(3)}</p>
                  <p className="text-sm text-gray-600 mb-2">Sentiment moyen : {rec.sentiment_moyen.toFixed(2)}</p>

                  {rec.reviews_positives.length > 0 && (
                    <div className="text-sm text-gray-700 mt-2">
                      <strong>Avis positif :</strong>
                      <p>"{rec.reviews_positives[0]}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
