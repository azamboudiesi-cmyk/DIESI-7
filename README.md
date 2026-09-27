# TechInterviews — Version 2

> **"Entraîne-toi aux entretiens techniques."**  
> Plateforme intelligente de simulation d'entretiens d'embauche techniques propulsée par **Google Gemini**.

---

## 1. Présentation

**TechInterviews V2** est une application web conçue pour les élèves, étudiants, développeurs débutants et personnes en reconversion ou en perfectionnement qui souhaitent réussir leurs entretiens techniques.

L'application permet de :
1. Choisir un domaine technique parmi **9 spécialités informatiques** ;
2. Définir son niveau d'expérience (**Débutant**, **Intermédiaire**, **Avancé**) ;
3. Sélectionner son format d'entraînement (**Mode Entraînement** ou **Mode Simulation**) ;
4. Générer des questions réalistes et adaptatives avec **Google Gemini** ;
5. Rédiger ses réponses et recevoir une évaluation instantanée et objective notée sur 100 ;
6. Analyser ses points forts, ses omissions et recevoir des conseils d'amélioration concrets ;
7. Suivre sa progression globale au fil du temps sur un **Tableau de Bord interactif** ;
8. Consulter son **Historique complet** et filtrer ses anciens tests ;
9. Mettre des questions clés en **Favoris** pour des révisions ciblées ;
10. Bénéficier du **Mode Révision** pour retravailler ses erreurs fréquentes.

---

## 2. Fonctionnalités de la V2

- **Authentification Sécurisée** : Inscription, Connexion, Session chiffrée, Hachage des mots de passe avec HMAC-SHA256 & sel cryptographique.
- **Compte Démo en 1 Clic** : Profil de démonstration pré-rempli (`alex@techinterviews.io`) avec historique réaliste, graphiques et recommandations.
- **Intelligence Artificielle Google Gemini** :
  - Génération de questions techniques adaptées au niveau.
  - Évaluation approfondie des réponses (Score 0-100, Points forts, Faiblesses, Explications, Conseils).
  - Recommandations pédagogiques personnalisées basées sur l'historique.
  - Validation stricte des flux IA avec **Zod**.
- **Difficulté Adaptative** : Le système adapte la subtilité et la profondeur des questions posées selon les notes récentes de l'apprenant.
- **Mode Entraînement** : Feedback immédiat question par question pour apprendre pas à pas.
- **Mode Simulation** : Immersion en conditions réelles avec bilan complet délivré à la fin de la session.
- **Tableau de Bord & Métriques** :
  - Graphique interactif SVG d'évolution du score dans le temps.
  - Taux de réussite et moyenne par domaine technique.
  - Taux de réussite et moyenne par niveau.
  - Recommandations ciblées d'entraînement.
- **Système de Favoris** : Sauvegarde des questions difficiles pour les réviser ultérieurement.
- **Mode Révision** : Identification automatique des questions avec un score inférieur à 75/100 pour s'entraîner à nouveau.
- **Profil Utilisateur** : Suivi des statistiques personnelles et mise à jour du profil.
- **Design & Responsive** : Conçu avec **Tailwind CSS**, entièrement utilisable sur mobile, tablette et desktop.

---

## 3. Technologies Utilisées

- **Frontend** : React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend** : Node.js, Express, Middleware Vite pour le développement unifié full-stack.
- **Intelligence Artificielle** : SDK officiel `@google/genai` (modèle `gemini-3.8-flash`).
- **Validation** : Zod (validation des schémas de génération, d'évaluation et d'authentification).
- **Persistance** :
  - Moteur local transactionnel intégré (zéro configuration externe requise).
  - Schéma **Prisma** (`prisma/schema.prisma`) prêt pour PostgreSQL (Vercel Postgres, Neon, Supabase, Cloud SQL).

---

## 4. Domaines Techniques

