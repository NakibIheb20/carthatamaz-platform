// Client API simple pour Spring Boot backend
import { Listing } from '@/components/types/listing';
import { 
  User, 
  Guesthouse, 
  Reservation, 
  Message, 
  Review,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ReservationRequest,
  MessageRequest
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    // Debug logging
    console.log('🚀 API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: options.body ? JSON.parse(options.body as string) : null
    });

    const response = await fetch(url, config);
    
    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      let errorText = '';
      let errorData = null;
      
      try {
        errorText = await response.text();
        console.error('❌ Error Response Body:', errorText);
        
        // Essayer de parser comme JSON pour plus d'informations
        if (errorText) {
          try {
            errorData = JSON.parse(errorText);
            console.error('❌ Parsed Error Data:', errorData);
          } catch (e) {
            // Ce n'est pas du JSON, c'est normal
          }
        }
      } catch (e) {
        console.error('❌ Could not read error response');
      }
      
      // Message d'erreur détaillé selon le status
      let detailedMessage = ''
      switch (response.status) {
        case 401:
          detailedMessage = `Erreur d'authentification (401): ${errorText || 'Credentials incorrects ou token invalide'}`
          // Auto-logout on 401
          if (typeof window !== "undefined") {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
          break
        case 404:
          detailedMessage = `Endpoint non trouvé (404): ${url}`
          break
        case 403:
          detailedMessage = `Accès interdit (403): ${errorText || 'Permissions insuffisantes'}`
          break
        case 400:
          detailedMessage = `Requête invalide (400): ${errorText || 'Données de requête incorrectes'}`
          break
        case 500:
          detailedMessage = `Erreur serveur (500): ${errorText || 'Erreur interne du serveur'}`
          break
        default:
          detailedMessage = `HTTP ${response.status}: ${errorText || response.statusText}`
      }
      
      throw new Error(detailedMessage)
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ Success Response Data:', data);
      return data;
    }
    
    return {} as T;
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Use the correct endpoint and structure based on backend implementation
      return await this.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      return await this.request<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async logout(): Promise<void> {
    return this.request<void>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string): Promise<void> {
    return this.request<void>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    return this.request<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  }

  async getCurrentUser(): Promise<User> {
    // This endpoint might need to be implemented in the backend
    return this.request<User>('/api/auth/me').catch(err => {
      console.error('Error fetching current user:', err);
      return this.fallbackToMockData<User>('currentUser');
    });
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users');
  }

  async getUserById(userId: string): Promise<User> {
    return this.request<User>(`/api/admin/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request<void>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }
  
  // Helper method for fallback data when endpoints don't exist yet
  private fallbackToMockData<T>(type: string, id?: string): T {
    console.warn(`Using fallback mock data for ${type}${id ? ` with ID ${id}` : ''}`);
    // This would ideally come from mock-api.ts
    return {} as T;
  }

  // Guesthouses
  async getGuesthouses(): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>('/api/guest/guesthouses');
  }

  async getGuesthouseById(id: string): Promise<Guesthouse> {
    return this.request<Guesthouse>(`/api/guest/guesthouses/${id}`);
  }

  async createGuesthouse(data: Partial<Guesthouse>): Promise<Guesthouse> {
    return this.request<Guesthouse>('/api/owner/guesthouses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGuesthouse(id: string, data: Partial<Guesthouse>): Promise<Guesthouse> {
    return this.request<Guesthouse>(`/api/owner/guesthouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGuesthouse(id: string): Promise<void> {
    return this.request<void>(`/api/owner/guesthouses/${id}`, {
      method: 'DELETE',
    });
  }

  // Chatbot
  async getChatbotRecommendations(query: string): Promise<Listing[]> {
    return this.request<Listing[]>('/api/chatbot/recommend', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return this.request<Reservation[]>('/api/guest/reservations');
  }

  async getReservationById(id: string): Promise<Reservation> {
    return this.request<Reservation>(`/api/guest/reservations/${id}`);
  }

  async createReservation(data: ReservationRequest): Promise<Reservation> {
    return this.request<Reservation>('/api/guest/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReservation(id: string, data: Partial<Reservation>): Promise<Reservation> {
    return this.request<Reservation>(`/api/guest/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelReservation(id: string, reason?: string): Promise<void> {
    return this.request<void>(`/api/guest/reservations/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason: reason || "Canceled by guest" }),
    });
  }

  async getUserReservations(): Promise<Reservation[]> {
    return this.request<Reservation[]>(`/api/guest/reservations`);
  }

  async getOwnerReservations(): Promise<Reservation[]> {
    return this.request<Reservation[]>(`/api/owner/reservations`);
  }
  
  async getGuesthouseReservations(guesthouseId: string): Promise<Reservation[]> {
    return this.request<Reservation[]>(`/api/owner/guesthouses/${guesthouseId}/reservations`);
  }
  
  async confirmReservation(id: string): Promise<Reservation> {
    return this.request<Reservation>(`/api/owner/reservations/${id}/confirm`, {
      method: 'PUT',
    });
  }
  
  async rejectReservation(id: string, reason?: string): Promise<Reservation> {
    return this.request<Reservation>(`/api/owner/reservations/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason: reason || "Rejected by owner" }),
    });
  }

  // Messages
  async getMessages(): Promise<Message[]> {
    return this.request<Message[]>('/api/messages');
  }

  async getMessageById(id: string): Promise<Message> {
    return this.request<Message>(`/api/messages/${id}`);
  }

  async createMessage(data: MessageRequest): Promise<Message> {
    return this.request<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(id: string): Promise<void> {
    return this.request<void>(`/api/messages/${id}`, {
      method: 'DELETE',
    });
  }

  async markMessageAsRead(id: string): Promise<Message> {
    return this.request<Message>(`/api/messages/${id}/read`, {
      method: 'PUT',
    });
  }

  async getUserMessages(): Promise<Message[]> {
    return this.request<Message[]>('/api/messages');
  }

  async getSentMessages(): Promise<Message[]> {
    return this.request<Message[]>('/api/messages/sent');
  }

  async getReceivedMessages(): Promise<Message[]> {
    return this.request<Message[]>('/api/messages/received');
  }

  async getUnreadMessages(): Promise<Message[]> {
    return this.request<Message[]>('/api/messages/unread');
  }

  async getUnreadMessageCount(): Promise<{ unreadCount: number }> {
    return this.request<{ unreadCount: number }>('/api/messages/unread/count');
  }

  async getUserConversations(): Promise<Conversation[]> {
    return this.request<Conversation[]>('/api/messages/conversations');
  }

  async getConversationWithUser(otherUserId: string): Promise<Conversation> {
    return this.request<Conversation>(`/api/messages/conversations/${otherUserId}`);
  }

  async getMessagesWithUser(otherUserId: string): Promise<Message[]> {
    return this.request<Message[]>(`/api/messages/with/${otherUserId}`);
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    return this.request<void>(`/api/messages/conversations/${conversationId}/read`, {
      method: 'PUT',
    });
  }

  async sendMessageToOwner(ownerId: string, data: MessageRequest): Promise<Message> {
    return this.request<Message>(`/api/guest/messages/to-owner/${ownerId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendMessageToGuest(guestId: string, data: MessageRequest): Promise<Message> {
    return this.request<Message>(`/api/owner/messages/to-guest/${guestId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    return this.request<Review[]>('/api/admin/reviews');
  }

  // Note: The following methods may need to be implemented in the backend
  // They are kept here for compatibility with existing frontend code
  // but will likely return errors until backend endpoints are created

  async getReviewById(id: string): Promise<Review> {
    // Fallback to mock data if backend endpoint doesn't exist
    console.warn('Warning: Using getReviewById but endpoint may not exist in backend');
    return this.request<Review>(`/api/admin/reviews/${id}`).catch(err => {
      console.error('Error fetching review:', err);
      return this.fallbackToMockData<Review>('review', id);
    });
  }

  async createReview(data: Partial<Review>): Promise<Review> {
    console.warn('Warning: Using createReview but endpoint may not exist in backend');
    return this.request<Review>('/api/guest/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(err => {
      console.error('Error creating review:', err);
      return this.fallbackToMockData<Review>('review');
    });
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review> {
    console.warn('Warning: Using updateReview but endpoint may not exist in backend');
    return this.request<Review>(`/api/guest/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).catch(err => {
      console.error('Error updating review:', err);
      return this.fallbackToMockData<Review>('review', id);
    });
  }

  async deleteReview(id: string): Promise<void> {
    console.warn('Warning: Using deleteReview but endpoint may not exist in backend');
    return this.request<void>(`/api/guest/reviews/${id}`, {
      method: 'DELETE',
    }).catch(err => {
      console.error('Error deleting review:', err);
      return;
    });
  }

  async getGuesthouseReviews(guesthouseId: string): Promise<Review[]> {
    console.warn('Warning: Using getGuesthouseReviews but endpoint may not exist in backend');
    return this.request<Review[]>(`/api/guest/guesthouses/${guesthouseId}/reviews`).catch(err => {
      console.error('Error fetching guesthouse reviews:', err);
      return this.fallbackToMockData<Review[]>('reviews');
    });
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    console.warn('Warning: Using getUserReviews but endpoint may not exist in backend');
    return this.request<Review[]>(`/api/guest/users/${userId}/reviews`).catch(err => {
      console.error('Error fetching user reviews:', err);
      return this.fallbackToMockData<Review[]>('reviews');
    });
  }

  // Admin
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalGuesthouses: number;
    totalReservations: number;
    totalRevenue: number;
  }> {
    return this.request('/api/admin/stats');
  }

  async getAdminReports(): Promise<any[]> {
    return this.request('/api/admin/reports');
  }

  // Favorites
  async getFavorites(): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>('/api/favorites');
  }

  async addFavorite(guesthouseId: string): Promise<void> {
    return this.request<void>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ guesthouseId }),
    });
  }

  async removeFavorite(guesthouseId: string): Promise<void> {
    return this.request<void>(`/api/favorites/${guesthouseId}`, {
      method: 'DELETE',
    });
  }

  async checkIsFavorite(guesthouseId: string): Promise<boolean> {
    return this.request<boolean>(`/api/favorites/check/${guesthouseId}`);
  }

  // Recommendations
  async getRecommendations(): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>('/api/recommendations');
  }

  async getPersonalizedRecommendations(): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>('/api/recommendations/personalized');
  }

  async getLocationBasedRecommendations(latitude: number, longitude: number): Promise<Guesthouse[]> {
    return this.request<Guesthouse[]>(`/api/recommendations/location?lat=${latitude}&lng=${longitude}`);
  }

  // Enhanced Messaging
  async getConversations(): Promise<any[]> {
    return this.request<any[]>('/api/conversations');
  }

  async getConversation(conversationId: string): Promise<any> {
    return this.request<any>(`/api/conversations/${conversationId}`);
  }

  async sendMessage(messageData: MessageRequest): Promise<Message> {
    return this.request<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async sendMessageWithAttachment(messageData: MessageRequest, file?: File): Promise<Message> {
    if (!file) {
      return this.sendMessage(messageData);
    }

    const formData = new FormData();
    formData.append('message', JSON.stringify(messageData));
    formData.append('file', file);

    const url = `${this.baseURL}/api/messages/with-attachment`;
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };
