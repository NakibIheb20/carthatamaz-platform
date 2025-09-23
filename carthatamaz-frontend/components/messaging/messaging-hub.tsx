"use client"

import { useState, useEffect } from "react"
import MessageList from "./message-list"
import MessageThread from "./message-thread"
import UserList from "./user-list"

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

interface User {
  id: string
  fullName?: string | null
  email?: string
  role: "ADMIN" | "OWNER" | "GUEST"
  picture_url?: string
}

export default function MessagingHub() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Récupérer l'ID de l'utilisateur connecté
  useEffect(() => {
    // Vérifier d'abord le token
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("Aucun token trouvé dans le stockage local")
      setIsCheckingAuth(false)
      return
    }
    
    // Ensuite, vérifier les informations utilisateur
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        console.log("Utilisateur trouvé:", user)
        setCurrentUserId(user.id)
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error)
      }
    } else {
      console.log("Aucune donnée utilisateur trouvée dans le stockage local")
    }
    
    // Indiquer que la vérification est terminée
    setIsCheckingAuth(false)
  }, [])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setSelectedUser(null) // Réinitialiser la sélection d'utilisateur
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSelectedConversation(null) // Réinitialiser la sélection de conversation
    
    // Créer automatiquement une nouvelle conversation avec cet utilisateur
    if (currentUserId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        hostName: user.fullName || user.email || "Utilisateur",
        hostAvatar: user.picture_url || "/placeholder.svg?height=40&width=40",
        propertyTitle: "Nouvelle conversation",
        lastMessage: "Commencez la conversation",
        timestamp: new Date(),
        unreadCount: 0,
        isOnline: true,
        propertyImage: "/placeholder.svg?height=60&width=60",
      }
      
      setSelectedConversation(newConversation)
    }
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
    setSelectedUser(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messagerie</h1>
        <p className="text-gray-600">Communiquez directement avec vos hôtes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des conversations - masquée sur mobile quand une conversation est sélectionnée */}
        <div className={`${selectedConversation ? "hidden lg:block" : "block"} ${selectedUser ? "hidden lg:block" : ""}`}>
          {isCheckingAuth ? (
            <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : currentUserId ? (
            <MessageList onSelectConversation={handleSelectConversation} onNewConversation={() => setSelectedUser(null)} />
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Connectez-vous pour voir vos messages</p>
              <p className="text-sm text-gray-500 text-center">Vous devez être connecté pour voir vos conversations existantes</p>
            </div>
          )}
        </div>

        {/* Liste des utilisateurs - masquée sur mobile quand une conversation est sélectionnée */}
        <div className={`${selectedUser ? "hidden lg:block" : "block"} ${selectedConversation ? "hidden lg:block" : ""}`}>
          {isCheckingAuth ? (
            <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : currentUserId ? (
            <UserList 
              onSelectUser={handleSelectUser} 
              currentUserId={currentUserId} 
            />
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">Connectez-vous pour voir les utilisateurs</p>
              <p className="text-sm text-gray-500 text-center">Vous devez être connecté pour pouvoir chatter avec d'autres utilisateurs</p>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Se connecter</button>
            </div>
          )}
        </div>

        {/* Thread de messages */}
        <div className={`${selectedConversation || selectedUser ? "block" : "hidden lg:block"}`}>
          {isCheckingAuth ? (
            <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : selectedConversation ? (
            <MessageThread
              hostName={selectedConversation.hostName}
              hostAvatar={selectedConversation.hostAvatar}
              propertyTitle={selectedConversation.propertyTitle}
              conversationId={selectedConversation.id}
              onBack={handleBackToList}
            />
          ) : selectedUser ? (
            <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">Démarrer une conversation</p>
                <p className="text-sm">Envoyez un message à {selectedUser.fullName || selectedUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">Sélectionnez une conversation</p>
                <p className="text-sm">Choisissez une conversation dans la liste pour commencer à discuter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
