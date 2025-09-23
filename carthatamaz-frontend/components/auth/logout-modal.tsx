"use client"

import { useState } from "react"
import { LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export default function LogoutModal({ isOpen, onClose, userName }: LogoutModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const token = localStorage.getItem("token")
      if (token) {
        const response = await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          // Si tu n'utilises pas les cookies pour auth, tu peux retirer cette ligne :
          // credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.statusText}`)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      // Optionnel : afficher un message à l'utilisateur ici
    } finally {
      // Nettoyage localStorage et redirection même en cas d'erreur
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      router.push("/login")
      setIsLoggingOut(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">Confirmer la déconnexion</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {userName ? `${userName}, êtes` : "Êtes"}-vous sûr de vouloir vous déconnecter ?
          </p>
          <p className="text-sm text-gray-500">Vous devrez vous reconnecter pour accéder à votre compte.</p>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoggingOut} className="flex-1 bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleLogout} disabled={isLoggingOut} className="flex-1 bg-red-600 hover:bg-red-700">
              {isLoggingOut ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Déconnexion...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
