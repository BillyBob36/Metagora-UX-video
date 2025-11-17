# Workflows de l'Application Metagora

## 🎯 Workflow de Création de Scénario

### Étape 1 : Sélection des Produits
1. L'utilisateur clique sur "Créer un nouveau scénario"
2. Si aucun produit n'existe :
   - Message : "Aucun produit n'a encore été créé"
   - Proposition de créer un produit
   - Redirection vers l'onglet Produits
3. Si des produits existent :
   - Affichage de la liste des produits disponibles
   - Sélection d'un ou plusieurs produits (checkbox)
   - Message didactique : "Sélectionnez le ou les produits que les vendeurs doivent essayer de vendre dans votre scénario"

### Étape 2 : Sélection des Personas
1. Si aucune persona n'existe :
   - Message : "Aucune persona n'a encore été créée"
   - Proposition de créer une persona
   - Redirection vers l'onglet Personas
2. Si des personas existent :
   - Affichage de la liste des personas disponibles
   - Sélection d'une ou plusieurs personas (checkbox)
   - Message didactique : "Sélectionnez la ou les personas clients auxquels vos vendeurs seront confrontés dans votre scénario"
3. Si plusieurs personas sélectionnées :
   - Option "Randomiser la persona" devient disponible
   - Permet de varier la persona à chaque nouvelle partie

### Étape 3 : Nom du Scénario
1. L'utilisateur donne un nom au scénario
2. Récapitulatif affiché :
   - Nombre de produits sélectionnés
   - Nombre de personas sélectionnées
   - État de la randomisation

### Étape 4 : Génération
1. Appel à l'API OpenAI avec :
   - Détails des produits sélectionnés
   - Détails des personas sélectionnées
2. Affichage d'une barre de progression
3. Génération de 5-8 étapes de vente :
   - Accueil et découverte du besoin
   - Écoute active et questionnement
   - Présentation du produit adaptée
   - Gestion des objections
   - Conclusion de la vente
4. Création du scénario dans le store
5. Redirection vers l'éditeur de scénario

## 📦 Workflow de Création de Produit

### Mode 1 : Remplissage Manuel
1. Clic sur "Remplir manuellement"
2. Formulaire avec 8 sections :
   - Nom du produit (requis)
   - Catégorie/Type (requis)
   - Teinte/Couleur/Variante
   - Description évocatrice de la teinte
   - Finition/Aspect visuel
   - Ce que suggère le fini
   - Bénéfice clé/Promesse
   - Pour quel type de personne/situation
   - Texture/Sensation
   - Sensation à l'application
   - Durée/Tenue
   - Résistance
   - Positionnement émotionnel (optionnel)
3. Validation et sauvegarde

### Mode 2 : Extraction depuis Documents
1. Clic sur "Depuis mes documents"
2. Upload de fichiers (PDF, TXT)
3. Appel à l'API OpenAI pour extraction
4. Pré-remplissage automatique du formulaire
5. Possibilité de modifier les informations extraites
6. Validation et sauvegarde

### Mode 3 : Extraction depuis URL
1. Clic sur "Depuis un lien web"
2. Saisie de l'URL d'une page produit (site marchand)
3. Validation de l'URL
4. Appel à l'API OpenAI pour extraction depuis l'URL
5. Pré-remplissage automatique du formulaire
6. Possibilité de modifier les informations extraites
7. Validation et sauvegarde

## 👥 Workflow de Création de Persona

### Mode 1 : Remplissage Manuel
1. Clic sur "Remplir manuellement"
2. Formulaire avec 7 sections :
   - **Identification** : Prénom, âge, profession, lieu
   - **Contexte personnel** : Style de vie, valeurs
   - **Ton et personnalité** : Ton de voix, langage, émotion
   - **Comportement vente** : Réaction vendeur, facteurs confort, préférences
   - **Profil S.C.R.E.E.N.E** : Profil dominant, motivation
   - **Habitudes d'achat** : Produits achetés, fréquence, lieu
   - **Synthèse** : Description en une phrase (optionnel)
3. Validation et sauvegarde

### Mode 2 : Extraction depuis Documents
1. Clic sur "Depuis mes documents"
2. Upload de fichiers (PDF, TXT)
3. Appel à l'API OpenAI pour extraction
4. Pré-remplissage automatique du formulaire
5. Possibilité de modifier les informations extraites
6. Validation et sauvegarde

### Mode 3 : Extraction depuis URL
1. Clic sur "Depuis un lien web"
2. Saisie de l'URL d'un article, étude de cas ou profil client
3. Validation de l'URL
4. Appel à l'API OpenAI pour extraction depuis l'URL
5. Pré-remplissage automatique du formulaire
6. Possibilité de modifier les informations extraites
7. Validation et sauvegarde

## 🔄 Workflow de Modification de Scénario

1. Clic sur "Modifier le scénario" depuis la liste
2. Modal avec deux sections :
   - **Produits** : Modification de la sélection
   - **Personas** : Modification de la sélection et randomisation
3. Sauvegarde des modifications
4. Les étapes générées restent inchangées (modification manuelle dans l'éditeur)

## 🔗 Workflow de Partage de Scénario

1. Clic sur "Partager le scénario"
2. Génération automatique d'un lien unique
3. Affichage du lien avec bouton "Copier"
4. Informations sur le partage :
   - Accès en lecture seule
   - Révocation possible en supprimant le scénario
5. Avertissement si le scénario est en brouillon

## 🎨 Principes UX

### Messages Didactiques
Tous les écrans incluent des messages clairs et concis pour guider l'utilisateur :
- "Sélectionnez le ou les produits que les vendeurs doivent essayer de vendre"
- "Sélectionnez la ou les personas clients auxquels vos vendeurs seront confrontés"
- Instructions contextuelles pour chaque champ de formulaire

### États Vides
Chaque onglet gère l'état vide avec :
- Icône illustrative
- Message explicatif
- Bouton d'action principal bien visible
- Exemple : "Aucun scénario pour le moment" avec CTA "Créer mon premier scénario"

### Feedback Utilisateur
- Toasts de confirmation pour chaque action
- Barres de progression pour les opérations longues
- États de chargement explicites
- Messages d'erreur clairs et actionnables

### Navigation Fluide
- Redirection automatique vers les onglets nécessaires
- Breadcrumb dans les modals multi-étapes
- Boutons "Retour" et "Suivant" toujours visibles
- Possibilité d'annuler à tout moment
