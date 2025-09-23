import { toast } from '@/hooks/use-toast'
import type {
  User,
  Guesthouse,
  Reservation,
  Message,
  Review,
  LoginRequest,
  RegisterRequest,
  ReservationRequest,
  MessageRequest,
  AuthResponse,
  PaginatedResponse,
  SearchFilters,
} from '@/types'

class ApiClient {
  private baseURL = 'http://localhost:8080'
  
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()
    
    const requestConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, requestConfig)
      
      if (!response.ok) {
        // Si token expiré, rediriger vers login
        if (response.status === 401) {
          localStorage.removeItem('authToken')
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw new Error('Session expirée')
        }
        
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }))
        throw new Error(errorData.message || `Erreur ${response.status}`)
      }

      // Gérer les réponses vides
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return {} as T
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error)
      
      if (error instanceof Error) {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        })
      }
      
      throw error
    }
  }

  // AUTHENTIFICATION
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/api/auth/me')
  }

  async logout(): Promise<void> {
    return this.request<void>('/api/auth/logout', {
      method: 'POST',
    })
  }

  async forgotPassword(email: string): Promise<void> {
    return this.request<void>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.request<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
  }

  // GUESTHOUSES
  async getGuesthouses(filters?: SearchFilters): Promise<Guesthouse[]> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString()
    const endpoint = `/api/guest/guesthouses${queryString ? `?${queryString}` : ''}`
    
    return this.request<Guesthouse[]>(endpoint)
  }

  async getGuesthouseById(id: string): Promise<Guesthouse> {
    return this.request<Guesthouse>(`/api/guest/guesthouses/${id}`)
  }

  async createGuesthouse(guesthouse: Omit<Guesthouse, 'id' | 'ownerId'>): Promise<Guesthouse> {
    return this.request<Guesthouse>('/api/owner/guesthouses', {
      method: 'POST',
      body: JSON.stringify(guesthouse),
    })
  }

  async updateGuesthouse(id: string, guesthouse: Partial<Guesthouse>): Promise<Guesthouse> {
    return this.request<Guesthouse>(`/api/owner/guesthouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guesthouse),
    })
  }

  async deleteGuesthouse(id: string): Promise<void> {
    return this.request<void>(`/api/owner/guesthouses/${id}`, {
      method: 'DELETE',
    })
  }

  async getOwnerGuesthouses(): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>('/api/owner/guesthouses')
  }

  // RÉSERVATIONS
  async createReservation(reservation: ReservationRequest): Promise<Reservation> {
    return this.request<Reservation>('/api/guest/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    })
  }

  async getMyReservations(): Promise<Reservation[]> {
    return this.request<Reservation[]>('/api/guest/reservations')
  }

  async getReservationById(id: string): Promise<Reservation> {
    return this.request<Reservation>(`/api/guest/reservations/${id}`)
  }

  async cancelReservation(id: string, reason?: string): Promise<void> {
    return this.request<void>(`/api/guest/reservations/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    })
  }

  async getOwnerReservations(): Promise<Reservation[]> {
    return this.request<Reservation[]>('/api/owner/reservations')
  }

  async updateReservationStatus(id: string, status: 'CONFIRMED' | 'CANCELLED', reason?: string): Promise<void> {
    return this.request<void>(`/api/owner/reservations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    })
  }

  // MESSAGES
  async sendMessage(message: MessageRequest): Promise<Message> {
    return this.request<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    })
  }

  async getMessages(otherUserId: string): Promise<Message[]> {
    return this.request<Message[]>(`/api/messages/${otherUserId}`)
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    return this.request<void>(`/api/messages/${messageId}/read`, {
      method: 'PUT',
    })
  }

  async getConversations(): Promise<any[]> {
    return this.request<any[]>('/api/messages/conversations')
  }

  // AVIS
  async createReview(review: Omit<Review, 'id' | 'guestId'>): Promise<Review> {
    return this.request<Review>('/api/guest/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    })
  }

  async getGuesthouseReviews(guesthouseId: string): Promise<Review[]> {
    return this.request<Review[]>(`/api/guest/reviews/guesthouse/${guesthouseId}`)
  }

  async getMyReviews(): Promise<Review[]> {
    return this.request<Review[]>('/api/guest/reviews')
  }

  // PROFIL UTILISATEUR
  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async uploadAvatar(file: File): Promise<{ picture_url: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    return this.request<{ picture_url: string }>('/api/user/avatar', {
      method: 'POST',
      headers: {}, // Pas de Content-Type pour FormData
      body: formData,
    })
  }

  // ADMINISTRATION
  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users')
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/admin/users/${id}`)
  }

  async updateUserStatus(id: string, status: 'active' | 'banned' | 'inactive'): Promise<void> {
    return this.request<void>(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    })
  }

  async getAllGuesthouses(): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>('/api/admin/guesthouses')
  }

  async updateGuesthouseStatus(id: string, status: 'ACTIVE' | 'PENDING' | 'REJECTED'): Promise<void> {
    return this.request<void>(`/api/admin/guesthouses/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async getAllReservations(): Promise<Reservation[]> {
    return this.request<Reservation[]>('/api/admin/reservations')
  }

  async getAllReviews(): Promise<Review[]> {
    return this.request<Review[]>('/api/admin/reviews')
  }

  async updateReviewStatus(id: string, status: 'approved' | 'pending' | 'rejected' | 'reported'): Promise<void> {
    return this.request<void>(`/api/admin/reviews/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async deleteReview(id: string): Promise<void> {
    return this.request<void>(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    })
  }

  // STATISTIQUES ADMIN
  async getAdminStats(): Promise<{
    totalUsers: number
    totalGuesthouses: number
    totalReservations: number
    totalReviews: number
    recentActivity: any[]
  }> {
    return this.request('/api/admin/stats')
  }
}

