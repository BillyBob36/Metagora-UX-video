import { Product, Persona, Scenario, ScenarioStep, FileType, GenerationProgress } from '@/types';
import { generateId } from '@/lib/utils';

// Mock delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
export const mockProducts: Product[] = [
  {
    id: '1',
    details: {
      name: 'iPhone 15 Pro',
      category: 'Smartphone',
      shade: 'Titane Naturel',
      shadeDescription: 'Finition premium en titane',
      finish: 'Matte',
      finishDescription: 'Surface mate anti-traces',
      benefit: 'Performance ultime',
      benefitTarget: 'Professionnels et créatifs',
      texture: 'Titane brossé',
      application: 'Prise en main premium',
      duration: '24 mois',
      resistance: 'IP68, Ceramic Shield'
    },
    image: 'https://images.unsplash.com/photo-1696446702183-cbd0174e00e8?w=400',
    createdAt: '2024-09-15',
    updatedAt: '2024-09-15',
  },
  {
    id: '2',
    details: {
      name: 'Samsung Galaxy S24',
      category: 'Smartphone',
      shade: 'Phantom Black',
      shadeDescription: 'Noir profond élégant',
      finish: 'Glossy',
      finishDescription: 'Finition brillante',
      benefit: 'IA intégrée',
      benefitTarget: 'Utilisateurs tech',
      texture: 'Verre premium',
      application: 'Ergonomique',
      duration: '24 mois',
      resistance: 'IP68'
    },
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    createdAt: '2024-08-20',
    updatedAt: '2024-08-20',
  },
  {
    id: '3',
    details: {
      name: 'AirPods Pro 2',
      category: 'Audio',
      shade: 'Blanc',
      shadeDescription: 'Blanc iconique Apple',
      finish: 'Glossy',
      finishDescription: 'Finition brillante',
      benefit: 'Réduction de bruit active',
      benefitTarget: 'Audiophiles',
      texture: 'Plastique premium',
      application: 'Confortable',
      duration: '6 heures',
      resistance: 'IPX4'
    },
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    createdAt: '2024-07-10',
    updatedAt: '2024-07-10',
  },
];

