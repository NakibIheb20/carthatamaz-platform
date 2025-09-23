"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  UserPlus, 
  Home, 
  MessageSquare, 
  Settings, 
  Download,
  Upload,
  Mail,
  Bell,
  Shield,
  BarChart3,
  FileText,
  Calendar,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface QuickActionsProps {
  onActionClick?: (action: string) => void
  pendingCounts?: {
    users: number
    listings: number
    reviews: number
    bookings: number
  }
}

export default function QuickActions({ onActionClick, pendingCounts }: QuickActionsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`)
    onActionClick?.(action)
  }

  const quickActions = [
    {
      id: "add-user",
      title: "Ajouter Utilisateur",
      description: "Créer un nouveau compte utilisateur",
      icon: <UserPlus className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      badge: null
    },
    {
      id: "approve-listings",
      title: "Approuver Hébergements",
      description: "Valider les nouveaux hébergements",
      icon: <Home className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600",
      badge: pendingCounts?.listings || 0
    },
    {
      id: "moderate-reviews",
      title: "Modérer Avis",
      description: "Examiner les avis en attente",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-orange-500 hover:bg-orange-600",
      badge: pendingCounts?.reviews || 0
    },
    {
      id: "manage-bookings",
      title: "Gérer Réservations",
      description: "Traiter les réservations",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-purple-500 hover:bg-purple-600",
      badge: pendingCounts?.bookings || 0
    },
    {
      id: "export-data",
      title: "Exporter Données",
      description: "Télécharger rapports et statistiques",
      icon: <Download className="h-5 w-5" />,
      color: "bg-indigo-500 hover:bg-indigo-600",
      badge: null
    },
    {
      id: "send-notification",
      title: "Envoyer Notification",
      description: "Diffuser un message aux utilisateurs",
      icon: <Bell className="h-5 w-5" />,
      color: "bg-yellow-500 hover:bg-yellow-600",
      badge: null
    }
  ]

  const systemActions = [
    {
      id: "system-settings",
      title: "Paramètres Système",
      icon: <Settings className="h-4 w-4" />,
      description: "Configuration générale"
    },
    {
      id: "security-audit",
      title: "Audit Sécurité",
      icon: <Shield className="h-4 w-4" />,
      description: "Vérifier la sécurité"
    },
    {
      id: "analytics-report",
      title: "Rapport Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Générer rapport détaillé"
    },
    {
      id: "backup-data",
      title: "Sauvegarde",
      icon: <Upload className="h-4 w-4" />,
      description: "Sauvegarder les données"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Recherche Rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher utilisateur, hébergement, réservation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => handleAction("search")}>
              Rechercher
            </Button>
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600">
              Recherche pour: "{searchQuery}"
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Principales */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="relative group cursor-pointer"
                onClick={() => handleAction(action.id)}
              >
                <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg text-white ${action.color} transition-colors`}>
                      {action.icon}
                    </div>
                    {action.badge !== null && action.badge > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions Système */}
      <Card>
        <CardHeader>
          <CardTitle>Administration Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systemActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleAction(action.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau hébergement soumis</p>
                <p className="text-xs text-gray-600">Villa à Sidi Bou Saïd - Il y a 5 min</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAction("view-listing")}>
                Voir
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Réservation confirmée</p>
                <p className="text-xs text-gray-600">Maison à Hammamet - Il y a 12 min</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAction("view-booking")}>
                Voir
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Avis signalé</p>
                <p className="text-xs text-gray-600">Contenu inapproprié détecté - Il y a 25 min</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAction("moderate-review")}>
                Modérer
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouvel utilisateur inscrit</p>
                <p className="text-xs text-gray-600">Propriétaire à Tunis - Il y a 1h</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleAction("view-user")}>
                Voir
              </Button>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => handleAction("view-all-notifications")}
          >
            Voir toutes les notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}