// Instance singleton
export const apiClient = new ApiClient()

// Exports pour compatibilité avec l'ancien code
export const ApiService = {
  // Auth
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  register: (userData: RegisterRequest) => apiClient.register(userData),
  getCurrentUser: () => apiClient.getCurrentUser(),
  
  // Guesthouses
  fetchGuesthouses: (filters?: SearchFilters) => apiClient.getGuesthouses(filters),
  getGuesthouseById: (id: string) => apiClient.getGuesthouseById(id),
  createGuesthouse: (guesthouse: Omit<Guesthouse, 'id' | 'ownerId'>) => apiClient.createGuesthouse(guesthouse),
  updateGuesthouse: (id: string, guesthouse: Partial<Guesthouse>) => apiClient.updateGuesthouse(id, guesthouse),
  deleteGuesthouse: (id: string) => apiClient.deleteGuesthouse(id),
  getOwnerGuesthouses: () => apiClient.getOwnerGuesthouses(),
  
  // Reservations
  createReservation: (reservation: ReservationRequest) => apiClient.createReservation(reservation),
  fetchMyReservations: () => apiClient.getMyReservations(),
  getReservationById: (id: string) => apiClient.getReservationById(id),
  cancelReservation: (id: string, reason?: string) => apiClient.cancelReservation(id, reason),
  getOwnerReservations: () => apiClient.getOwnerReservations(),
  updateReservationStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED', reason?: string) => 
    apiClient.updateReservationStatus(id, status, reason),
  
  // Messages
  sendMessage: (message: MessageRequest) => apiClient.sendMessage(message),
  getMessages: (otherUserId: string) => apiClient.getMessages(otherUserId),
  getConversations: () => apiClient.getConversations(),
  
  // Reviews
  createReview: (review: Omit<Review, 'id' | 'guestId'>) => apiClient.createReview(review),
  getGuesthouseReviews: (guesthouseId: string) => apiClient.getGuesthouseReviews(guesthouseId),
  
  // Admin
  getUsers: () => apiClient.getAllUsers(),
  getAllGuesthouses: () => apiClient.getAllGuesthouses(),
  getAllReservations: () => apiClient.getAllReservations(),
  getAllReviews: () => apiClient.getAllReviews(),
  getAdminStats: () => apiClient.getAdminStats(),
  updateUserStatus: (id: string, status: 'active' | 'banned' | 'inactive') => apiClient.updateUserStatus(id, status),
  updateGuesthouseStatus: (id: string, status: 'ACTIVE' | 'PENDING' | 'REJECTED') => apiClient.updateGuesthouseStatus(id, status),
  updateReviewStatus: (id: string, status: 'approved' | 'pending' | 'rejected' | 'reported') => apiClient.updateReviewStatus(id, status),
}

export default apiClient
