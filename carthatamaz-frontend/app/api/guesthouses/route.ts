import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

// Mock data as fallback
const mockGuesthouses = [
  {
    id: "6878d68de8439306d9e49744",
    title: "Sabri traum 1",
    description: "Welcome to our charming studio just steps from the sea! Ideal for a solo stay or a couple's stay",
    latitude: 36.40490045179492,
    longitude: 10.649458967053125,
    thumbnailUrl:
      "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149705/original/2a29103b-bc4d-4ece-b239-dce468fd4630.jpeg",
    externalUrl:
      "https://www.airbnb.com/rooms/1379865254000149705?locale=en-US&currency=USD&check_in=2025-07-15&check_out=2025-07-20",
    city: "Hammamet",
    price: "85",
    originalPrice: "100",
    discountedPrice: "85",
    ratingAccuracy: 4.8,
    ratingCleanliness: 4.9,
    ratingCommunication: 4.7,
    ratingLocation: 4.92,
    ratingValue: 4.67,
    ratingGuestSatisfaction: 5.0,
    owner: null,
    reviews: null,
  },
  {
    id: "6878d68de8439306d9e49745",
    title: "Villa Luxueuse Sidi Bou Said",
    description: "Magnifique villa avec vue panoramique sur la mer Méditerranée dans le célèbre village bleu et blanc",
    latitude: 36.8675,
    longitude: 10.3467,
    thumbnailUrl: "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149706/original/villa-sidi-bou-said.jpeg",
    externalUrl: "https://www.airbnb.com/rooms/1379865254000149706",
    city: "Sidi Bou Said",
    price: "150",
    originalPrice: "180",
    discountedPrice: "150",
    ratingAccuracy: 4.9,
    ratingCleanliness: 5.0,
    ratingCommunication: 4.8,
    ratingLocation: 4.95,
    ratingValue: 4.7,
    ratingGuestSatisfaction: 4.9,
    owner: null,
    reviews: null,
  },
  {
    id: "6878d68de8439306d9e49746",
    title: "Appartement Moderne Tunis Centre",
    description: "Appartement moderne au cœur de Tunis, proche de tous les sites touristiques et des transports",
    latitude: 36.8065,
    longitude: 10.1815,
    thumbnailUrl: "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149707/original/appartement-tunis.jpeg",
    externalUrl: "https://www.airbnb.com/rooms/1379865254000149707",
    city: "Tunis",
    price: "75",
    originalPrice: "90",
    discountedPrice: "75",
    ratingAccuracy: 4.6,
    ratingCleanliness: 4.7,
    ratingCommunication: 4.9,
    ratingLocation: 4.8,
    ratingValue: 4.8,
    ratingGuestSatisfaction: 4.7,
    owner: null,
    reviews: null,
  },
  {
    id: "6878d68de8439306d9e49747",
    title: "Maison Traditionnelle Médina",
    description: "Authentique maison traditionnelle dans la médina de Tunis, restaurée avec goût",
    latitude: 36.7981,
    longitude: 10.1697,
    thumbnailUrl: "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149708/original/medina-tunis.jpeg",
    externalUrl: "https://www.airbnb.com/rooms/1379865254000149708",
    city: "Tunis",
    price: "120",
    originalPrice: "140",
    discountedPrice: "120",
    ratingAccuracy: 4.8,
    ratingCleanliness: 4.6,
    ratingCommunication: 4.9,
    ratingLocation: 4.7,
    ratingValue: 4.8,
    ratingGuestSatisfaction: 4.8,
    owner: null,
    reviews: null,
  },
  {
    id: "6878d68de8439306d9e49748",
    title: "Resort Djerba Plage",
    description: "Magnifique resort en bord de plage à Djerba avec piscine privée et accès direct à la mer",
    latitude: 33.8076,
    longitude: 10.8451,
    thumbnailUrl: "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149709/original/djerba-resort.jpeg",
    externalUrl: "https://www.airbnb.com/rooms/1379865254000149709",
    city: "Djerba",
    price: "220",
    originalPrice: "250",
    discountedPrice: "220",
    ratingAccuracy: 4.9,
    ratingCleanliness: 5.0,
    ratingCommunication: 4.8,
    ratingLocation: 4.95,
    ratingValue: 4.7,
    ratingGuestSatisfaction: 4.9,
    owner: null,
    reviews: null,
  },
  {
    id: "6878d68de8439306d9e49749",
    title: "Villa Sousse Marina",
    description: "Villa moderne avec vue sur le port de plaisance de Sousse, idéale pour découvrir la perle du Sahel",
    latitude: 35.8256,
    longitude: 10.6411,
    thumbnailUrl: "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149710/original/sousse-marina.jpeg",
    externalUrl: "https://www.airbnb.com/rooms/1379865254000149710",
    city: "Sousse",
    price: "150",
    originalPrice: "170",
    discountedPrice: "150",
    ratingAccuracy: 4.7,
    ratingCleanliness: 4.8,
    ratingCommunication: 4.6,
    ratingLocation: 4.8,
    ratingValue: 4.7,
    ratingGuestSatisfaction: 4.8,
    owner: null,
    reviews: null,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const q = searchParams.get("q")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")

  console.log("API Route - Paramètres reçus:", { city, q, minPrice, maxPrice })

  try {
    // Utiliser la bonne URL de l'API backend
    const backendUrl = `${BACKEND_URL}/api/guest/guesthouses`
    console.log(`Attempting to fetch from backend: ${backendUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Pas d'authentification requise pour les endpoints guest
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      console.log(`Successfully fetched ${data.length} listings from backend`)

      // Appliquer les filtres côté serveur
      let filteredData = data

      if (city) {
        filteredData = filteredData.filter((listing: any) => listing.city?.toLowerCase().includes(city.toLowerCase()))
      }

      if (q) {
        const searchTerm = q.toLowerCase()
        filteredData = filteredData.filter(
          (listing: any) =>
            listing.title?.toLowerCase().includes(searchTerm) ||
            listing.city?.toLowerCase().includes(searchTerm) ||
            listing.description?.toLowerCase().includes(searchTerm),
        )
      }

      if (minPrice) {
        const min = Number.parseFloat(minPrice)
        filteredData = filteredData.filter((listing: any) => {
          const price = typeof listing.price === "string" ? Number.parseFloat(listing.price) : listing.price
          return price >= min
        })
      }

      if (maxPrice) {
        const max = Number.parseFloat(maxPrice)
        filteredData = filteredData.filter((listing: any) => {
          const price = typeof listing.price === "string" ? Number.parseFloat(listing.price) : listing.price
          return price <= max
        })
      }

      console.log(`Filtered to ${filteredData.length} listings`)
      return NextResponse.json(filteredData)
    } else {
      console.log(`Backend responded with status ${response.status}, using mock data`)
    }
  } catch (error) {
    console.log("Backend not available, using mock data:", error)
  }

  // Utiliser les données mock avec filtrage
  let filteredMockData = mockGuesthouses

  if (city) {
    filteredMockData = filteredMockData.filter((listing) => listing.city.toLowerCase().includes(city.toLowerCase()))
  }

  if (q) {
    const searchTerm = q.toLowerCase()
    filteredMockData = filteredMockData.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.city.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm),
    )
  }

  if (minPrice) {
    const min = Number.parseFloat(minPrice)
    filteredMockData = filteredMockData.filter((listing) => {
      const price = Number.parseFloat(listing.price)
      return price >= min
    })
  }

  if (maxPrice) {
    const max = Number.parseFloat(maxPrice)
    filteredMockData = filteredMockData.filter((listing) => {
      const price = Number.parseFloat(listing.price)
      return price <= max
    })
  }

  console.log(`Returning ${filteredMockData.length} mock listings`)
  return NextResponse.json(filteredMockData)
}
