'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BackendTestPage() {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBackendConnection = async () => {
    setResults([]);
    
    // Test 1: Vérifier si le backend répond
    try {
      addResult('🔍 Test de connectivité backend...');
      const response = await fetch('http://localhost:8080');
      addResult(`📡 Backend status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const text = await response.text();
        addResult(`✅ Backend accessible, contenu: ${text.substring(0, 100)}...`);
      }
    } catch (error: any) {
      addResult(`❌ Backend non accessible: ${error.message}`);
      return;
    }

    // Test 2: Tester l'endpoint de login avec différentes structures
    const testCredentials = [
      { email, password },
      { username: email, password },
      { login: email, password },
      { identifier: email, password }
    ];

    const endpoints = [
      '/api/auth/login',
      '/auth/login', 
      '/login',
      '/api/login'
    ];

    for (const endpoint of endpoints) {
      for (const creds of testCredentials) {
        try {
          addResult(`🔑 Test ${endpoint} avec structure: ${JSON.stringify(creds)}`);
          
          const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(creds)
          });

          addResult(`📡 ${endpoint} => ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            const data = await response.json();
            addResult(`✅ Succès! Réponse: ${JSON.stringify(data)}`);
            return; // Arrêter dès qu'on trouve une combinaison qui marche
          } else {
            const errorText = await response.text();
            addResult(`❌ Erreur: ${errorText}`);
          }
          
        } catch (error: any) {
          addResult(`💥 Exception: ${error.message}`);
        }
      }
    }
  };

  const testWithCustomCredentials = async () => {
    if (!email || !password) {
      addResult('⚠️ Veuillez saisir email et mot de passe');
      return;
    }

    addResult(`🧪 Test avec credentials personnalisés: ${email}`);
    await testBackendConnection();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>🔧 Diagnostic Backend Spring Boot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email de test</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe de test</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={testBackendConnection} className="bg-blue-600">
              🔍 Test Automatique
            </Button>
            <Button onClick={testWithCustomCredentials} variant="outline">
              🧪 Test avec Mes Credentials
            </Button>
          </div>
          
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {results.length === 0 && (
              <div className="text-gray-500">
                Console de diagnostic - Cliquez sur un bouton pour commencer...
              </div>
            )}
            {results.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-semibold mb-2">💡 Solutions possibles si erreur 401:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Credentials incorrects</strong>: Vérifiez que l'utilisateur existe dans votre base</li>
              <li><strong>Encodage mot de passe</strong>: Votre backend utilise BCrypt, PBKDF2, etc.</li>
              <li><strong>Structure de données</strong>: Votre backend attend username au lieu d'email</li>
              <li><strong>Headers manquants</strong>: CORS, Content-Type, etc.</li>
              <li><strong>Endpoint différent</strong>: /login au lieu de /api/auth/login</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
