"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, Phone, Video, MoreVertical, ImageIcon, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ApiService, type Message as ApiMessage } from "@/components/services/api-complete"

interface Message {
  id: string
  text: string
  sender: "client" | "host"
  timestamp: Date
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "file"
  attachment?: {
    url: string
    name: string
    type: string
  }
}

interface MessageThreadProps {
  hostName: string
  hostAvatar: string
  propertyTitle: string
  conversationId: string
  onBack: () => void
}

export default function MessageThread({ hostName, hostAvatar, propertyTitle, conversationId, onBack }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger les messages depuis l'API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const apiMessages = await ApiService.fetchMessages(conversationId)
        
        // Transformer les données de l'API pour correspondre à notre interface
        const formattedMessages: Message[] = apiMessages.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.senderId === localStorage.getItem("userId") ? "client" : "host",
          timestamp: new Date(msg.timestamp),
          status: msg.status,
          type: msg.type,
          attachment: msg.attachment
        }))
        
        setMessages(formattedMessages)
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMessages()
  }, [conversationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "client",
      timestamp: new Date(),
      status: "sent",
      type: "text",
    }

    // Ajouter le message localement pour une meilleure expérience utilisateur
    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // Envoyer le message via l'API
      await ApiService.sendMessage(conversationId, inputValue)
      
      // Marquer le message comme envoyé
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "delivered" as const } 
            : msg
        )
      )
      
      // Simuler une réponse de l'hôte
      setTimeout(() => {
        const hostResponse: Message = {
          id: Date.now().toString(),
          text: "Merci pour votre message ! Je vous réponds dans quelques instants.",
          sender: "host",
          timestamp: new Date(),
          status: "delivered",
          type: "text",
        }
        setMessages((prev) => [...prev, hostResponse])
        setIsTyping(false)
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      // Marquer le message comme ayant échoué
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: "sent" as const } 
            : msg
        )
      )
      setIsTyping(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return "✓"
      case "delivered":
        return "✓✓"
      case "read":
        return <span className="text-blue-500">✓✓</span>
      default:
        return ""
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <CardHeader className="bg-red-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-red-700 p-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={hostAvatar || "/placeholder.svg"} alt={hostName} />
            <AvatarFallback>{hostName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-semibold text-sm">{hostName}</h3>
            <p className="text-xs opacity-90 truncate">{propertyTitle}</p>
            <div className="flex items-center gap-1 text-xs opacity-75">
              <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-400"}`} />
              {isOnline ? "En ligne" : "Hors ligne"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700 p-2">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700 p-2">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700 p-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p>Chargement des messages...</p>
          </div>
        ) : messages.map((message, index) => {
          const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center my-4">
                  <Badge variant="secondary" className="bg-white text-gray-600 text-xs">
                    {formatDate(message.timestamp)}
                  </Badge>
                </div>
              )}

              <div className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${message.sender === "client" ? "order-2" : "order-1"}`}>
                  {message.sender === "host" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={hostAvatar || "/placeholder.svg"} alt={hostName} />
                        <AvatarFallback className="text-xs">{hostName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{hostName}</span>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === "client"
                        ? "bg-red-600 text-white rounded-br-md"
                        : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {message.type === "image" && message.attachment && (
                      <div className="mb-2">
                        <img
                          src={message.attachment.url || "/placeholder.svg"}
                          alt={message.attachment.name}
                          className="rounded-lg max-w-full h-auto"
                        />
                      </div>
                    )}

                    <p className="text-sm leading-relaxed">{message.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        message.sender === "client" ? "text-red-100" : "text-gray-500"
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === "client" && <span className="ml-1">{getStatusIcon(message.status)}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={hostAvatar || "/placeholder.svg"} alt={hostName} />
                <AvatarFallback className="text-xs">{hostName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-600">{hostName}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm ml-8">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2">
            <ImageIcon className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Tapez votre message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="pr-10 rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!inputValue.trim()}
            className="bg-red-600 hover:bg-red-700 rounded-full p-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
