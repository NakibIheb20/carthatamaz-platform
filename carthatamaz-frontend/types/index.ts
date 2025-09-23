// Types centralisés pour l'application
export interface User {
  id: string
  fullName?: string | null
  email: string
  phonenumber?: string
  birthday?: string
  picture_url?: string
  role: "ADMIN" | "OWNER" | "GUEST"
  status?: "active" | "banned" | "inactive"
  created_at?: string
  is_active?: boolean
}

export interface Guesthouse {
  id: string
  title: string
  description: string
  city: string
  price: string
  priceLabel?: string
  latitude?: number
  longitude?: number
  thumbnail?: string
  ownerId: string
  status?: "ACTIVE" | "PENDING" | "REJECTED"
  created_at?: string
  updated_at?: string
  amenities?: string[]
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
  specialRequests?: string
  reason?: string
  createdAt: string
  updatedAt: string
  // Relations
  guesthouse?: Guesthouse
  guest?: User
  owner?: User
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  createdAt: string
  senderName?: string
  attachmentUrl?: string
  // Relations
  sender?: User
  receiver?: User
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
  status?: "approved" | "pending" | "rejected" | "reported"
  created_at: string
  // Relations
  guest?: User
  guesthouse?: Guesthouse
}

// Types pour les requêtes
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  phonenumber?: string
  birthday?: string
  role: "GUEST" | "OWNER"
}

export interface ReservationRequest {
  guesthouseId: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  specialRequests?: string
}

export interface MessageRequest {
  receiverId: string
  content: string
}

// Types pour les réponses
export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Types pour les filtres de recherche
export interface SearchFilters {
  location?: string
  q?: string
  city?: string
  priceMin?: number
  priceMax?: number
  amenities?: string[]
  checkIn?: string
  checkOut?: string
  guests?: number
}
