# Endpoints Spring Boot - Configuration Complète

## Configuration Backend
- **URL Backend**: http://localhost:8080
- **Mode Mock**: DÉSACTIVÉ (NEXT_PUBLIC_MOCK_MODE=false)
- **Authentification**: JWT Bearer Token

## Endpoints Authentification

### POST /api/auth/login
**Payload**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Réponses possibles**:
```json
// Option 1: Structure directe
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string",
    "role": "GUEST|OWNER|ADMIN"
  }
}

// Option 2: Structure avec wrapper
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {...}
  }
}

// Option 3: Structure JWT standard
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {...}
}
```

### POST /api/auth/register
**Payload**:
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phonenumber": "string",
  "role": "GUEST|OWNER"
}
```

## Endpoints Guesthouses

### GET /api/guesthouses
- Récupère toutes les guesthouses

### GET /api/guesthouses/{id}
- Récupère une guesthouse par ID

### POST /api/guesthouses
**Headers**: Authorization: Bearer {token}
**Payload**:
```json
{
  "title": "string",
  "description": "string",
  "city": "string",
  "price": "string",
  "amenities": ["string"]
}
```

### PUT /api/guesthouses/{id}
**Headers**: Authorization: Bearer {token}

### DELETE /api/guesthouses/{id}
**Headers**: Authorization: Bearer {token}

## Endpoints Reservations

### GET /api/reservations
**Headers**: Authorization: Bearer {token}

### POST /api/reservations
**Headers**: Authorization: Bearer {token}
**Payload**:
```json
{
  "guesthouseId": "string",
  "checkInDate": "YYYY-MM-DD",
  "checkOutDate": "YYYY-MM-DD",
  "numberOfGuests": number,
  "specialRequests": "string"
}
```

## Endpoints Messages

### GET /api/messages
**Headers**: Authorization: Bearer {token}

### POST /api/messages
**Headers**: Authorization: Bearer {token}
**Payload**:
```json
{
  "receiverId": "string",
  "content": "string"
}
```

## Endpoints Reviews

### GET /api/reviews
**Headers**: Authorization: Bearer {token}

### POST /api/reviews
**Headers**: Authorization: Bearer {token}
**Payload**:
```json
{
  "guesthouseId": "string",
  "rating": number,
  "comment": "string"
}
```

## Endpoints Admin

### GET /api/admin/stats
**Headers**: Authorization: Bearer {token}
**Role**: ADMIN seulement

### GET /api/users
**Headers**: Authorization: Bearer {token}
**Role**: ADMIN seulement

## Gestion d'Erreurs

L'application gère maintenant automatiquement:
- ✅ Différentes structures de réponse JWT
- ✅ Gestion des erreurs HTTP détaillées
- ✅ Logs de debug pour diagnostiquer les problèmes
- ✅ Validation flexible des données d'authentification
- ✅ Fallback pour différents formats de token (accessToken, access_token, token)

## Démarrage

1. **Démarrer le backend Spring Boot** sur le port 8080
2. **Démarrer le frontend Next.js**: `npm run dev`
3. **Accéder à l'application**: http://localhost:3000
4. **Tester la connexion** avec les utilisateurs de votre base de données

## Debug

Les logs sont activés dans la console pour:
- Réponses d'authentification
- Erreurs d'API
- Structure des données reçues

Consultez la console du navigateur pour diagnostiquer les problèmes.
