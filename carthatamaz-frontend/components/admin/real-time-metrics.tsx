"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Users, 
  Home, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Clock,
  AlertCircle
} from "lucide-react"

interface MetricData {
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
  color: string
  description: string
}

interface RealTimeMetricsProps {
  onRefresh?: () => void
  loading?: boolean
  lastUpdate?: Date
}

export default function RealTimeMetrics({ onRefresh, loading = false, lastUpdate }: RealTimeMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: "Utilisateurs en ligne",
      value: 0,
      change: 0,
      trend: "stable",
      icon: <Activity className="h-4 w-4" />,
      color: "text-green-600",
      description: "Utilisateurs actifs maintenant"
    },
    {
      label: "Nouvelles inscriptions",
      value: 0,
      change: 0,
      trend: "stable",
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600",
      description: "Aujourd'hui"
    },
    {
      label: "Réservations en cours",
      value: 0,
      change: 0,
      trend: "stable",
      icon: <Calendar className="h-4 w-4" />,
      color: "text-purple-600",
      description: "En attente de confirmation"
    },
    {
      label: "Nouveaux avis",
      value: 0,
      change: 0,
      trend: "stable",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-orange-600",
      description: "Dernières 24h"
    },
    {
      label: "Hébergements vus",
      value: 0,
      change: 0,
      trend: "stable",
      icon: <Eye className="h-4 w-4" />,
      color: "text-indigo-600",
      description: "Vues aujourd'hui"
    },
    {
      label: "Alertes système",
      value: 0,
      change: 0,
      trend: "stable",
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-600",
      description: "Nécessitent attention"
    }
  ])

  // Simulation de données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + Math.floor(Math.random() * 10) - 5),
        change: Math.floor(Math.random() * 20) - 10,
        trend: Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "stable"
      })))
    }, 5000) // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up" || change > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />
    } else if (trend === "down" || change < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />
    }
    return null
  }

  const getTrendColor = (trend: string, change: number) => {
    if (trend === "up" || change > 0) return "text-green-600"
    if (trend === "down" || change < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Métriques en Temps Réel</h3>
          {lastUpdate && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          )}
        </div>
        <Button 
          onClick={onRefresh} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend, metric.change)}
                  <span className={`text-xs font-medium ${getTrendColor(metric.trend, metric.change)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {metric.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-500">
                  {metric.description}
                </div>
              </div>

              {/* Indicateur de statut */}
              <div className="mt-3 flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    metric.trend === "up" ? "border-green-200 text-green-700" :
                    metric.trend === "down" ? "border-red-200 text-red-700" :
                    "border-gray-200 text-gray-700"
                  }`}
                >
                  {metric.trend === "up" ? "En hausse" :
                   metric.trend === "down" ? "En baisse" : "Stable"}
                </Badge>
                
                {/* Barre de progression pour certaines métriques */}
                {(metric.label.includes("Alertes") || metric.label.includes("en cours")) && (
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        metric.value > 10 ? "bg-red-500" :
                        metric.value > 5 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(100, (metric.value / 20) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertes importantes */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-4 w-4" />
            Alertes Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-yellow-400">
              <span>Pic de trafic détecté sur les hébergements</span>
              <Badge variant="outline" className="text-xs">Maintenant</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-blue-400">
              <span>Nouvelle fonctionnalité déployée avec succès</span>
              <Badge variant="outline" className="text-xs">Il y a 2h</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded border-l-4 border-green-400">
              <span>Taux de conversion en amélioration (+15%)</span>
              <Badge variant="outline" className="text-xs">Aujourd'hui</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}