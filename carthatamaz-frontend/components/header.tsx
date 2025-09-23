"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavigationMenu from "@/components/navigation/navigation-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-red-600">CarthaTamaz</h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
              Accueil
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
              Hébergements
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
              Expériences
            </a>
            <a href="#" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
              Devenir hôte
            </a>
            
            {/* Nouveau lien Recommandations */}
            <a href="/recommendations" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
              Recommandations
            </a>

            <div className="border-t pt-4">
              <a href="/messages" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
                Messages
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
                Favoris
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 block px-3 py-2 text-base font-medium">
                Connexion
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
