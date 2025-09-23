import type { Listing } from "@/components/types/listing"

// Define SearchFilters type if not already imported
export interface SearchFilters {
  location?: string
  q?: string
  city?: string
  priceMin?: number
  priceMax?: number
  selectedAmenities?: string[]
  amenities?: string[]
}

// Interfaces pour les données utilisateur
export interface User {
  id: string
  fullName?: string | null
  email?: string
  phonenumber?: string
  birthday?: string
  picture_url?: string
  role: "ADMIN" | "OWNER" | "GUEST"
  status?: "active" | "banned" | "inactive"
}

// Interfaces pour les réservations
export interface Reservation {
  id: string
  guestHouseId: string
  guestHouseTitle: string
  guestHouseImage: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  hostId: string
  hostName: string
  bookingDate: string
}

// Interfaces pour les messages
export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  text: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "file"
  attachment?: {
    url: string
    name: string
    type: string
  }
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: string
  lastMessageTimestamp: Date
  unreadCount: number
  isOnline: boolean
}

// Interfaces pour les avis
export interface Review {
  id: string
  guestHouseId: string
  guestId: string
  guestName: string
  rating: number
  comment: string
  date: Date
}

const API_BASE_URL = "http://localhost:8080/api"

export class ApiService {
  static getUsers(arg0: { limit: number }): any {
    throw new Error("Method not implemented.")
  }
  // Construire headers avec token si présent
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem("token")
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  /**
   * Authentification
   */
  static async login(email: string, password: string): Promise<{ token: string; user: User } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) return null

      const data = await response.json()
      return { token: data.token, user: data.user }
    } catch (error) {
      console.error("Login API Error:", error)
      return null
    }
  }

  static async register(userData: {
    fullName: string
    email: string
    password: string
    role: "ADMIN" | "OWNER" | "GUEST"
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, message: errorData.message || "Erreur d'inscription" }
      }

      return { success: true }
    } catch (error) {
      console.error("Register API Error:", error)
      return { success: false, message: "Erreur de connexion au serveur" }
    }
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, message: errorData.message || "Erreur" }
      }

      return { success: true }
    } catch (error) {
      console.error("Forgot Password API Error:", error)
      return { success: false, message: "Erreur de connexion au serveur" }
    }
  }

  static async resetPassword(token: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, message: errorData.message || "Erreur" }
      }

      return { success: true }
    } catch (error) {
      console.error("Reset Password API Error:", error)
      return { success: false, message: "Erreur de connexion au serveur" }
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout API Error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  /**
   * Hébergements
   */
  static async fetchGuesthouses(): Promise<Listing[]> {
    try {
      console.log("API: Fetching up to 200 listings")
      const response = await fetch(`${API_BASE_URL}/guest/guesthouses?limit=200`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      if (!Array.isArray(data)) return []

      return data.slice(0, 200)
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async searchGuesthouses(filters: Partial<SearchFilters>): Promise<Listing[]> {
    try {
      const params = new URLSearchParams()

      if (filters.location) params.append("city", filters.location)
      if (filters.q) params.append("q", filters.q)
      if (filters.city) params.append("city", filters.city)

      if (filters.priceMin !== undefined) params.append("minPrice", filters.priceMin.toString())
      if (filters.priceMax !== undefined) params.append("maxPrice", filters.priceMax.toString())

      if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
        params.append("amenities", filters.selectedAmenities.join(","))
      } else if (filters.amenities && filters.amenities.length > 0) {
        params.append("amenities", filters.amenities.join(","))
      }

      params.append("limit", "200")

      const queryString = params.toString()
      const url = `${API_BASE_URL}/guest/guesthouses${queryString ? `?${queryString}` : ""}`

      console.log(`API: Searching listings with URL: ${url}`)

      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      if (!Array.isArray(data)) return []

      return data.slice(0, 200)
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async fetchGuesthouseById(id: string): Promise<Listing | null> {
    try {
      console.log(`API: Fetching listing with id ${id}`)
      const response = await fetch(`${API_BASE_URL}/guest/guesthouses/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()
      return data as Listing
    } catch (error) {
      console.error("API Error:", error)
      return null
    }
  }

  /**
   * Réservations
   */
  static async fetchMyReservations(): Promise<Reservation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/guest/reservations`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async fetchMyGuesthousesReservations(guesthouseId: string): Promise<Reservation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/guesthouses/${guesthouseId}/reservations`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async createReservation(reservationData: {
    guestHouseId: string
    checkIn: string
    checkOut: string
    guests: number
  }): Promise<Reservation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/guest/reservations`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return null
    }
  }

  static async cancelReservation(reservationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/guest/reservations/${reservationId}/cancel`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  static async updateReservationStatus(reservationId: string, status: "CONFIRMED" | "REJECTED"): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/reservations/${reservationId}/status`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      })

      return response.ok
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  /**
   * Messagerie
   */
  static async fetchConversations(): Promise<Conversation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async fetchMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/with/${conversationId}`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async sendMessage(conversationId: string, text: string, type: "text" | "image" | "file" = "text", attachment?: { url: string; name: string; type: string }): Promise<boolean> {
    try {
      const payload: any = {
        conversationId,
        text,
        type,
      }

      if (attachment) {
        payload.attachment = attachment
      }

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      })

      return response.ok
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  static async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      return response.ok
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  /**
   * Gestion des utilisateurs (Admin)
   */
  static async fetchAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  static async updateUserStatus(userId: string, status: "active" | "banned" | "inactive"): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      })

      return response.ok
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  /**
   * Gestion des avis (Admin)
   */
  static async fetchAllReviews(): Promise<Review[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Recommandations
   */
  static async getRecommendations(title: string): Promise<Listing[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      return await response.json()
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }
}

// Export pour compatibilité
export const api = ApiService
export const apiService = ApiService