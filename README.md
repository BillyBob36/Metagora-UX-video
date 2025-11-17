# Metagora - Plateforme de Création de Scénarios de Formation

Plateforme web pour créer et gérer des scénarios de formation pour vos équipes de vente avec l'aide de l'IA.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

## 📋 Fonctionnalités

### 🎯 Onglet Scénarios
- Création de scénarios de formation personnalisés
- Sélection de produits et personas pour chaque scénario
- Option de randomisation des personas pour varier l'entraînement
- Génération automatique des étapes de vente par IA
- Partage de scénarios via lien
- Modification et suppression de scénarios

### 📦 Onglet Produits
- Création de fiches produits détaillées (8 sections)
- **3 modes de création** :
  - Remplissage manuel
  - Extraction depuis documents (PDF, TXT)
  - **Extraction depuis URL** (page produit sur site marchand)
- Informations complètes : nom, catégorie, teinte, finition, bénéfices, texture, durée, positionnement
- Gestion et modification des produits existants

### 👥 Onglet Personas
- Création de profils clients détaillés (7 sections)
- **3 modes de création** :
  - Remplissage manuel
  - Extraction depuis documents (PDF, TXT)
  - **Extraction depuis URL** (article, étude de cas, profil client)
- Profil S.C.R.E.E.N.E pour analyse comportementale
- Informations complètes : identité, style de vie, comportement d'achat, motivations
- Gestion et modification des personas existantes

### 🤖 Intelligence Artificielle
- Extraction automatique d'informations depuis documents (OpenAI GPT-4)
- **Extraction depuis URLs** : Analyse de pages web pour créer produits et personas
- Génération de scénarios de vente adaptés aux produits et personas
- Création d'étapes de formation cohérentes et pédagogiques

## 🛠️ Stack technique

- **React 18** + **TypeScript**
- **Vite** pour le build
- **TailwindCSS** pour le styling
- **Zustand** pour la gestion d'état
- **dnd-kit** pour le drag & drop
- **Lucide React** pour les icônes
- **React Router** pour la navigation

## 📁 Structure du projet

```
src/
├── components/
│   ├── tabs/           # Onglets principaux (Scénarios, Produits, Personas)
│   ├── modals/         # Modales de création/édition
│   └── ui/             # Composants UI réutilisables
├── pages/
│   ├── Dashboard.tsx   # Page principale avec navigation par onglets
│   └── ScenarioEditor.tsx  # Éditeur de scénario
├── services/
│   └── openai.ts       # Intégration API OpenAI
├── store/
│   └── useStore.ts     # Store Zustand global
├── types/
│   └── index.ts        # Types TypeScript
└── styles/             # Styles globaux
```

## 🎨 Design

Interface responsive avec navigation par onglets, cartes modernes, et expérience utilisateur guidée pour les non-experts.

## 🔑 Configuration

### API OpenAI
L'application utilise l'API OpenAI pour l'extraction de données et la génération de scénarios. 
La clé API est actuellement codée dans `src/services/openai.ts`.

**⚠️ Important pour la production :** Déplacez la clé API vers une variable d'environnement :
1. Créez un fichier `.env` à la racine
2. Ajoutez : `VITE_OPENAI_API_KEY=votre_clé`
3. Utilisez : `import.meta.env.VITE_OPENAI_API_KEY`

## 📝 Guide d'utilisation

1. **Créer des produits** : Allez dans l'onglet "Produits" et créez vos fiches produits
2. **Créer des personas** : Allez dans l'onglet "Personas clients" et créez vos profils clients
3. **Créer un scénario** : Dans l'onglet "Mes scénarios", cliquez sur "Créer un nouveau scénario"
   - Sélectionnez les produits à vendre
   - Sélectionnez les personas clients
   - Nommez votre scénario
   - Laissez l'IA générer les étapes
4. **Partager** : Utilisez le bouton "Partager" pour obtenir un lien de partage
