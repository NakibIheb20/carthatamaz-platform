"use client"

import { useState, useEffect, useRef } from "react"
import apiClient from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ListingCard from "@/components/listing-card"
import RoleBasedHeader from "@/components/role-based-header"
import type { Listing } from "@/components/types/listing"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  recommendations?: Listing[]
}

// Convertit un bloc texte de recommandations (format brut "Recommandation 1: - Titre: ...")
// en un texte plus naturel et personnalisé pour l'utilisateur.
function humanizeRecommendations(raw: string): string | null {
  if (!raw.includes('Recommandation')) return null

  const parts = raw
    .split(/Recommandation\s+\d+\s*:/i)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  if (parts.length === 0) return null

  const items = parts.map(block => {
    const get = (label: string) => {
      const r = new RegExp(`-\\s*${label}\\s*:\\s*([^\n-]+)`, 'i')
      const m = block.match(r)
      return m ? m[1].trim() : undefined
    }
    const titre = get('Titre')
    const ville = get('Ville')
    let prix = get('Prix')
    if (prix) prix = prix.replace(/[^0-9,.]/g,'')
    const note = get('Note')
    const similarity = get('Score de similarité')
    return { titre, ville, prix, note, similarity }
  })

  const intro = parts.length === 1
    ? "Voici une suggestion adaptée à votre recherche :"
    : `J'ai sélectionné ${parts.length} hébergements susceptibles de vous plaire :`

  const lines = items.map((it, idx) => {
    const num = idx + 1
    const segs: string[] = []
    if (it.ville) segs.push(it.ville)
    if (it.prix) segs.push(`~${it.prix} $/nuit`)
    if (it.note) segs.push(`note ${it.note}`)
    if (it.similarity) segs.push(`pertinence ${it.similarity}`)
    const meta = segs.length ? ` – ${segs.join(' • ')}` : ''
    return `${num}. ${it.titre || 'Hébergement'}${meta}`
  })

  const conclusion = "Indiquez-moi si vous voulez un autre budget, une autre ville ou plus d'options.";
  return [intro, '', ...lines, '', conclusion].join('\n')
}

// Utilitaire simple pour décoder l'expiration JWT (sans validation cryptographique)
function getJwtExpiration(token: string | null): { expired: boolean; exp?: number; remainingSec?: number } {
  if (!token) return { expired: true }
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return { expired: false }
    const payload = JSON.parse(atob(parts[1]))
    if (!payload.exp) return { expired: false }
    const nowSec = Math.floor(Date.now() / 1000)
    const remainingSec = payload.exp - nowSec
    return { expired: remainingSec <= 0, exp: payload.exp, remainingSec }
  } catch {
    return { expired: false }
  }
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initial message from the bot
    setMessages([
      {
        id: "initial",
        sender: "bot",
        text: "Bonjour ! Je suis votre assistant de voyage. Comment puis-je vous aider à trouver l'hébergement de vos rêves aujourd'hui ? Vous pouvez me demander des choses comme 'Je cherche une villa avec piscine à Hammamet' ou 'Montre-moi des appartements pas chers à Sousse'.",
      },
    ])
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
    }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        // Pas de jeton : informer l'utilisateur et arrêter ici
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "Vous n'êtes pas connecté. Veuillez vous connecter pour utiliser le chatbot.",
          },
        ])
        return
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        // Essayer d'abord JSON puis fallback texte
        Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
        Authorization: `Bearer ${token}`,
      }

      // Utiliser directement l'endpoint chatbot documenté.
      // Le /api/auth/recommend retournait 401 parce qu'il est protégé (ou inexistant) côté backend.
      // Nous restons sur un seul endpoint clair et un parsing robuste.
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const chatbotEndpoint = '/api/chatbot/recommend'

      // Certains backends attendent un champ précis; on envoie plusieurs clés pour maximiser la compatibilité.
      const payload = {
        query: currentInput,
        prompt: currentInput,
        message: currentInput,
        text: currentInput,
      }

      const jwtInfo = getJwtExpiration(token)
      console.log('[Chatbot] Debug JWT', jwtInfo)
      if (jwtInfo.expired) {
        console.warn('[Chatbot] Token expiré côté client (exp claim)')
      }

      console.log('[Chatbot] Envoi unique', { endpoint: chatbotEndpoint, payload })
      const response = await fetch(`${baseUrl}${chatbotEndpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.status === 401) {
        console.warn('[Chatbot] 401 sur /api/chatbot/recommend – suppression token & redirection')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setTimeout(() => router.push('/login'), 1200)
        throw new Error("Session expirée ou permissions insuffisantes.")
      }

      // Lire le corps UNE SEULE FOIS pour éviter l'erreur "body stream already read"
      const raw = await response.text()
      const contentType = response.headers.get('content-type') || ''
      console.log('[Chatbot] Réponse brute', { status: response.status, contentType, rawPreview: raw.slice(0, 120) })

      let botText = ''
      let recommendations: Listing[] | undefined

      // Tenter de parser uniquement si ça ressemble à du JSON
      const trimmed = raw.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const data = JSON.parse(trimmed)
          if (Array.isArray(data)) {
            recommendations = data as Listing[]
            botText = 'Voici des recommandations basées sur votre demande.'
          } else if (data && typeof data === 'object') {
            botText = (data as any).message || (data as any).text || 'Réponse reçue.'
            if (Array.isArray((data as any).recommendations)) {
              recommendations = (data as any).recommendations
            } else if (Array.isArray((data as any).listings)) {
              recommendations = (data as any).listings
            }
          }
        } catch (err) {
          console.warn('[Chatbot] Corps déclaré JSON mais invalide, fallback texte')
        }
      }

      if (!botText) {
        // Essayer de reformater les recommandations brutes si c'est le format texte fourni
        const human = humanizeRecommendations(trimmed)
        botText = human || trimmed || `Réponse HTTP ${response.status}`
      }

      if (!response.ok) {
        throw new Error(botText || `Erreur HTTP: ${response.status}`)
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botText,
        recommendations,
      }
      setMessages(prev => [...prev, botResponse])

    } catch (error: any) {
      console.error("Error fetching recommendations:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text:
          error.message ||
          "Désolé, une erreur est survenue. Veuillez réessayer plus tard.",
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <RoleBasedHeader />
      <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {messages.map(message => (
                <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'bot' && (
                    <Avatar className="w-10 h-10 border-2 border-red-500">
                      <AvatarFallback><Sparkles className="text-red-500" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-lg p-4 rounded-2xl ${message.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                    <p>{message.text}</p>
                    {message.recommendations && (
                      <div className="mt-4">
                        <div className="grid grid-cols-1 gap-4">
                          {message.recommendations.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>VOUS</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-4">
                   <Avatar className="w-10 h-10 border-2 border-red-500">
                      <AvatarFallback><Sparkles className="text-red-500" /></AvatarFallback>
                    </Avatar>
                  <div className="max-w-lg p-4 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Décrivez votre hébergement idéal..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
