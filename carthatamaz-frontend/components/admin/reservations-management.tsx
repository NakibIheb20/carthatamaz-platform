"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiService, type Reservation } from "@/components/services/api"

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ApiService.getAllReservations()
      setReservations(data)
    } catch (err) {
      console.error("Erreur lors du chargement des réservations:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des réservations")
    } finally {
      setLoading(false)
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.guest?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.guesthouse?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.guesthouse?.city?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || reservation.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800">Confirmée</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const handleReservationAction = async (id: string, action: string) => {
    try {
      let success = false
      
      switch (action) {
        case "confirm":
          success = await ApiService.confirmReservation(id)
          break
        case "reject":
          success = await ApiService.rejectReservation(id)
          break
        case "cancel":
          success = await ApiService.cancelReservation(id)
          break
      }

      if (success) {
        // Recharger les données
        await loadReservations()
      }
    } catch (err) {
      console.error("Erreur lors de l'action sur la réservation:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de l'action")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestion des Réservations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une réservation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500"
              disabled={loading}
            >
              <option value="all">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmée</option>
              <option value="CANCELLED">Annulée</option>
              <option value="COMPLETED">Terminée</option>
            </select>
            <Button variant="outline" disabled={loading}>
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button onClick={loadReservations} disabled={loading}>
              Actualiser
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Chargement des réservations...</div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Hébergement</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Voyageurs</TableHead>
                    <TableHead>Prix Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucune réservation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {reservation.guest?.fullName || "Utilisateur inconnu"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {reservation.guest?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {reservation.guesthouse?.title || "Hébergement inconnu"}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {reservation.guesthouse?.city}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                            </div>
                            <div className="text-gray-600">
                              {calculateNights(reservation.checkInDate, reservation.checkOutDate)} nuit(s)
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-gray-600" />
                            {reservation.numberOfGuests}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center font-medium">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            {reservation.totalPrice.toLocaleString()}€
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </DropdownMenuItem>
                              {reservation.status === "PENDING" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleReservationAction(reservation.id, "confirm")}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Confirmer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleReservationAction(reservation.id, "reject")}
                                  >
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                    Rejeter
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(reservation.status === "CONFIRMED" || reservation.status === "PENDING") && (
                                <DropdownMenuItem
                                  onClick={() => handleReservationAction(reservation.id, "cancel")}
                                >
                                  <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                  Annuler
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {filteredReservations.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  {filteredReservations.length} réservation(s) trouvée(s)
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}