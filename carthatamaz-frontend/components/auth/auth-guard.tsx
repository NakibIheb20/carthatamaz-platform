"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ("ADMIN" | "OWNER" | "GUEST")[]
  redirectTo?: string
}

export default function AuthGuard({ children, allowedRoles, redirectTo = "/login" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")

        if (!token || !userStr) {
          router.push(redirectTo)
          return
        }

        const user = JSON.parse(userStr)

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          // Rediriger vers la page appropriée selon le rôle
          switch (user.role) {
            case "ADMIN":
              router.push("/admin/dashboard")
              break
            case "OWNER":
              router.push("/host")
              break
            case "GUEST":
              router.push("/guest")
              break
            default:
              router.push("/login")
          }
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Erreur d'authentification:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, allowedRoles, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