L'application couvre 9 domaines techniques extensibles :
1. **Développement Web** (HTML5, CSS3, DOM, Responsive, REST, a11y)
2. **JavaScript** (ES6+, Closures, Event Loop, Promises, Async/Await)
3. **Python** (OOP, Générateurs, Décorateurs, GIL, Asyncio)
4. **Java** (JVM, POO, Garbage Collection, Streams, Concurrency)
5. **C/C++** (Pointeurs, Gestion mémoire, RAII, Smart Pointers, STL)
6. **Bases de données** (SQL, ACID, Index B-Tree, Jointures, Problème N+1)
7. **Réseaux** (Modèle OSI, TCP/UDP, DNS, HTTPS/TLS, HTTP/3)
8. **Cybersécurité** (OWASP Top 10, XSS, CSRF, Injections SQL, Hachage)
9. **Algorithmique** (Big-O, Recherche binaire, Arbres, DFS/BFS, Dynamic Programming)

---

## 5. Installation et Démarrage Local

### Prérequis
- Node.js (version 18+ ou 20+ recommandée)
- npm ou pnpm

### Étape 1 : Cloner le dépôt et installer les dépendances

```bash
git clone https://github.com/votre-compte/techinterviews.git
cd techinterviews
npm install
```

### Étape 2 : Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Clé API Google Gemini (obligatoire pour la génération et l'évaluation IA)
GEMINI_API_KEY="votre_cle_gemini_ici"

# Port du serveur de développement (par défaut : 3000)
PORT=3000

# URL de la base de données PostgreSQL (optionnel en local, recommandé sur Vercel)
# DATABASE_URL="postgresql://user:password@host:5432/techinterviews"

# Secret d'authentification pour JWT / Sessions
AUTH_SECRET="votre_secret_aleatoire_de_production"
```

### Étape 3 : Lancer l'application en mode développement

```bash
npm run dev
```

L'application démarre sur : **`http://localhost:3000`**

---

## 6. Variables d'Environnement

| Variable | Description | Requis |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Clé API Google Gemini générée sur Google AI Studio | **Oui** |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL (pour Prisma / Vercel Postgres) | Optionnel en dev |
| `AUTH_SECRET` | Chaîne secrète pour sécuriser les tokens et sessions | Recommandé en prod |
| `PORT` | Port d'écoute du serveur Node.js (par défaut `3000`) | Non (auto) |

---

## 7. Versionnement Git & Publication sur GitHub

Pour initialiser le projet et l'envoyer sur GitHub :

```bash
# 1. Initialiser le dépôt git local
git init

# 2. Ajouter tous les fichiers du projet
git add .

# 3. Créer le commit initial
git commit -m "Initial commit: TechInterviews V2 complete platform"

# 4. Renommer la branche par défaut en main
git branch -M main

# 5. Lier au repository distant GitHub
git remote add origin https://github.com/VOTRE_UTILISATEUR/techinterviews.git

# 6. Pousser vers GitHub
git push -u origin main
```

---

## 8. Déploiement sur Vercel

### Étape 1 : Importer le dépôt sur Vercel
1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez-vous avec votre compte GitHub.
2. Cliquez sur **"Add New..."** puis sur **"Project"**.
3. Sélectionnez le dépôt `techinterviews` et cliquez sur **"Import"**.

### Étape 2 : Configurer les Variables d'Environnement
Dans la section **"Environment Variables"** de votre projet Vercel :
1. Ajoutez `GEMINI_API_KEY` avec votre clé issue de Google AI Studio.
2. Ajoutez `AUTH_SECRET` avec une chaîne aléatoire sécurisée.
3. Si vous utilisez **Vercel Postgres** ou **Neon**, associez la base de données dans l'onglet **Storage** de Vercel (la variable `DATABASE_URL` sera alors injectée automatiquement).

### Étape 3 : Lancer le Déploiement
1. Cliquez sur **"Deploy"**.
2. Vercel compile l'application et vous fournit une URL HTTPS sécurisée en quelques secondes.

---

## 9. Sécurité

- La clé `GEMINI_API_KEY` n'est **JAMAIS exposée côté client**.
- Tous les appels vers l'API Gemini transitent exclusivement par les routes serveurs `/api/interviews/generate` et `/api/interviews/evaluate`.
- Les mots de passe sont hachés de manière irréversible avec sel cryptographique.
- Les données d'entrée utilisateur et les réponses IA sont strictement validées par **Zod**.

---

## 10. Licence

Ce projet est sous licence MIT.
