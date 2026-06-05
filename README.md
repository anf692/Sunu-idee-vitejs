# 💡 Sunu-Idées

## Description
**Sunu-Idées** est une boîte à idées numérique, anonyme et collaborative
permettant aux apprenants de proposer, consulter, modifier et supprimer
des idées en temps réel. Les données sont stockées dans le cloud via
**Supabase**. L'application utilise **OpenRouter (Mistral 7B)** pour
suggérer automatiquement la catégorie et la description d'une idée.
Le projet est construit avec **Vite.js** et suit une architecture
modulaire propre.

---

## Lien de déploiement
[Voir l'application](https://sunu-idee-vitejs.vercel.app/)

---

## Technologies utilisées
- HTML5 sémantique
- CSS3 + Bootstrap 5
- JavaScript ES6+ (Vanilla JS)
- Supabase (base de données cloud)
- OpenRouter API (IA - Mistral 7B gratuit)
- Vercel (déploiement + proxy API)

---

## Fonctionnalités
- ➕ Soumettre une idée anonymement
- 👁️ Afficher toutes les idées de la promo en temps réel
- ✏️ Modifier une idée existante
- 🗑️ Supprimer une idée
- 🤖 Suggestion automatique par IA (catégorie + description)
- 🔄 Zéro rechargement de page (SPA)

---

## Intelligence Artificielle
L'application interroge **OpenRouter** (modèle `mistralai/mistral-7b-instruct:free`) 
à partir du titre saisi. L'IA suggère automatiquement :
- La catégorie la plus adaptée
- Une description en 2 phrases

En cas d'indisponibilité de l'IA, un **fallback automatique** attribue 
la catégorie "Amélioration technique".

---

## Base de données Supabase
Les idées sont stockées dans une table `idees` avec :
- `id` — identifiant unique auto-généré
- `titre` — titre de l'idée
- `categorie` — catégorie assignée
- `description` — description détaillée
- `created_at` — date de création

---

## Sécurité
- Clés API isolées dans un fichier **`.env`**
- Proxy serverless Vercel pour ___
- Variables `VITE_` pour ___
- Sanitisation des entrées utilisateur contre ___

---

## Structure du projet
```text
sunu-idees/
│
├── api/                
│   └── ai.js              
│
├── src/                
│   ├── services/
│   │   ├── supabase.js  
│   │   └── openrouter.js  
│   └── utils/
│       ├── validation.js
│       └── sanitize.js
│
├── main.js
├── index.html
└── style.css
```
---

## Installation
```bash
# 1. Cloner le projet
https://github.com/anf692/Sunu-idee-vitejs.git

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env
cp .env.example .env
# Remplis les variables dans .env

# 4. Lancer en développement
npm run dev

---

## Variables d'environnement
```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
```

---

## Auteurs
__ M. Assane Ndong FALL__
Projet réalisé dans le cadre de la formation 
Développeur Web / Web Mobile + IA chez Simplon.
