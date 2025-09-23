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

// Types pour les nouvelles APIs
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

export interface Reservation {
  id: string
  guesthouseId: string
  guestId: string
  ownerId: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  totalPrice: number
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  createdAt: string
  updatedAt: string
  guesthouse?: {
    title: string
    city: string
    thumbnailUrl: string
  }
  guest?: {
    fullName: string
    email: string
  }
  owner?: {
    fullName: string
    email: string
  }
}

export interface ReservationRequest {
  guesthouseId: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  totalPrice: number
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  sender?: {
    fullName: string
    picture_url?: string
  }
  receiver?: {
    fullName: string
    picture_url?: string
  }
}

export interface MessageRequest {
  receiverId: string
  content: string
}

export interface Conversation {
  id: string
  otherUserId: string
  otherUserName: string
  otherUserAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

export interface Review {
  id: string
  guesthouseId: string
  guestId: string
  rating: number
  comment: string
  createdAt: string
  guest?: {
    fullName: string
    picture_url?: string
  }
  guesthouse?: {
    title: string
  }
}

export interface SignupRequest {
  fullName: string
  email: string
  password: string
  phonenumber?: string
  birthday?: string
  role?: "GUEST" | "OWNER"
}

export interface AuthResponse {
  token: string
  email: string
  role: string
  fullName?: string
}

const API_BASE_URL = "http://localhost:8080/api"

export class ApiService {
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

  // ==================== HÉBERGEMENTS ====================
  
  /**
   * Données de démonstration en cas d'échec de l'API
   */
  static getDemoListings(): Listing[] {
    return [
      {
        id: 1,
        title: "Villa Moderne avec Piscine - Hammamet",
        city: "Hammamet",
        price: 120,
        description: "Magnifique villa moderne avec piscine privée, située dans un quartier résidentiel calme de Hammamet. Cette propriété offre tout le confort pour des vacances parfaites.",
        maxGuests: 6,
        amenities: ["Wi-Fi gratuit", "Piscine privée", "Parking gratuit", "Climatisation", "Cuisine équipée"],
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
        title: "Appartement Vue Mer - Sousse",
        city: "Sousse",
        price: 80,
        description: "Appartement confortable avec vue imprenable sur la mer Méditerranée. Idéalement situé près du centre-ville et des attractions touristiques.",
        maxGuests: 4,
        amenities: ["Wi-Fi gratuit", "Vue mer", "Climatisation", "Balcon"],
        hostName: "Fatma Hamdi",
        hostAvatar: "/placeholder-user.jpg",
        images: ["/placeholder.jpg"],
        reviews: [],
        rating: 4.5,
        latitude: 35.8,
        longitude: 10.6,
        thumbnailUrl: "/placeholder.jpg",
        externalUrl: "",
        ratingAccuracy: 4.5,
        ratingCleanliness: 4.6,
        ratingCommunication: 4.4,
        ratingLocation: 4.7,
        ratingValue: 4.3,
        ratingGuestSatisfaction: 4.5,
        owner: null,
        instantBook: true,
        availableDates: []
      },
      {
        id: 3,
        title: "Maison Traditionnelle - Sidi Bou Said",
        city: "Sidi Bou Said",
        price: 200,
        description: "Charmante maison traditionnelle tunisienne dans le célèbre village de Sidi Bou Said. Décoration authentique et terrasse avec vue panoramique.",
        maxGuests: 8,
        amenities: ["Wi-Fi gratuit", "Terrasse", "Vue panoramique", "Parking", "Cuisine traditionnelle"],
        hostName: "Mohamed Trabelsi",
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
        ratingLocation: 5.0,
        ratingValue: 4.7,
        ratingGuestSatisfaction: 4.9,
        owner: null,
        instantBook: true,
        availableDates: []
      }
    ]
  }
  
  /**
   * Récupère jusqu'à 200 hébergements
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
        console.log("API: Using fallback demo data due to authentication error")
        return this.getDemoListings()
      }

      const data = await response.json()
      if (!Array.isArray(data)) return this.getDemoListings()

      // En cas où backend ne gère pas limit, on slice côté client
      return data.slice(0, 200)
    } catch (error) {
      console.error("API Error:", error)
      console.log("API: Using fallback demo data due to network error")
      return this.getDemoListings()
    }
  }

  /**
   * Recherche avec filtres, retourne max 200 résultats
   */
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

      // Ajout param limit=200 pour limiter les résultats
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

      // Encore une fois slice côté client au cas où backend ignore limit
      return data.slice(0, 200)
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Récupère un hébergement par son ID
   */
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
        console.log("API: Using fallback demo data for listing details")
        // Retourner des données de démonstration basées sur l'ID
        const demoListings = this.getDemoListings()
        const numericId = parseInt(id)
        return demoListings.find(listing => listing.id === numericId) || demoListings[0]
      }

