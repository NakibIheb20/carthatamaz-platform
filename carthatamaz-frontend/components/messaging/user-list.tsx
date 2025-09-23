"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ApiService, type User } from "@/components/services/api-complete"
import { mockUsers } from "@/lib/mock-api"

interface UserListProps {
  onSelectUser: (user: User) => void
  currentUserId: string
}

export default function UserList({ onSelectUser, currentUserId }: UserListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        // Récupérer tous les utilisateurs (sauf l'utilisateur courant)
        const allUsers = await fetchAllUsers()

        // Filtrer pour exclure l'utilisateur courant
        const otherUsers = allUsers.filter(user => user.id !== currentUserId)

        setUsers(otherUsers)
        setFilteredUsers(otherUsers)
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentUserId])

  // Filtrer les utilisateurs en fonction de la recherche
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter(
      user => 
        user.fullName?.toLowerCase().includes(query) || 
        user.email?.toLowerCase().includes(query)
    )

    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleSelectUser = (user: User) => {
    onSelectUser(user)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
      case "OWNER":
        return <Badge className="bg-blue-100 text-blue-800">Propriétaire</Badge>
      case "GUEST":
        return <Badge className="bg-green-100 text-green-800">Client</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  if (loading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>Utilisateurs</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserPlus className="h-12 w-12 mb-4" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSelectUser(user)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.picture_url} alt={user.fullName || user.email} />
                  <AvatarFallback>
                    {(user.fullName || user.email || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.fullName || "Utilisateur inconnu"}
                    </h3>
                    {getRoleBadge(user.role)}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Fonction pour récupérer tous les utilisateurs
async function fetchAllUsers(): Promise<User[]> {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Aucun token trouvé, utilisation des utilisateurs mock.")
      return mockUsers
    }

    const response = await fetch("http://localhost:8080/api/admin/users", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error(`Erreur HTTP: ${response.status}`)
      if (response.status === 401 || response.status === 403) {
        console.warn("Erreur d'authentification, utilisation des utilisateurs mock.")
        return mockUsers
      }
      return []
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    return mockUsers
  }
}
