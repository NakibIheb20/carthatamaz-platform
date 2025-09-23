"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Ban, 
  Check, 
  Shield,
  Mail,
  Calendar
} from "lucide-react"
import { UserService, type  User } from "./api-service"
import { format } from "date-fns"

interface UsersManagementProps {
  onUserSelect?: (user: User) => void
}

export default function UsersManagement({ onUserSelect }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: ""
  })
  const [itemsPerPage] = useState(10)

  // Récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Construire les paramètres de requête
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })

      if (filters.search) params.append("search", filters.search)
      if (filters.role) params.append("role", filters.role)
      if (filters.status) params.append("status", filters.status)

      const response = await UserService.getAllUsers(currentPage, itemsPerPage)
      setUsers(response.users)
      setTotalUsers(response.total)
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
    } finally {
      setLoading(false)
    }
  }

  // Charger les utilisateurs au montage et quand les filtres changent
  useEffect(() => {
    fetchUsers()
  }, [currentPage, filters])

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Gérer la mise à jour du rôle
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await UserService.updateUserRole(userId, newRole)
      fetchUsers() // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error)
    }
  }

  // Gérer la désactivation d'un utilisateur
  const handleDeactivateUser = async (userId: string) => {
    try {
      await UserService.deactivateUser(userId)
      fetchUsers() // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la désactivation de l'utilisateur:", error)
    }
  }

  // Gérer l'activation d'un utilisateur
  const handleActivateUser = async (userId: string) => {
    try {
      await UserService.activateUser(userId)
      fetchUsers() // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de l'activation de l'utilisateur:", error)
    }
  }

  // Calculer le nombre de pages
  const totalPages = Math.ceil(totalUsers / itemsPerPage)

  // Rendu du composant
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Gérez les comptes utilisateurs et leurs permissions
            </CardDescription>
          </div>
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-10"
            />
          </div>

          <Select value={filters.role} onValueChange={(value) => setFilters({...filters, role: value})}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les rôles</SelectItem>
              <SelectItem value="ADMIN">Administrateur</SelectItem>
              <SelectItem value="OWNER">Propriétaire</SelectItem>
              <SelectItem value="GUEST">Client</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="ACTIVE">Actif</SelectItem>
              <SelectItem value="INACTIVE">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {user.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.fullName || "Utilisateur inconnu"}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username || "no_username"}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => handleUpdateRole(user.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="OWNER">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Propriétaire
                            </div>
                          </SelectItem>
                          <SelectItem value="GUEST">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Client
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      {user.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                          Inactif
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {user.created_at ? format(new Date(user.created_at), "dd/MM/yyyy") : "N/A"}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {user.is_active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateUser(user.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUserSelect?.(user)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, totalUsers)} 
                  sur {totalUsers} utilisateurs
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Précédent
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