export const mockPersonas: Persona[] = [
  {
    id: '1',
    details: {
      firstName: 'Marc',
      age: 35,
      profession: 'Développeur',
      lifestyle: 'Tech-savvy, early adopter',
      values: 'Innovation, performance',
      tone: 'Direct et technique',
      language: 'Jargon tech',
      emotion: 'Enthousiaste',
      salesReaction: 'Apprécie l\'expertise',
      comfortFactors: 'Données techniques',
      propositionPreference: 'Toutes les options',
      buyingMotivation: 'Dernières innovations',
      screeneProfile: 'Nouveauté',
      screeneMotivation: 'Être à la pointe',
      buyingHabits: 'High-tech premium',
      buyingFrequency: 'Régulière',
      buyingLocation: 'En ligne et boutiques spécialisées'
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    details: {
      firstName: 'Sophie',
      age: 25,
      profession: 'Étudiante',
      lifestyle: 'Découverte, prudente',
      values: 'Qualité-prix',
      tone: 'Hésitant',
      language: 'Simple',
      emotion: 'Curieuse mais prudente',
      salesReaction: 'Besoin de réassurance',
      comfortFactors: 'Accompagnement',
      propositionPreference: 'Peu de choix ciblés',
      buyingMotivation: 'Premier achat réfléchi',
      screeneProfile: 'Sécurité',
      screeneMotivation: 'Faire le bon choix',
      buyingHabits: 'Basiques',
      buyingFrequency: 'Occasionnelle',
      buyingLocation: 'Boutiques physiques'
    },
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    details: {
      firstName: 'Laurent',
      age: 42,
      profession: 'Manager',
      lifestyle: 'Professionnel, efficace',
      values: 'Productivité',
      tone: 'Pragmatique',
      language: 'Business',
      emotion: 'Orienté résultats',
      salesReaction: 'Apprécie l\'efficacité',
      comfortFactors: 'ROI et bénéfices',
      propositionPreference: 'Solutions ciblées',
      buyingMotivation: 'Efficacité professionnelle',
      screeneProfile: 'Économie',
      screeneMotivation: 'Optimiser le temps',
      buyingHabits: 'Outils professionnels',
      buyingFrequency: 'Régulière',
      buyingLocation: 'En ligne pro'
    },
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
];

// Import product from file
export async function importProduct(file: File, type: FileType): Promise<Product> {
  await delay(1500);
  
  const product: Product = {
    id: generateId(),
    details: {
      name: file.name.replace(/\.(csv|pdf|png|jpg|jpeg)$/i, ''),
      category: 'Produit importé',
      shade: 'Standard',
      shadeDescription: 'Importé depuis fichier',
      finish: 'Standard',
      finishDescription: 'À définir',
      benefit: 'À définir',
      benefitTarget: 'À définir',
      texture: 'À définir',
      application: 'À définir',
      duration: 'À définir',
      resistance: 'À définir'
    },
    image: type === 'image' 
      ? URL.createObjectURL(file)
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return product;
}

// Create persona
export async function createPersona(data: { firstName: string; age: number; profession: string }): Promise<Persona> {
  await delay(1000);
  
  const persona: Persona = {
    id: generateId(),
    details: {
      firstName: data.firstName,
      age: data.age,
      profession: data.profession,
      lifestyle: 'À définir',
      values: 'À définir',
      tone: 'À définir',
      language: 'À définir',
      emotion: 'À définir',
      salesReaction: 'À définir',
      comfortFactors: 'À définir',
      propositionPreference: 'À définir',
      buyingMotivation: 'À définir',
      screeneProfile: 'À définir',
      screeneMotivation: 'À définir',
      buyingHabits: 'À définir',
      buyingFrequency: 'À définir',
      buyingLocation: 'À définir'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return persona;
}

// Generate scenario with progress updates
export async function generateScenario(
  productId: string,
  personaId: string,
  onProgress: (progress: GenerationProgress) => void
): Promise<Scenario> {
  // Step 1: Analyzing
  onProgress({
    step: 'analyzing',
    progress: 0,
    message: 'Analyse du produit en cours...',
  });
  await delay(1000);
  
  onProgress({
    step: 'analyzing',
    progress: 33,
    message: 'Analyse des caractéristiques du persona...',
  });
  await delay(1000);
  
  // Step 2: Creating
  onProgress({
    step: 'creating',
    progress: 50,
    message: 'Création du scénario pédagogique...',
  });
  await delay(1500);
  
  onProgress({
    step: 'creating',
    progress: 70,
    message: 'Génération des étapes de vente...',
  });
  await delay(1000);
  
  // Step 3: Finalizing
  onProgress({
    step: 'finalizing',
    progress: 85,
    message: 'Finalisation et optimisation...',
  });
  await delay(800);
  
  onProgress({
    step: 'finalizing',
    progress: 95,
    message: 'Ajout des bonnes pratiques...',
  });
  await delay(500);
  
  // Complete
  onProgress({
    step: 'complete',
    progress: 100,
    message: 'Scénario généré avec succès !',
  });
  
  const steps: ScenarioStep[] = [
    {
      id: generateId(),
      title: 'Accueil',
      comment: 'Créer un premier contact chaleureux et professionnel',
      tags: ['Sourire', 'Contact visuel', 'Salutation'],
      order: 0,
    },
    {
      id: generateId(),
      title: 'Découverte des besoins',
      comment: 'Poser des questions ouvertes pour comprendre les attentes',
      tags: ['Écoute active', 'Questions ouvertes', 'Reformulation'],
      order: 1,
    },
    {
      id: generateId(),
      title: 'Présentation produit',
      comment: 'Mettre en avant les bénéfices adaptés au client',
      tags: ['Démonstration', 'Bénéfices', 'Personnalisation'],
      order: 2,
    },
    {
      id: generateId(),
      title: 'Traitement des objections',
      comment: 'Répondre aux préoccupations avec empathie',
      tags: ['Empathie', 'Arguments', 'Rassurance'],
      order: 3,
    },
    {
      id: generateId(),
      title: 'Conclusion',
      comment: 'Finaliser la vente et assurer le suivi',
      tags: ['Closing', 'Services', 'Fidélisation'],
      order: 4,
    },
  ];
  
  const scenario: Scenario = {
    id: generateId(),
    name: `Scénario - ${new Date().toLocaleDateString('fr-FR')}`,
    productIds: [productId],
    personaIds: [personaId],
    randomizePersona: false,
    steps,
    availableLanguages: [{
      code: 'fr',
      name: 'Français',
      flagUrl: 'https://flagcdn.com/w40/fr.png'
    }],
    currentLanguage: 'fr',
    difficulty: 3,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return scenario;
}

// Get AI suggestions for scenario
export async function getAISuggestions(_scenarioId: string): Promise<string[]> {
  await delay(500);
  
  return [
    'Utilisez des questions ouvertes pour engager le client',
    'Adaptez votre discours au niveau de connaissance du client',
    'Mettez en avant 3 bénéfices maximum pour ne pas surcharger',
    'Pratiquez l\'écoute active et reformulez les besoins',
    'Proposez toujours une alternative en cas d\'objection',
  ];
}

// Adapt scenario for difficulty
export function adaptScenarioForDifficulty(scenario: Scenario, difficulty: number): Scenario {
  const adapted = { ...scenario, difficulty };
  
  // Adjust steps complexity based on difficulty
  if (difficulty <= 2) {
    // Junior: More guidance
    adapted.steps = adapted.steps.map(step => ({
      ...step,
      comment: `[Junior] ${step.comment} - Suivez le script fourni`,
    }));
  } else if (difficulty >= 4) {
    // Senior: More autonomy
    adapted.steps = adapted.steps.map(step => ({
      ...step,
      comment: `[Senior] ${step.comment} - Adaptez selon le contexte`,
    }));
  }
  
  return adapted;
}
