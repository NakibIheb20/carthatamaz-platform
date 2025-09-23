"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Clock,
  User,
  Home,
  Calendar,
  MessageSquare
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  category: "user" | "listing" | "booking" | "review" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionRequired: boolean
  data?: any
}

interface NotificationCenterProps {
  onNotificationAction?: (notification: Notification, action: string) => void
}

export default function NotificationCenter({ onNotificationAction }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // Simulation de notifications en temps réel
    const generateNotification = (): Notification => {
      const types: Array<"info" | "warning" | "success" | "error"> = ["info", "warning", "success", "error"]
      const categories: Array<"user" | "listing" | "booking" | "review" | "system"> = ["user", "listing", "booking", "review", "system"]
      
      const type = types[Math.floor(Math.random() * types.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      
      const messages = {
        user: [
          "Nouvel utilisateur inscrit",
          "Utilisateur suspendu pour violation",
          "Demande de vérification d'identité",
          "Profil utilisateur mis à jour"
        ],
        listing: [
          "Nouveau hébergement soumis",
          "Hébergement approuvé",
          "Hébergement signalé",
          "Photos d'hébergement mises à jour"
        ],
        booking: [
          "Nouvelle réservation",
          "Réservation annulée",
          "Paiement confirmé",
          "Demande de remboursement"
        ],
        review: [
          "Nouvel avis publié",
          "Avis signalé comme inapproprié",
          "Réponse du propriétaire",
          "Avis modéré"
        ],
        system: [
          "Maintenance programmée",
          "Mise à jour système",
          "Sauvegarde terminée",
          "Alerte sécurité"
        ]
      }

      const categoryMessages = messages[category]
      const message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        category,
        title: message,
        message: `${message} - ${new Date().toLocaleTimeString('fr-FR')}`,
        timestamp: new Date(),
        read: Math.random() > 0.7,
        actionRequired: Math.random() > 0.6,
        data: { userId: "user123", listingId: "listing456" }
      }
    }

    // Générer des notifications initiales
    const initialNotifications = Array.from({ length: 8 }, generateNotification)
    setNotifications(initialNotifications)

    // Ajouter de nouvelles notifications périodiquement
    const interval = setInterval(() => {
      const newNotification = generateNotification()
      setNotifications(prev => [newNotification, ...prev.slice(0, 19)]) // Garder max 20 notifications
    }, 10000) // Nouvelle notification toutes les 10 secondes

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case "user": return <User className="h-4 w-4" />
      case "listing": return <Home className="h-4 w-4" />
      case "booking": return <Calendar className="h-4 w-4" />
      case "review": return <MessageSquare className="h-4 w-4" />
      case "system": return <Bell className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600 bg-green-50 border-green-200"
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "error": return "text-red-600 bg-red-50 border-red-200"
      default: return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4" />
      case "warning": return <AlertTriangle className="h-4 w-4" />
      case "error": return <X className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const handleAction = (notification: Notification, action: string) => {
    onNotificationAction?.(notification, action)
    if (action === "dismiss") {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    if (filter === "action") return notif.actionRequired
    return notif.category === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Centre de Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            >
              Tout marquer lu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Toutes ({notifications.length})
          </Button>
          <Button
            size="sm"
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            Non lues ({unreadCount})
          </Button>
          <Button
            size="sm"
            variant={filter === "action" ? "default" : "outline"}
            onClick={() => setFilter("action")}
          >
            Action requise ({actionRequiredCount})
          </Button>
          <Button
            size="sm"
            variant={filter === "user" ? "default" : "outline"}
            onClick={() => setFilter("user")}
          >
            Utilisateurs
          </Button>
          <Button
            size="sm"
            variant={filter === "listing" ? "default" : "outline"}
            onClick={() => setFilter("listing")}
          >
            Hébergements
          </Button>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune notification</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read ? "bg-gray-50" : "bg-white shadow-sm"
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp.toLocaleTimeString('fr-FR')}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Action requise
                          </Badge>
                        )}
                        
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 px-2 text-xs"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {notification.actionRequired && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction(notification, "view")}
                              className="h-6 px-2 text-xs"
                            >
                              Voir
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(notification, "dismiss")}
                            className="h-6 px-2 text-xs"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}