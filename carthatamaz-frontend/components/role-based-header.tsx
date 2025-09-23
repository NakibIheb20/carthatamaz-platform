"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Crown, Shield, Home, User, Settings, Bell, LogOut, Search, Heart, MessageCircle, UserIcon, Building, BarChart3, Sparkles, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

// Navigation items selon les rôles
const ADMIN_NAVIGATION = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "Utilisateurs", icon: UserIcon },
  { href: "/admin/listings", label: "Hébergements", icon: Building },
  { href: "/admin/reviews", label: "Avis & Modération", icon: Shield },
]

const OWNER_NAVIGATION = [
  { href: "/host", label: "Mon Dashboard", icon: Building },
  { href: "/host/bookings", label: "Mes Réservations", icon: BarChart3 },
  { href: "/host/listings", label: "Mes Propriétés", icon: Home },
  { href: "/messages", label: "Messages", icon: MessageCircle },
]

const GUEST_NAVIGATION = [
  { href: "/guest", label: "Accueil", icon: Home },
  { href: "/listings", label: "Hébergements", icon: Search },
  { href: "/chatbot", label: "Chatbot", icon: Sparkles },
  { href: "/bookings", label: "Mes Réservations", icon: BarChart3 },
  { href: "/recommendations", label: "Recommandations", icon: Sparkles },
]

// Composant de navigation pour les headers
const HeaderNavigation = ({ items, className = "" }: { items: any[], className?: string }) => {
  const pathname = usePathname()
  
  return (
    <nav className={`hidden md:flex items-center space-x-1 ${className}`}>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href}>
            <Button 
              variant={isActive ? "secondary" : "ghost"} 
              size="sm"
              className={`text-white hover:bg-white/20 ${isActive ? 'bg-white/20' : ''}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

// Composant de déconnexion
const LogoutButton = ({ className = "" }: { className?: string }) => {
  const { logout } = useAuth()
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={logout}
      className={`text-white hover:bg-white/20 ${className}`}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  )
}

// Composant de menu mobile
const MobileMenu = ({ items, isOpen, onClose, bgColor }: { items: any[], isOpen: boolean, onClose: () => void, bgColor: string }) => {
  const pathname = usePathname()
  const { logout } = useAuth()
  
  if (!isOpen) return null
  
  return (
    <div className={`md:hidden ${bgColor} border-t border-white/20`}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div className={`flex items-center px-3 py-2 rounded-md text-white hover:bg-white/20 ${isActive ? 'bg-white/20' : ''}`}>
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </div>
            </Link>
          )
        })}
        <button 
          onClick={() => { logout(); onClose(); }}
          className="flex items-center w-full px-3 py-2 rounded-md text-white hover:bg-white/20"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

// Header spécifique pour les administrateurs
const AdminHeader = ({ user }: { user: any }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8" />
                <div>
                  <h1 className="text-xl font-bold">Admin Panel</h1>
                  <p className="text-purple-200 text-sm">CarthaTamaz</p>
                </div>
              </div>
              <HeaderNavigation items={ADMIN_NAVIGATION} />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-purple-800 text-purple-100 hidden sm:flex">
                <Crown className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <Button variant="ghost" size="sm" className="text-white hover:bg-purple-600 hidden sm:flex">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture_url} alt={user?.fullName} />
                      <AvatarFallback className="bg-purple-800 text-purple-100">
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.fullName || user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Mon Profil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Menu mobile toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu 
        items={ADMIN_NAVIGATION} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        bgColor="bg-purple-700"
      />
    </>
  )
}

// Header spécifique pour les propriétaires
const OwnerHeader = ({ user }: { user: any }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <>
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Home className="h-8 w-8" />
                <div>
                  <h1 className="text-xl font-bold">Espace Hôte</h1>
                  <p className="text-green-200 text-sm">CarthaTamaz</p>
                </div>
              </div>
              <HeaderNavigation items={OWNER_NAVIGATION} />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-800 text-green-100 hidden sm:flex">
                <Home className="h-3 w-3 mr-1" />
                Hôte
              </Badge>
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-600 hidden sm:flex">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture_url} alt={user?.fullName} />
                      <AvatarFallback className="bg-green-800 text-green-100">
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "H"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.fullName || user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres Hôte
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Mon Profil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Menu mobile toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu 
        items={OWNER_NAVIGATION} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        bgColor="bg-green-700"
      />
    </>
  )
}

// Header spécifique pour les invités
const GuestHeader = ({ user }: { user: any }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">C</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">CarthaTamaz</h1>
                  <p className="text-blue-200 text-sm">Tunisie Authentique</p>
                </div>
              </div>
              <HeaderNavigation items={GUEST_NAVIGATION} />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-800 text-blue-100 hidden sm:flex">
                <User className="h-3 w-3 mr-1" />
                Invité
              </Badge>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-600 hidden sm:flex">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture_url} alt={user?.fullName} />
                      <AvatarFallback className="bg-blue-800 text-blue-100">
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "I"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.fullName || user?.email}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Mes Préférences
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Mon Profil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Menu mobile toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu 
        items={GUEST_NAVIGATION} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        bgColor="bg-blue-700"
      />
    </>
  )
}

// Header par défaut pour les utilisateurs non connectés
const DefaultHeader = () => (
  <header className="bg-white shadow-sm border-b border-red-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600">CarthaTamaz</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="outline">Connexion</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-red-600 hover:bg-red-700">Inscription</Button>
          </Link>
        </div>
      </div>
    </div>
  </header>
)

export default function RoleBasedHeader() {
  const { user } = useAuth()

  if (!user) {
    return <DefaultHeader />
  }

  switch (user.role) {
    case 'ADMIN':
      return <AdminHeader user={user} />
    case 'OWNER':
      return <OwnerHeader user={user} />
    case 'GUEST':
      return <GuestHeader user={user} />
    default:
      return <DefaultHeader />
  }
}