      const data = await response.json()
      return data as Listing
    } catch (error) {
      console.error("API Error:", error)
      console.log("API: Using fallback demo data due to network error")
      // Retourner des données de démonstration basées sur l'ID
      const demoListings = this.getDemoListings()
      const numericId = parseInt(id)
      return demoListings.find(listing => listing.id === numericId) || demoListings[0]
    }
  }

  // ==================== AUTHENTIFICATION ====================

  /**
   * Inscription d'un nouvel utilisateur
   */
  static async signup(request: SignupRequest): Promise<AuthResponse | null> {
    try {
      console.log("API: User signup")
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'inscription")
      }

      const data = await response.json()
      return data as AuthResponse
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Connexion utilisateur
   */
  static async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      console.log("API: User login")
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Identifiants incorrects")
      }

      const data = await response.json()
      return data as AuthResponse
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Déconnexion utilisateur
   */
  static async logout(): Promise<void> {
    try {
      console.log("API: User logout")
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.warn("Logout API call failed, but continuing with local cleanup")
      }
    } catch (error) {
      console.warn("Logout API error:", error)
    } finally {
      // Nettoyage local même si l'API échoue
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  /**
   * Mot de passe oublié
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      console.log("API: Forgot password")
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'envoi de l'email")
      }
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Réinitialisation du mot de passe
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      console.log("API: Reset password")
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la réinitialisation")
      }
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // ==================== RÉSERVATIONS ====================

  /**
   * Créer une nouvelle réservation
   */
  static async createReservation(request: ReservationRequest): Promise<Reservation | null> {
    try {
      console.log("API: Creating reservation")
      const response = await fetch(`${API_BASE_URL}/guest/reservations`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la réservation")
      }

      const data = await response.json()
      return data as Reservation
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Récupérer les réservations de l'utilisateur connecté
   */
  static async getMyReservations(): Promise<Reservation[]> {
    try {
      console.log("API: Fetching user reservations")
      const response = await fetch(`${API_BASE_URL}/guest/reservations`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Récupérer une réservation par ID
   */
  static async getReservationById(id: string): Promise<Reservation | null> {
    try {
      console.log(`API: Fetching reservation ${id}`)
      const response = await fetch(`${API_BASE_URL}/guest/reservations/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()
      return data as Reservation
    } catch (error) {
      console.error("API Error:", error)
      return null
    }
  }

  /**
   * Annuler une réservation
   */
  static async cancelReservation(id: string): Promise<boolean> {
    try {
      console.log(`API: Cancelling reservation ${id}`)
      const response = await fetch(`${API_BASE_URL}/guest/reservations/${id}/cancel`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'annulation")
      }

      return true
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Récupérer les réservations pour un propriétaire
   */
  static async getOwnerReservations(): Promise<Reservation[]> {
    try {
      console.log("API: Fetching owner reservations")
      const response = await fetch(`${API_BASE_URL}/owner/reservations`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Confirmer une réservation (propriétaire)
   */
  static async confirmReservation(id: string): Promise<boolean> {
    try {
      console.log(`API: Confirming reservation ${id}`)
      const response = await fetch(`${API_BASE_URL}/owner/reservations/${id}/confirm`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la confirmation")
      }

      return true
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Rejeter une réservation (propriétaire)
   */
  static async rejectReservation(id: string): Promise<boolean> {
    try {
      console.log(`API: Rejecting reservation ${id}`)
      const response = await fetch(`${API_BASE_URL}/owner/reservations/${id}/reject`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors du rejet")
      }

      return true
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Vérifier la disponibilité d'un hébergement
   */
  static async checkAvailability(guesthouseId: string, checkIn: string, checkOut: string): Promise<boolean> {
    try {
      console.log(`API: Checking availability for guesthouse ${guesthouseId}`)
      const params = new URLSearchParams({
        checkIn,
        checkOut,
      })
      
      const response = await fetch(`${API_BASE_URL}/guest/guesthouses/${guesthouseId}/availability?${params}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return false
      }

      const data = await response.json()
      return data.available === true
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  /**
   * Calculer le prix pour une période
   */
  static async calculatePrice(guesthouseId: string, checkIn: string, checkOut: string, guests: number): Promise<number> {
    try {
      console.log(`API: Calculating price for guesthouse ${guesthouseId}`)
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        guests: guests.toString(),
      })
      
      const response = await fetch(`${API_BASE_URL}/guest/guesthouses/${guesthouseId}/price?${params}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return 0
      }

      const data = await response.json()
      return data.totalPrice || 0
    } catch (error) {
      console.error("API Error:", error)
      return 0
    }
  }

  // ==================== MESSAGERIE ====================

  /**
   * Récupérer toutes les conversations
   */
  static async getConversations(): Promise<Conversation[]> {
    try {
      console.log("API: Fetching conversations")
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Récupérer les messages avec un utilisateur spécifique
   */
  static async getMessagesWithUser(otherUserId: string): Promise<Message[]> {
    try {
      console.log(`API: Fetching messages with user ${otherUserId}`)
      const response = await fetch(`${API_BASE_URL}/messages/with/${otherUserId}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Envoyer un message
   */
  static async sendMessage(request: MessageRequest): Promise<Message | null> {
    try {
      console.log("API: Sending message")
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'envoi du message")
      }

      const data = await response.json()
      return data as Message
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Marquer un message comme lu
   */
  static async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      console.log(`API: Marking message ${messageId} as read`)
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return false
      }

      return true
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  /**
   * Marquer une conversation comme lue
   */
  static async markConversationAsRead(conversationId: string): Promise<boolean> {
    try {
      console.log(`API: Marking conversation ${conversationId} as read`)
      const response = await fetch(`${API_BASE_URL}/messages/conversations/${conversationId}/read`, {
        method: "PUT",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return false
      }

      return true
    } catch (error) {
      console.error("API Error:", error)
      return false
    }
  }

  /**
   * Récupérer le nombre de messages non lus
   */
  static async getUnreadMessageCount(): Promise<number> {
    try {
      console.log("API: Fetching unread message count")
      const response = await fetch(`${API_BASE_URL}/messages/unread/count`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return 0
      }

      const data = await response.json()
      return data.count || 0
    } catch (error) {
      console.error("API Error:", error)
      return 0
    }
  }

  /**
   * Envoyer un message à un propriétaire (guest)
   */
  static async sendMessageToOwner(ownerId: string, content: string): Promise<Message | null> {
    try {
      console.log(`API: Sending message to owner ${ownerId}`)
      const response = await fetch(`${API_BASE_URL}/guest/messages/to-owner/${ownerId}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'envoi du message")
      }

      const data = await response.json()
      return data as Message
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Envoyer un message à un client (owner)
   */
  static async sendMessageToGuest(guestId: string, content: string): Promise<Message | null> {
    try {
      console.log(`API: Sending message to guest ${guestId}`)
      const response = await fetch(`${API_BASE_URL}/owner/messages/to-guest/${guestId}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de l'envoi du message")
      }

      const data = await response.json()
      return data as Message
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // ==================== ADMINISTRATION ====================

  /**
   * Récupérer tous les utilisateurs (admin)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      console.log("API: Fetching all users (admin)")
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Récupérer un utilisateur par ID (admin)
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      console.log(`API: Fetching user ${id} (admin)`)
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()
      return data as User
    } catch (error) {
      console.error("API Error:", error)
      return null
    }
  }

  /**
   * Créer un utilisateur (admin)
   */
  static async createUser(user: Partial<User>): Promise<User | null> {
    try {
      console.log("API: Creating user (admin)")
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la création de l'utilisateur")
      }

      const data = await response.json()
      return data as User
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Modifier un utilisateur (admin)
   */
  static async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    try {
      console.log(`API: Updating user ${id} (admin)`)
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la modification de l'utilisateur")
      }

      const data = await response.json()
      return data as User
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Supprimer un utilisateur (admin)
   */
  static async deleteUser(id: string): Promise<boolean> {
    try {
      console.log(`API: Deleting user ${id} (admin)`)
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erreur lors de la suppression de l'utilisateur")
      }

      return true
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /**
   * Récupérer tous les avis (admin)
   */
  static async getAllReviews(): Promise<Review[]> {
    try {
      console.log("API: Fetching all reviews (admin)")
      const response = await fetch(`${API_BASE_URL}/admin/reviews`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Récupérer toutes les réservations (admin)
   */
  static async getAllReservations(): Promise<Reservation[]> {
    try {
      console.log("API: Fetching all reservations (admin)")
      const response = await fetch(`${API_BASE_URL}/admin/reservations`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  /**
   * Récupérer les réservations par statut (admin)
   */
  static async getReservationsByStatus(status: string): Promise<Reservation[]> {
    try {
      console.log(`API: Fetching reservations with status ${status} (admin)`)
      const response = await fetch(`${API_BASE_URL}/admin/reservations/status/${status}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }

  // ==================== RECOMMANDATIONS ====================

  /**
   * Obtenir des recommandations basées sur un titre
   */
  static async getRecommendations(title: string): Promise<any[]> {
    try {
      console.log("API: Fetching recommendations")
      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  }
}

// Export pour compatibilité
export const api = ApiService
export const apiService = ApiService
