// Configuration environnement
export const config = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  FRONTEND_URL: "http://localhost:3000",
  ENABLE_MOCK_MODE: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Configuration des timeouts
  API_TIMEOUT: 10000, // 10 secondes
  API_RETRIES: 3,
}

// Types d'erreur API
export interface ApiError {
  status: number
  message: string
  details?: any
}

// Configuration React Query
export const queryConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    }
  }
}
