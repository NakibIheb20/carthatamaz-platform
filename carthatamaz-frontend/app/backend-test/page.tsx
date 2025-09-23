'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api';

export default function BackendTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔄 Démarrage des tests de connectivité...');
      
      // Test 1: Connectivité de base
      let isConnected = false;
      try {
        const response = await fetch('http://localhost:8080/api/health', { method: 'GET' });
        isConnected = response.ok;
      } catch (error) {
        isConnected = false;
      }
      addResult(`📡 Connectivité backend: ${isConnected ? '✅ OK' : '❌ ÉCHEC'}`);
      
      if (!isConnected) {
        addResult('❌ Backend non accessible. Vérifiez que Spring Boot est démarré sur le port 8080');
        return;
      }
      
      // Test 2: Test d'un endpoint simple
      try {
        const response = await fetch('http://localhost:8080/api/guesthouses');
        addResult(`🏠 GET /api/guesthouses: ${response.status} ${response.statusText}`);
      } catch (e) {
        addResult('❌ Erreur lors du test GET /api/guesthouses');
      }
      
      // Test 4: Test de l'endpoint de login (méthode OPTIONS)
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', { method: 'OPTIONS' });
        addResult(`🔑 OPTIONS /api/auth/login: ${response.status} ${response.statusText}`);
      } catch (e) {
        addResult('❌ Erreur lors du test OPTIONS /api/auth/login');
      }
      
      addResult('✅ Tests terminés. Consultez la console pour plus de détails.');
      
    } catch (error) {
      addResult(`❌ Erreur lors des tests: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLoginEndpoint = async () => {
    setIsLoading(true);
    addResult('🔑 Test de l\'endpoint de login avec des credentials de test...');
    
    try {
      // Test avec des credentials bidon pour voir la structure de l'erreur
      await apiClient.login({ email: 'test@test.com', password: 'test123' });
    } catch (error: any) {
      addResult(`📋 Réponse du serveur: ${error.message}`);
      
      if (error.message.includes('401')) {
        addResult('✅ L\'endpoint de login existe (erreur 401 = credentials incorrects)');
      } else if (error.message.includes('404')) {
        addResult('❌ L\'endpoint de login n\'existe pas (erreur 404)');
      } else {
        addResult(`⚠️ Autre erreur: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>🔧 Test de Connectivité Backend Spring Boot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testBackendConnection} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Test en cours...' : '🔍 Tester la Connectivité'}
            </Button>
            
            <Button 
              onClick={testLoginEndpoint} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Test en cours...' : '🔑 Tester Login'}
            </Button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {testResults.length === 0 && (
              <div className="text-gray-500">
                Cliquez sur "Tester la Connectivité" pour commencer les tests...
              </div>
            )}
            {testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Assurez-vous que votre backend Spring Boot est démarré sur le port 8080</li>
              <li>Cliquez sur "Tester la Connectivité" pour diagnostiquer la connexion</li>
              <li>Consultez la console du navigateur (F12) pour voir les logs détaillés</li>
              <li>Si la connectivité fonctionne, testez l'endpoint de login</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
