import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

// Mock data for single listing
const mockListing = {
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
  images: [
    "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149705/original/2a29103b-bc4d-4ece-b239-dce468fd4630.jpeg",
    "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149705/original/image2.jpeg",
    "https://a0.muscache.com/pictures/miso/Hosting-1379865254000149705/original/image3.jpeg",
  ],
  amenities: ["WiFi", "Parking", "Piscine", "Climatisation"],
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Utiliser la bonne URL de l'API backend
    const backendUrl = `${BACKEND_URL}/api/guest/guesthouses/${id}`
    console.log(`Attempting to fetch listing ${id} from backend: ${backendUrl}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

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
      console.log(`Successfully fetched listing ${id} from backend`)
      return NextResponse.json(data)
    } else {
      console.log(`Backend responded with status ${response.status} for listing ${id}, using mock data`)
    }
  } catch (error) {
    console.log(`Backend not available for listing ${id}, using mock data:`, error)
  }

  // Retourner les données mock
  console.log(`Returning mock data for listing ${id}`)
  return NextResponse.json({ ...mockListing, id })
}
