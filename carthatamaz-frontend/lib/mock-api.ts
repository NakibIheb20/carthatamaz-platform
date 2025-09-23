import type { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types'

// Données mock pour le développement
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@carthatamaz.com',
    fullName: 'Admin CarthaTamaz',
    role: 'ADMIN',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    is_active: true,
  },
  {
    id: '2',
    email: 'owner@carthatamaz.com',
    fullName: 'Propriétaire Test',
    role: 'OWNER',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    is_active: true,
  },
  {
    id: '3',
    email: 'guest@carthatamaz.com',
    fullName: 'Invité Test',
    role: 'GUEST',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    is_active: true,
  },
]

// Simule un délai de réseau
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Export des données mock pour débogage
export { mockUsers }

export class MockApiService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔧 MockApiService.login appelé avec:', credentials)
    console.log('📧 Email recherché:', credentials.email)
    console.log('👥 Utilisateurs disponibles:', mockUsers.map(u => ({ id: u.id, email: u.email })))
    
    await delay(800)
    
    // Vérifier les identifiants (case insensitive)
    const user = mockUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase())
    console.log('🔍 Utilisateur trouvé:', user)
    
    if (!user) {
      console.error('❌ Aucun utilisateur trouvé pour:', credentials.email)
      console.log('📋 Emails disponibles:', mockUsers.map(u => u.email))
      throw new Error(`Email non trouvé: ${credentials.email}`)
    }
    
    // Pour la démo, accepter n'importe quel mot de passe pour les comptes de test
    const validPasswords = ['password', '123456', 'admin', 'test']
    if (!validPasswords.includes(credentials.password)) {
      throw new Error('Mot de passe incorrect')
    }
    
    const authResponse = {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user,
    }
    
    console.log('✅ Réponse d\'authentification:', authResponse)
    return authResponse
  }
  
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    await delay(1000)
    
    // Vérifier si l'email existe déjà
    const existingUser = mockUsers.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé')
    }
    
    const newUser: User = {
      id: `mock-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      phonenumber: userData.phonenumber,
      birthday: userData.birthday,
      status: 'active',
      created_at: new Date().toISOString(),
      is_active: true,
    }
    
    mockUsers.push(newUser)
    
    return {
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      user: newUser,
    }
  }
  
  static async getCurrentUser(): Promise<User> {
    await delay(500)
    
    // Retourner l'utilisateur admin par défaut pour les tests
    const user = mockUsers[0]
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
    
    return user
  }
  
  static async getGuesthouses() {
    await delay(800)
    
    return [
      {
        id: '1',
        title: 'Villa Sidi Bou Said',
        description: 'Magnifique villa avec vue sur la mer',
        city: 'Sidi Bou Said',
        price: '150',
        priceLabel: '150 DT/nuit',
        latitude: 36.8675,
        longitude: 10.3467,
        thumbnail: '/placeholder.jpg',
        ownerId: '2',
        status: 'ACTIVE',
        amenities: ['WiFi', 'Piscine', 'Parking'],
      },
      {
        id: '2',
        title: 'Riad Medina Tunis',
        description: 'Riad traditionnel au cœur de la médina',
        city: 'Tunis',
        price: '80',
        priceLabel: '80 DT/nuit',
        latitude: 36.8065,
        longitude: 10.1815,
        thumbnail: '/placeholder.jpg',
        ownerId: '2',
        status: 'ACTIVE',
        amenities: ['WiFi', 'Petit-déjeuner', 'Terrasse'],
      },
    ]
  }
  
  static async getAdminStats() {
    await delay(600)
    
    return {
      totalUsers: mockUsers.length,
      totalGuesthouses: 2,
      totalReservations: 5,
      totalReviews: 8,
      recentActivity: [
        {
          id: '1',
          type: 'NEW_USER',
          description: 'Nouvel utilisateur inscrit',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'NEW_RESERVATION',
          description: 'Nouvelle réservation reçue',
          timestamp: new Date().toISOString(),
        },
      ],
    }
  }
}

// Messages informatifs pour le mode mock
export const showMockModeWarning = () => {
  if (typeof window !== 'undefined') {
    console.warn(
      '🔧 MODE DÉVELOPPEMENT: Utilisation des données mockées\n' +
      'Pour utiliser le vrai backend:\n' +
      '1. Démarrez le serveur Spring Boot sur le port 8080\n' +
      '2. Supprimez NEXT_PUBLIC_MOCK_MODE=true du .env.local'
    )
  }
}
