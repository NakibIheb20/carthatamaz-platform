"use client"

import { useEffect, useState } from "react"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Ban,
  ShieldCheck,
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

interface User {
  id: string
  fullName?: string | null
  email?: string
  phonenumber?: string
  birthday?: string
  picture_url?: string
  role: "ADMIN" | "OWNER" | "GUEST"
  status?: "active" | "banned" | "inactive"
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch("http://localhost:8080/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`)

        const data: User[] = await res.json()

        const enriched = data.map((user) => ({
          ...user,
          picture_url: user.picture_url || "/placeholder.svg",
          status: user.status || "active",
        }))

        setUsers(enriched)
      } catch (err) {
        console.error("Erreur de chargement des utilisateurs :", err)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "banned":
        return <Badge className="bg-red-100 text-red-800">Banni</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const handleUserAction = (id: string, action: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                action === "ban"
                  ? "banned"
                  : action === "activate"
                  ? "active"
                  : action === "deactivate"
                  ? "inactive"
                  : user.status,
            }
          : user
      )
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Anniversaire</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.slice(0, 300).map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.picture_url || "/placeholder.svg"}
                        alt={user.fullName || "Utilisateur"}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      <span className="font-medium">
                        {user.fullName || "Inconnu"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.phonenumber || "-"}</TableCell>
                  <TableCell>
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        {user.status !== "banned" && (
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "ban")}
                          >
                            <Ban className="mr-2 h-4 w-4 text-red-500" />
                            Bannir
                          </DropdownMenuItem>
                        )}
                        {user.status !== "active" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUserAction(user.id, "activate")
                            }
                          >
                            <ShieldCheck className="mr-2 h-4 w-4 text-green-600" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        {user.status === "active" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUserAction(user.id, "deactivate")
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Désactiver
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
