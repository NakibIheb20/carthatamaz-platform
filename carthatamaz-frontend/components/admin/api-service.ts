// Services API pour le tableau de bord administrateur

import { type Review } from "@/components/services/api-complete"

// Type User local pour export
export type User = {
  id: string;
  fullName?: string;
  email: string;
  username?: string;
  role: string;
  is_active: boolean;
  created_at?: string;
};

// Define Guesthouse type locally or import from correct module
interface Guesthouse {
  id: string
  name: string
  description: string
  location: string
  price: number
  status: string
  createdAt: string
  updatedAt: string
  // Add other properties as needed
}

// Configuration de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Fonctions utilitaires
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Fonctions pour les utilisateurs
export const UserService = {
  // Obtenir tous les utilisateurs
  async getAllUsers(page = 1, limit = 10): Promise<{ users: User[], total: number }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs")
    }

    return response.json()
  },

  // Obtenir le nombre total d'utilisateurs
  async getUsersCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/count`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du nombre d'utilisateurs")
    }

    const data = await response.json()
    return data.count
  },

  // Obtenir les utilisateurs récents
  async getRecentUsers(limit = 5): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/recent?limit=${limit}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs récents")
    }

    return response.json()
  },

  // Mettre à jour le rôle d'un utilisateur
  async updateUserRole(userId: string, role: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du rôle de l'utilisateur")
    }

    return response.json()
  },

  // Désactiver un utilisateur
  async deactivateUser(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/deactivate`, {
      method: "PUT",
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la désactivation de l'utilisateur")
    }

    return response.json()
  },

  // Activer un utilisateur
  async activateUser(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/activate`, {
      method: "PUT",
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de l'activation de l'utilisateur")
    }

    return response.json()
  }
}

// Fonctions pour les gîtes
export const GuesthouseService = {
  // Obtenir tous les gîtes
  async getAllGuesthouses(page = 1, limit = 10, status?: string): Promise<{ guesthouses: Guesthouse[], total: number }> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (status) params.append("status", status)

    const response = await fetch(`${API_BASE_URL}/api/admin/guesthouses?${params}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des gîtes")
    }

    return response.json()
  },

  // Obtenir le nombre total de gîtes
  async getGuesthousesCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/admin/guesthouses/count`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du nombre de gîtes")
    }

    const data = await response.json()
    return data.count
  },

  // Obtenir les gîtes récents
  async getRecentGuesthouses(limit = 5): Promise<Guesthouse[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/guesthouses/recent?limit=${limit}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des gîtes récents")
    }

    return response.json()
  },

  // Approuver un gîte
  async approveGuesthouse(guesthouseId: string): Promise<Guesthouse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/guesthouses/${guesthouseId}/approve`, {
      method: "PUT",
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de l'approbation du gîte")
    }

    return response.json()
  },

  // Rejeter un gîte
  async rejectGuesthouse(guesthouseId: string, reason: string): Promise<Guesthouse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/guesthouses/${guesthouseId}/reject`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    })

    if (!response.ok) {
      throw new Error("Erreur lors du rejet du gîte")
    }

    return response.json()
  },

  // Obtenir les détails d'un gîte
  async getGuesthouseDetails(guesthouseId: string): Promise<Guesthouse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/guesthouses/${guesthouseId}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des détails du gîte")
    }

    return response.json()
  }
}

// Fonctions pour les avis
export const ReviewService = {
  // Obtenir tous les avis
  async getAllReviews(page = 1, limit = 10, status?: string): Promise<{ reviews: Review[], total: number }> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (status) params.append("status", status)

    const response = await fetch(`${API_BASE_URL}/api/admin/reviews?${params}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des avis")
    }

    return response.json()
  },

  // Obtenir le nombre total d'avis
  async getReviewsCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reviews/count`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du nombre d'avis")
    }

    const data = await response.json()
    return data.count
  },

  // Obtenir les avis récents
  async getRecentReviews(limit = 5): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reviews/recent?limit=${limit}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des avis récents")
    }

    return response.json()
  },

  // Approuver un avis
  async approveReview(reviewId: string): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/approve`, {
      method: "PUT",
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de l'approbation de l'avis")
    }

    return response.json()
  },

  // Rejeter un avis
  async rejectReview(reviewId: string, reason: string): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/reject`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    })

    if (!response.ok) {
      throw new Error("Erreur lors du rejet de l'avis")
    }

    return response.json()
  }
}

// Service pour les statistiques du tableau de bord
export const DashboardService = {
  // Obtenir les statistiques générales
  async getGeneralStats(): Promise<{
    totalUsers: number
    totalGuesthouses: number
    totalReviews: number
    totalRevenue: number
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des statistiques")
    }

    return response.json()
  },

  // Obtenir les graphiques d'activité
  async getActivityCharts(): Promise<{
    usersChart: { date: string; count: number }[]
    guesthousesChart: { date: string; count: number }[]
    reviewsChart: { date: string; count: number }[]
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/charts`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des graphiques")
    }

    return response.json()
  }
}

// Service pour les revenus
export const RevenueService = {
  // Obtenir les statistiques de revenus
  async getRevenueStats(period: "day" | "week" | "month" | "year" = "month"): Promise<{
    total: number
    average: number
    growth: number
    chart: { date: string; amount: number }[]
  }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/revenue/stats?period=${period}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des statistiques de revenus")
    }

    return response.json()
  }
}

// Service pour les réservations
export const BookingService = {
  // Obtenir toutes les réservations
  async getAllBookings(page = 1, limit = 10, status?: string): Promise<{ bookings: any[], total: number }> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (status) params.append("status", status)

    const response = await fetch(`${API_BASE_URL}/api/admin/bookings?${params}`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des réservations")
    }

    return response.json()
  },

  // Mettre à jour le statut d'une réservation
  async updateBookingStatus(bookingId: string, status: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${bookingId}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du statut de la réservation")
    }

    return response.json()
  }
}
