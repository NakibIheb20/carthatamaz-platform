'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ApiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import apiClient from '@/lib/api-clean'

export default function TestPage() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const [testResults, setTestResults] = useState<Array<{
    name: string
    status: 'success' | 'error' | 'pending'
    message: string
  }>>([])

  const runTests = async () => {
    setTestResults([])
    const results: typeof testResults = []

    // Test 1: Connexion avec données de test
    try {
      results.push({ name: 'Test de connexion', status: 'pending', message: 'En cours...' })
      setTestResults([...results])
      
      await login({ email: 'admin@carthatamaz.com', password: 'password' })
      results[results.length - 1] = { 
        name: 'Test de connexion', 
        status: 'success', 
        message: 'Connexion réussie' 
      }
    } catch (error) {
      results[results.length - 1] = { 
        name: 'Test de connexion', 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
    setTestResults([...results])

    // Test 2: Récupération des guesthouses
    try {
      results.push({ name: 'Test API Guesthouses', status: 'pending', message: 'En cours...' })
      setTestResults([...results])
      
      const guesthouses = await apiClient.getGuesthouses()
      results[results.length - 1] = { 
        name: 'Test API Guesthouses', 
        status: 'success', 
        message: `${guesthouses.length} guesthouses récupérées` 
      }
    } catch (error) {
      results[results.length - 1] = { 
        name: 'Test API Guesthouses', 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
    setTestResults([...results])

    // Test 3: Récupération des stats admin
    try {
      results.push({ name: 'Test API Admin Stats', status: 'pending', message: 'En cours...' })
      setTestResults([...results])
      
      const stats = await apiClient.getAdminStats()
      results[results.length - 1] = { 
        name: 'Test API Admin Stats', 
        status: 'success', 
        message: `Stats récupérées: ${stats.totalUsers} utilisateurs` 
      }
    } catch (error) {
      results[results.length - 1] = { 
        name: 'Test API Admin Stats', 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
    setTestResults([...results])
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Succès</Badge>
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">En cours</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page de Test - CarthaTamaz
          </h1>
          <p className="text-gray-600">
            Testez les fonctionnalités d'authentification et d'API
          </p>
        </div>

        {/* État de l'authentification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>État de l'authentification</CardTitle>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="space-y-2">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connecté en tant que: <strong>{user?.fullName || user?.email}</strong>
                  </AlertDescription>
                </Alert>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Rôle: {user?.role}</Badge>
                  <Badge variant="outline">ID: {user?.id}</Badge>
                </div>
                <Button onClick={logout} variant="outline" size="sm">
                  Se déconnecter
                </Button>
              </div>
            ) : (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Non connecté
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Tests automatiques */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tests automatiques</CardTitle>
            <CardDescription>
              Testez la connexion et les APIs avec des données de démonstration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={runTests} className="w-full">
                Lancer les tests
              </Button>
              
              {testResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Résultats des tests:</h3>
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(result.status)}
                        <span className="text-sm text-gray-600">{result.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comptes de test */}
        <Card>
          <CardHeader>
            <CardTitle>Comptes de test disponibles</CardTitle>
            <CardDescription>
              Utilisez ces identifiants pour tester l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-red-600 mb-2">Admin</h4>
                <p className="text-sm text-gray-600 mb-1">Email: admin@carthatamaz.com</p>
                <p className="text-sm text-gray-600">Mot de passe: password</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600 mb-2">Propriétaire</h4>
                <p className="text-sm text-gray-600 mb-1">Email: owner@carthatamaz.com</p>
                <p className="text-sm text-gray-600">Mot de passe: password</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600 mb-2">Invité</h4>
                <p className="text-sm text-gray-600 mb-1">Email: guest@carthatamaz.com</p>
                <p className="text-sm text-gray-600">Mot de passe: password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
