'use client'

import { useState } from 'react'
import apiClient, { ApiClient } from '@/lib/api'
import { MockApiService, mockUsers } from '@/lib/mock-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function QuickTestPage() {
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testLogin = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      console.log('🧪 Test de connexion avec apiClient directement...')
      
      // Test avec différents emails pour voir lequel fonctionne
      const testEmails = [
        'admin@carthatamaz.com',
        'Admin@carthatamaz.com',
        'ADMIN@CARTHATAMAZ.COM',
        'owner@carthatamaz.com',
        'guest@carthatamaz.com'
      ]
      
      console.log('📧 Test avec différents emails:', testEmails)
      
      const authData = await apiClient.login({
        email: 'admin@carthatamaz.com',
        password: 'password'
      })
      
      console.log('✅ Données reçues:', authData)
      
      setResult(JSON.stringify(authData, null, 2))
    } catch (error) {
      console.error('❌ Erreur:', error)
      setResult(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMockDirectly = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      console.log('🧪 Test direct du MockApiService...')
      
      const authData = await MockApiService.login({
        email: 'admin@carthatamaz.com',
        password: 'password'
      })
      
      console.log('✅ Données reçues du mock:', authData)
      
      setResult(`Mock direct: ${JSON.stringify(authData, null, 2)}`)
    } catch (error) {
      console.error('❌ Erreur mock direct:', error)
      setResult(`Erreur mock direct: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Test de connexion API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Button 
                onClick={testLogin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Test en cours...' : 'Tester via apiClient'}
              </Button>
              
              <Button 
                onClick={testMockDirectly} 
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? 'Test en cours...' : 'Tester MockApiService directement'}
              </Button>
            </div>
            
            {result && (
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-sm">
                    {result}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Affichage des comptes de test */}
            <Alert>
              <AlertDescription>
                <strong>Comptes de test disponibles:</strong><br/>
                {mockUsers.map(user => (
                  <div key={user.id}>
                    • {user.email} / password ({user.role})<br/>
                  </div>
                ))}
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertDescription>
                <strong>Debug - Utilisateurs mock:</strong><br/>
                <pre className="text-xs">
                  {JSON.stringify(mockUsers, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
