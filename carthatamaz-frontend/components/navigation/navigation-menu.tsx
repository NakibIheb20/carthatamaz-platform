"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  UserIcon,
  Settings,
  LogOut,
  Shield,
  Building,
  BarChart3,
  Bell,
  Sparkles,
} from "lucide-react"
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
import LogoutModal from "@/components/auth/logout-modal"

// ===== TYPES =====
interface AppUser {
  id: number
  name: string
  email: string
  role: "ADMIN" | "OWNER" | "GUEST"
  avatar?: string
}

interface NavigationItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// ===== CONSTANTS =====
const ROLE_STYLES = {
  ADMIN: "bg-purple-100 text-purple-800",
  OWNER: "bg-blue-100 text-blue-800",
  GUEST: "bg-green-100 text-green-800",
  DEFAULT: "bg-gray-100 text-gray-800"
} as const

const ROLE_LABELS = {
  ADMIN: "Admin",
  OWNER: "Propriétaire",
  GUEST: "Voyageur",
  DEFAULT: "Utilisateur"
} as const

// ===== NAVIGATION ITEMS =====
const BASE_NAVIGATION: NavigationItem[] = [
  { href: "/search", label: "Rechercher", icon: Search },
]

const ADMIN_NAVIGATION: NavigationItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "Utilisateurs", icon: UserIcon },
  { href: "/admin/listings", label: "Hébergements", icon: Building },
  { href: "/admin/reviews", label: "Avis & Modération", icon: Shield },
]

const OWNER_NAVIGATION: NavigationItem[] = [
  { href: "/host", label: "Mon Dashboard", icon: Building },
  { href: "/host/bookings", label: "Mes Réservations", icon: BarChart3 },
  { href: "/host/listings", label: "Mes Propriétés", icon: Home },
  { href: "/messages", label: "Messages", icon: MessageCircle },
]

const GUEST_NAVIGATION: NavigationItem[] = [
  { href: "/guest", label: "Accueil", icon: Home },
  { href: "/bookings", label: "Mes Réservations", icon: BarChart3 },
  { href: "/recommendations", label: "Recommandations", icon: Sparkles },
  { href: "/favorites", label: "Favoris", icon: Heart },
  { href: "/messages", label: "Support", icon: MessageCircle },
]

// ===== UTILITY FUNCTIONS =====
const getRoleColor = (role: string): string => {
  return ROLE_STYLES[role as keyof typeof ROLE_STYLES] || ROLE_STYLES.DEFAULT
}

const getRoleLabel = (role: string): string => {
  return ROLE_LABELS[role as keyof typeof ROLE_LABELS] || ROLE_LABELS.DEFAULT
}

const getNavigationItems = (userRole: string): NavigationItem[] => {
  switch (userRole) {
    case "ADMIN":
      return ADMIN_NAVIGATION
    case "OWNER":
      return OWNER_NAVIGATION  
    case "GUEST":
      return GUEST_NAVIGATION
    default:
      return BASE_NAVIGATION
  }
}

// ===== COMPONENTS =====
const UnauthenticatedNav = () => (
  <nav className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold text-red-600">
          CarthaTamaz
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
  </nav>
)

const NavigationLinks = ({ items, pathname }: { items: NavigationItem[]; pathname: string }) => (
  <div className="hidden md:flex items-center space-x-6">
    {items.map((item) => {
      const Icon = item.icon
      const isActive = pathname === item.href
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive ? "bg-red-100 text-red-700" : "text-gray-600 hover:text-red-600 hover:bg-red-50"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      )
    })}
  </div>
)

const NotificationButton = () => (
  <Button variant="ghost" size="sm" className="relative">
    <Bell className="h-4 w-4" />
    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
      3
    </Badge>
  </Button>
)

const UserMenu = ({ 
  user, 
  navigationItems, 
  onLogout 
}: { 
  user: AppUser; 
  navigationItems: NavigationItem[]; 
  onLogout: () => void 
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium leading-none">{user.name || "Utilisateur"}</p>
          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          <Badge className={`${getRoleColor(user.role)} text-xs w-fit`}>
            {getRoleLabel(user.role)}
          </Badge>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Navigation Mobile */}
      <div className="md:hidden">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center">
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
      </div>

      {/* Menu utilisateur */}
      <DropdownMenuItem asChild>
        <Link href="/profile">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </Link>
      </DropdownMenuItem>

      {user.role === "ADMIN" && (
        <DropdownMenuItem asChild>
          <Link href="/admin/settings">
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Settings</span>
          </Link>
        </DropdownMenuItem>
      )}

      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onLogout}
        className="text-red-600 focus:text-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Déconnexion</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

// ===== MAIN COMPONENT =====
export default function NavigationMenu() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // ===== EFFECTS =====
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (error) {
        console.error("Erreur parsing user:", error)
      }
    }
  }, [])

  // ===== HANDLERS =====
  const handleLogout = () => {
    setIsLogoutModalOpen(true)
  }

  // ===== RENDER =====
  if (!user) {
    return <UnauthenticatedNav />
  }

  const navigationItems = getNavigationItems(user.role)

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et badge admin */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-red-600">
                CarthaTamaz
              </Link>
              {user.role === "ADMIN" && (
                <Badge className="bg-purple-100 text-purple-800 text-xs">ADMIN</Badge>
              )}
            </div>

            {/* Navigation principale */}
            <NavigationLinks items={navigationItems} pathname={pathname} />

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
              <NotificationButton />
              <UserMenu 
                user={user} 
                navigationItems={navigationItems} 
                onLogout={handleLogout} 
              />
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        userName={user.name} 
      />
    </>
  )
}
