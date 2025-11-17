// Détails complets d'un produit
export interface ProductDetails {
  name: string; // Nom commercial du produit
  category: string; // Type de produit (rouge à lèvres, fond de teint, etc.)
  shade: string; // Teinte/couleur/variante
  shadeDescription: string; // Description évocatrice de la teinte
  finish: string; // Finition (satin, matte, glossy, etc.)
  finishDescription: string; // Ce que suggère le fini
  benefit: string; // Bénéfice clé/promesse principale
  benefitTarget: string; // Pour quel type de personne/situation
  texture: string; // Texture/sensation
  application: string; // Sensation à l'application
  duration: string; // Durée moyenne d'efficacité
  resistance: string; // Résistance à certaines conditions
  positioning?: string; // Positionnement émotionnel/marketing (optionnel)
}

export interface Product {
  id: string;
  details: ProductDetails;
  image?: string; // URL ou base64 de l'image du produit
  sourceUrl?: string; // URL source si créé depuis un lien web
  sourceDocument?: {
    name: string;
    content: string; // Contenu du document en base64
    type: string; // Type MIME du document
  };
  createdAt: string;
  updatedAt: string;
}

// Détails complets d'une persona
export interface PersonaDetails {
  firstName: string; // Prénom
  age: number; // Âge approximatif
  profession: string; // Profession/domaine d'activité
  location?: string; // Lieu de vie/travail (optionnel)
  lifestyle: string; // Style de vie général
  values: string; // Valeurs ou centres d'intérêt principaux
  tone: string; // Ton de voix et manière de s'exprimer
  language: string; // Type de langage utilisé
  emotion: string; // Émotion dominante
  salesReaction: string; // Réaction face à un vendeur
  comfortFactors: string; // Ce qui met à l'aise ou freine
  propositionPreference: string; // Préférence pour peu de choix ciblés ou toutes les options
  buyingMotivation: string; // Motivation principale d'achat
  screeneProfile: string; // Profil dominant S.C.R.E.E.N.E
  screeneMotivation: string; // Motivation spécifique selon S.C.R.E.E.N.E
  buyingHabits: string; // Types de produits/marques achetés
  buyingFrequency: string; // Fréquence d'achat
  buyingLocation: string; // Où effectue les achats
  recentPurchase?: string; // Exemple d'achat récent (optionnel)
  summary?: string; // Synthèse en une phrase (optionnel)
}

export interface Persona {
  id: string;
  details: PersonaDetails;
  avatar?: string; // Image/avatar de la persona
  sourceUrl?: string; // URL source si créé depuis un lien web
  sourceDocument?: {
    name: string;
    content: string; // Contenu du document en base64
    type: string; // Type MIME du document
  };
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioStep {
  id: string;
  title: string;
  comment: string;
  tags: string[];
  order: number;
  productId?: string; // ID du produit pour les ventes additionnelles
  isAdditionalSale?: boolean; // Indique si c'est une vente additionnelle
  scoreWeight?: number; // Poids en pourcentage pour le scoring (0-100)
}

export interface TranslatedSteps {
  [languageCode: string]: ScenarioStep[]; // ex: { 'fr': [...], 'en': [...], 'es': [...] }
}

export interface AvailableLanguage {
  code: string; // ex: 'fr', 'en', 'es'
  name: string; // ex: 'Français', 'Anglais', 'Espagnol'
  flagUrl: string; // URL du drapeau
}

export interface Scenario {
  id: string;
  name: string;
  productIds: string[]; // Plusieurs produits possibles
  personaIds: string[]; // Plusieurs personas possibles
  randomizePersona: boolean; // Si true, randomise la persona à chaque partie
  steps: ScenarioStep[]; // Steps dans la langue par défaut (français)
  translatedSteps?: TranslatedSteps; // Steps traduits dans d'autres langues
  availableLanguages: AvailableLanguage[]; // Langues disponibles pour ce scénario
  currentLanguage: string; // Langue actuellement affichée (ex: 'fr', 'en')
  status: 'draft' | 'published';
  difficulty?: number; // Niveau de difficulté de 0 à 100 (0=Junior, 100=Senior)
  shareLink?: string; // Lien de partage généré
  createdAt: string;
  updatedAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface GenerationProgress {
  step: 'analyzing' | 'creating' | 'finalizing' | 'complete';
  progress: number; // 0-100
  message: string;
}

export type FileType = 'csv' | 'pdf' | 'image';

export interface UploadedFile {
  file: File;
  type: FileType;
  preview?: string;
}
