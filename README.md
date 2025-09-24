# CarthaTamaz Frontend

Plateforme de réservation d’hébergements (Next.js + TypeScript + Tailwind CSS)

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

- `/app` : Pages et routes Next.js (App Router)
- `/components` : Composants réutilisables (UI, admin, auth, etc.)
- `/hooks` : Hooks personnalisés
- `/lib` : Fonctions utilitaires
- `/public` : Images et assets statiques
- `/styles` : Fichiers CSS globaux

## Connexion au backend

- Le frontend communique avec un backend Spring Boot (API REST, JWT).
- Modifier l’URL de l’API dans les services si besoin.

## Scripts utiles

- `npm run dev` : Démarrage en mode développement
- `npm run build` : Build de production
- `npm run start` : Lancer le serveur en production

## Contribution

1. Fork le repo
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit tes changements
4. Push la branche et ouvre une Pull Request

## Licence

MIT
