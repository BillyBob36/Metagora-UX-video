import { Product, Persona, Scenario, ScenarioStep, FileType, GenerationProgress } from '@/types';
import { generateId } from '@/lib/utils';

// Mock delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1696446702183-cbd0174e00e8?w=400',
    tags: ['Smartphone', 'Premium', 'Apple'],
    date: '2024-09-15',
    description: 'Le dernier smartphone Apple avec puce A17 Pro',
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    tags: ['Smartphone', 'Android', 'Samsung'],
    date: '2024-08-20',
    description: 'Flagship Samsung avec IA intégrée',
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
    tags: ['Audio', 'Sans-fil', 'Apple'],
    date: '2024-07-10',
    description: 'Écouteurs avec réduction de bruit active',
  },
];

export const mockPersonas: Persona[] = [
  {
    id: '1',
    name: 'Client Tech-Savvy',
    description: 'Connaît bien la technologie, cherche les dernières innovations',
    level: 'senior',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Premier Acheteur',
    description: 'Première expérience d\'achat, besoin d\'accompagnement',
    level: 'junior',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Client Professionnel',
    description: 'Recherche efficacité et productivité',
    level: 'intermediate',
    createdAt: '2024-02-01',
  },
];

// Import product from file
export async function importProduct(file: File, type: FileType): Promise<Product> {
  await delay(1500);
  
  const product: Product = {
    id: generateId(),
    name: file.name.replace(/\.(csv|pdf|png|jpg|jpeg)$/i, ''),
    image: type === 'image' 
      ? URL.createObjectURL(file)
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    tags: ['Nouveau', 'Import'],
    date: new Date().toISOString(),
    description: `Produit importé depuis ${type.toUpperCase()}`,
  };
  
  return product;
}

// Create persona
export async function createPersona(data: { name: string; description: string; level: 'junior' | 'intermediate' | 'senior' }): Promise<Persona> {
  await delay(1000);
  
  const persona: Persona = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
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
    productId,
    personaId,
    steps,
    difficulty: 3,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return scenario;
}

// Get AI suggestions for scenario
export async function getAISuggestions(scenarioId: string): Promise<string[]> {
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
