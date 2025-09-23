# Guide de contribution à CarthaTamaz

Merci de votre intérêt pour contribuer au projet CarthaTamaz ! Ce document fournit des lignes directrices pour contribuer efficacement au projet.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment puis-je contribuer ?](#comment-puis-je-contribuer)
  - [Signaler des bugs](#signaler-des-bugs)
  - [Suggérer des améliorations](#suggérer-des-améliorations)
  - [Contribuer au code](#contribuer-au-code)
- [Style de code](#style-de-code)
- [Processus de développement](#processus-de-développement)
  - [Branches](#branches)
  - [Commits](#commits)
  - [Pull Requests](#pull-requests)
- [Tests](#tests)

## Code de conduite

Ce projet et tous ses participants sont régis par notre [Code de conduite](CODE_OF_CONDUCT.md). En participant, vous êtes censé respecter ce code.

## Comment puis-je contribuer ?

### Signaler des bugs

Les bugs sont suivis comme des issues GitHub. Créez une issue et fournissez les informations suivantes :

- Utilisez un titre clair et descriptif
- Décrivez les étapes exactes pour reproduire le problème
- Décrivez le comportement observé et le comportement attendu
- Incluez des captures d'écran si possible
- Précisez votre environnement (navigateur, OS, etc.)

### Suggérer des améliorations

Les suggestions d'amélioration sont également suivies comme des issues GitHub. Incluez :

- Un titre clair et descriptif
- Une description détaillée de l'amélioration proposée
- Expliquez pourquoi cette amélioration serait utile
- Incluez des maquettes ou des exemples si possible

### Contribuer au code

1. Fork le dépôt
2. Créez une branche à partir de `main`
3. Implémentez vos changements
4. Assurez-vous que les tests passent
5. Soumettez une Pull Request

## Style de code

### Backend (Java)

- Suivez les conventions de code Java standard
- Utilisez les annotations Spring Boot de manière appropriée
- Documentez les classes et méthodes publiques avec Javadoc
- Respectez les principes SOLID

### Frontend (TypeScript/React)

- Suivez les conventions ESLint configurées dans le projet
- Utilisez les hooks React de manière appropriée
- Préférez les composants fonctionnels aux composants de classe
- Utilisez TypeScript correctement avec des types explicites

## Processus de développement

### Branches

- `main` : branche principale, toujours stable
- `develop` : branche de développement
- `feature/xxx` : pour les nouvelles fonctionnalités
- `bugfix/xxx` : pour les corrections de bugs
- `hotfix/xxx` : pour les corrections urgentes en production

### Commits

- Utilisez des messages de commit clairs et descriptifs
- Format recommandé : `type(scope): description`
  - Types : feat, fix, docs, style, refactor, test, chore
  - Exemple : `feat(auth): add password reset functionality`

### Pull Requests

- Créez des PR ciblant la branche `develop` (sauf pour les hotfixes)
- Incluez une description claire de vos changements
- Liez les issues pertinentes
- Assurez-vous que tous les tests passent
- Demandez une revue de code

## Tests

- Écrivez des tests pour tout nouveau code
- Assurez-vous que tous les tests existants passent
- Backend : utilisez JUnit et Mockito
- Frontend : utilisez Jest et React Testing Library

---

Merci de contribuer à CarthaTamaz ! Votre aide est grandement appréciée.