'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'ADMIN' | 'OWNER' | 'GUEST'>
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Si pas authentifié, rediriger vers la page de connexion
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // Si des rôles sont spécifiés et l'utilisateur n'a pas le bon rôle
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Rediriger selon le rôle de l'utilisateur
        switch (user.role) {
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
            router.push('/guest')
        }
        return
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo])

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Ne pas afficher le contenu si pas authentifié ou mauvais rôle
  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

// Composant pour protéger les routes admin
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      {children}
    </ProtectedRoute>
  )
}

// Composant pour protéger les routes propriétaire
export const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['OWNER']}>
      {children}
    </ProtectedRoute>
  )
}

// Composant pour les routes qui nécessitent juste d'être connecté
export const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
