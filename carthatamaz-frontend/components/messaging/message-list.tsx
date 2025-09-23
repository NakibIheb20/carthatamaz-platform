"use client"

import { useState, useEffect } from "react"
import { Search, MessageCircle, Phone, Video, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ApiService, type Conversation as ApiConversation, type User } from "@/components/services/api-complete"

interface Conversation {
  id: string
  hostName: string
  hostAvatar: string
  propertyTitle: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  propertyImage: string
}

interface MessageListProps {
  onSelectConversation: (conversation: Conversation) => void
  onNewConversation: () => void
}

export default function MessageList({ onSelectConversation, onNewConversation }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les conversations depuis l'API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const apiConversations = await ApiService.fetchConversations()
        
        // Transformer les données de l'API pour correspondre à notre interface
        const formattedConversations: Conversation[] = apiConversations.map(conv => {
          // Obtenir les informations de l'utilisateur distant (hôte)
          const otherUser = conv.participants.find(p => p.id !== localStorage.getItem("userId")) || conv.participants[0]
          
          // Obtenir l'ID de la propriété associée à la conversation
          // (Nous devrions stocker cette information dans l'API)
          const propertyId = "1" // À remplacer par les vraies données de l'API
          
          return {
            id: conv.id,
            hostName: otherUser.fullName || otherUser.email || "Utilisateur inconnu",
            hostAvatar: otherUser.picture_url || "/placeholder.svg?height=40&width=40",
            propertyTitle: "Propriété associée", // À remplacer par les vraies données
            lastMessage: conv.lastMessage,
            timestamp: new Date(conv.lastMessageTimestamp),
            unreadCount: conv.unreadCount,
            isOnline: conv.isOnline,
            propertyImage: "/placeholder.svg?height=60&width=60", // À remplacer par les vraies données
          }
        })
        
        setConversations(formattedConversations)
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchConversations()
  }, [])

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}min`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `${days}j`
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-red-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-red-700 p-2"
              onClick={onNewConversation}
              title="Nouvelle conversation"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700 p-2">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700 p-2">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-300" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-red-500 border-red-400 text-white placeholder-red-200 focus:bg-red-400 focus:border-red-300"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-center">Chargement des conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-12 w-12 mb-4" />
            <p className="text-center">Aucune conversation trouvée</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.hostAvatar || "/placeholder.svg"} alt={conversation.hostName} />
                      <AvatarFallback>{conversation.hostName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.hostName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatTime(conversation.timestamp)}</span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 truncate">{conversation.propertyTitle}</p>

                    <div className="flex items-center gap-2">
                      <img
                        src={conversation.propertyImage || "/placeholder.svg"}
                        alt={conversation.propertyTitle}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <p
                        className={`text-sm flex-1 truncate ${
                          conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
