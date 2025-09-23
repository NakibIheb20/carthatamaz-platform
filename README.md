# CarthaTamaz – Plateforme de réservation d'hébergements

CarthaTamaz est une plateforme complète de réservation de maisons d'hôtes, villas et appartements, composée d'un backend Spring Boot (Java/MongoDB) et d'un frontend Next.js (TypeScript/Tailwind CSS). Cette solution permet aux propriétaires de gérer leurs hébergements et aux voyageurs de réserver facilement leur séjour.

![CarthaTamaz Platform](https://placeholder.com/carthatamazplatform) <!-- Remplacer par une capture d'écran réelle -->

## 📋 Table des matières

- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Architecture technique](#architecture-technique)
- [Installation et démarrage](#installation-et-démarrage)
- [API et intégration](#api-et-intégration)
- [Intelligence artificielle](#intelligence-artificielle)
- [Sécurité](#sécurité)
- [Contribution](#contribution)
- [Licence](#licence)

## 🏗️ Structure du projet

Le projet est organisé en deux parties principales :

### Backend (Spring Boot)
```
CarthaTamaz-backend/
├── src/main/java/com/carthatamaz/
│   ├── controller/       # Contrôleurs REST API
│   ├── service/          # Logique métier
│   ├── repository/       # Accès aux données
│   ├── entity/           # Modèles de données
│   ├── dto/              # Objets de transfert de données
│   ├── config/           # Configuration Spring
│   ├── security/         # Sécurité et JWT
│   └── util/             # Classes utilitaires
├── src/main/resources/   # Configuration, propriétés
└── src/test/            # Tests unitaires et d'intégration
```

### Frontend (Next.js)
```
carthatamaz-frontend/
├── app/                 # Pages et routes Next.js
├── components/          # Composants React réutilisables
├── contexts/            # Contextes React (auth, etc.)
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires et API client
├── public/              # Ressources statiques
├── styles/              # Styles CSS et Tailwind
└── types/               # Types TypeScript
```

## ✨ Fonctionnalités

### Pour les voyageurs (GUEST)
- Recherche d'hébergements avec filtres avancés
- Réservation en ligne avec calendrier de disponibilité
- Messagerie avec les propriétaires
- Gestion des réservations et historique
- Système d'avis et de notation

### Pour les propriétaires (OWNER)
- Création et gestion d'hébergements
- Gestion du calendrier et des disponibilités
- Traitement des demandes de réservation
- Communication avec les voyageurs
- Tableau de bord analytique

### Pour les administrateurs (ADMIN)
- Gestion complète des utilisateurs
- Modération des avis et contenus
- Statistiques et rapports
- Configuration système

## 🔧 Architecture technique

### Backend
- **Framework**: Spring Boot 3.x
- **Langage**: Java 17
- **Base de données**: MongoDB
- **Sécurité**: Spring Security avec JWT
- **Documentation API**: Swagger/OpenAPI
- **Tests**: JUnit, Mockito

### Frontend
- **Framework**: Next.js 14 (React)
- **Langage**: TypeScript
- **Styles**: Tailwind CSS
- **État**: React Context API
- **Requêtes API**: Fetch API avec wrapper personnalisé
- **Validation**: Zod

## 🚀 Installation et démarrage

### Prérequis
- Node.js >= 18
- Java 17
- Maven
- MongoDB (ou Docker)

### Avec Docker (recommandé)
```bash
# À la racine du projet
docker-compose -f docker-compose.yml up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html

### Installation manuelle

#### Backend
```bash
cd CarthaTamaz-backend

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Lancer l'application
./mvnw spring-boot:run   # Linux/Mac
mvnw.cmd spring-boot:run # Windows
```

#### Frontend
```bash
cd carthatamaz-frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos paramètres

# Lancer en développement
npm run dev

# Ou construire pour production
npm run build
npm start
```

## 🔌 API et intégration

Le backend expose une API REST complète avec les endpoints suivants :

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/forgot-password` - Récupération de mot de passe
- `POST /api/auth/reset-password` - Réinitialisation de mot de passe

### Guesthouses (Hébergements)
- `GET /api/guest/guesthouses` - Liste des hébergements (public)
- `GET /api/guest/guesthouses/{id}` - Détails d'un hébergement (public)
- `POST /api/owner/guesthouses` - Création d'hébergement (propriétaire)
- `PUT /api/owner/guesthouses/{id}` - Mise à jour d'hébergement (propriétaire)
- `DELETE /api/owner/guesthouses/{id}` - Suppression d'hébergement (propriétaire)

### Réservations
- `GET /api/guest/reservations` - Réservations de l'utilisateur
- `POST /api/guest/reservations` - Créer une réservation
- `GET /api/owner/reservations` - Réservations reçues (propriétaire)
- `PUT /api/owner/reservations/{id}/confirm` - Confirmer une réservation
- `PUT /api/owner/reservations/{id}/reject` - Rejeter une réservation

### Messagerie
- `GET /api/messages/conversations` - Conversations de l'utilisateur
- `GET /api/messages/with/{userId}` - Messages avec un utilisateur
- `POST /api/messages` - Envoyer un message

Pour plus de détails, consultez la documentation complète dans [API_INTEGRATION_FIXES.md](./API_INTEGRATION_FIXES.md) et [ENDPOINTS_BACKEND.md](./carthatamaz-frontend/ENDPOINTS_BACKEND.md).

## 🧠 Intelligence artificielle

CarthaTamaz intègre plusieurs fonctionnalités d'IA pour améliorer l'expérience utilisateur :

### Système de recommandation
Le système analyse les préférences utilisateur, l'historique de navigation et les réservations précédentes pour suggérer des hébergements pertinents.

```
Endpoints:
- GET /api/guest/recommendations
- GET /api/guest/recommendations/similar/{guesthouseId}
```

### Chatbot assistant
Un assistant conversationnel aide les utilisateurs à naviguer sur la plateforme, répond aux questions fréquentes et facilite le processus de réservation.

```
Fonctionnalités:
- Réponses aux questions sur les hébergements
- Aide à la recherche et au filtrage
- Assistance pour la réservation
- Support utilisateur de premier niveau
```

## 🔒 Sécurité

- **Authentification**: JWT (JSON Web Tokens)
- **Autorisation**: Contrôle d'accès basé sur les rôles (RBAC)
- **Protection CSRF**: Implémentée côté serveur
- **Validation des entrées**: Côté client et serveur
- **Gestion des sessions**: Expiration des tokens, refresh tokens
- **Stockage sécurisé**: Hachage des mots de passe avec BCrypt

## 👥 Contribution

Nous accueillons les contributions à ce projet. Pour contribuer :

1. Fork le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

## 📞 Contact et support

Pour toute question ou assistance, veuillez contacter l'équipe CarthaTamaz :
- Email: support@carthatamaz.com
- Site web: https://carthatamaz.com

---

Développé avec ❤️ par l'équipe CarthaTamaz