'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import apiClient from '@/lib/api'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          // Also check if user data exists in localStorage as backup
          const userStr = localStorage.getItem('user')
          if (userStr) {
            try {
              const userData = JSON.parse(userStr)
              setUser(userData)
            } catch (parseError) {
              console.log('Error parsing stored user data:', parseError)
            }
          }
          
          // Try to get fresh user data from API
          try {
            const currentUser = await apiClient.getCurrentUser()
            setUser(currentUser)
            localStorage.setItem('user', JSON.stringify(currentUser))
          } catch (apiError: any) {
            console.log('API getCurrentUser failed:', apiError.message)
            // If the token is invalid (401), log out the user
            if (apiError.message.includes('401')) {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              setUser(null)
              // Optionally, redirect to login
              // router.push('/login');
            }
          }
        }
      } catch (error) {
        console.log('Auth check error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      
      const response: any = await apiClient.login(credentials)
      console.log('🎯 Réponse de login reçue:', response)
      
      // Adapter la réponse du backend à notre structure attendue
      let authData: { token: string; user: User };
      
      if (response.token && response.user) {
        // Structure {token, user} - parfait
        authData = response as any;
      } else if (response.token && (response.email || response.id)) {
        // Structure de votre backend Spring Boot: {token, email, role, etc.}
        authData = {
          token: response.token,
          user: {
            id: response.id || response.userId || 'temp-id',
            email: response.email || credentials.email,
            role: response.role || 'GUEST',
            fullName: response.fullName || response.name || response.email,
            phonenumber: response.phonenumber || response.phone,
            birthday: response.birthday,
            picture_url: response.picture_url || response.avatar,
            status: response.status || 'active',
            created_at: response.created_at || new Date().toISOString(),
            is_active: response.is_active !== false
          } as User
        };
      } else {
        console.error('❌ Structure de réponse non reconnue:', response);
        throw new Error('Structure de réponse invalide du serveur');
      }
      
      console.log('✅ Données d\'authentification adaptées:', authData);
      
      localStorage.setItem('token', authData.token)
      localStorage.setItem('user', JSON.stringify(authData.user))
      setUser(authData.user)
      
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue ${authData.user.fullName || authData.user.email}!`,
      })

      // Redirection selon le rôle
      switch (authData.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
        case 'OWNER':
          router.push('/host')
          break
        case 'GUEST':
          router.push('/guest')
          break
        default:
          router.push('/guest') // Par défaut, traiter comme guest
      }
    } catch (error: any) {
      console.error('💥 Erreur complète de login:', error);
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true)
      
      const response = await apiClient.register(userData)
      
      if (response.token && response.user) {
        localStorage.setItem('authToken', response.token)
        setUser(response.user)
        
        toast({
          title: 'Inscription réussie',
          description: `Bienvenue ${response.user.fullName || response.user.email}!`,
        })

        router.push('/')
      } else {
        throw new Error('Réponse d\'inscription invalide')
      }
    } catch (error: any) {
      toast({
        title: 'Erreur d\'inscription',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
    
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès',
    })
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
