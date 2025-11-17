import { ProductDetails, PersonaDetails, ScenarioStep } from '@/types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Fonction utilitaire pour lire le contenu d'un fichier texte
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function extractProductFromUrl(url: string): Promise<ProductDetails> {
  try {
    console.log('Analyse de l\'URL du produit...');
    
    // Analyser l'URL directement avec l'IA (sans scraping qui est souvent bloqué)
    const prompt = `Tu es un expert en analyse de produits cosmétiques et beauté.

Analyse cette URL de produit et extrait/infère intelligemment les informations du produit :

URL: ${url}

Instructions :
1. Analyse l'URL en détail : nom de domaine, chemin, paramètres, mots-clés
2. Utilise tes connaissances sur les produits cosmétiques pour inférer les informations
3. Si l'URL contient des indices (noms, couleurs, types), utilise-les
4. Crée un profil produit cohérent et réaliste basé sur l'URL et le contexte

Réponds UNIQUEMENT avec un objet JSON valide contenant ces champs :
{
  "name": "Nom commercial du produit (extrait de l'URL si possible)",
  "category": "Type de produit (ex: rouge à lèvres, fond de teint, parfum)",
  "shade": "Teinte/couleur/variante principale",
  "shadeDescription": "Description évocatrice de la teinte",
  "finish": "Finition/aspect visuel (ex: satin, matte, glossy)",
  "finishDescription": "Ce que suggère ce fini",
  "benefit": "Bénéfice clé du produit",
  "benefitTarget": "Pour quel type de personne/situation",
  "texture": "Texture/sensation",
  "application": "Sensation à l'application",
  "duration": "Durée/tenue (ex: 6-8 heures)",
  "resistance": "Résistance (ex: transfert, chaleur, humidité)",
  "positioning": "Positionnement émotionnel/univers"
}

Sois créatif et précis. Base-toi sur l'URL et tes connaissances des produits similaires.`;

    // Utiliser le proxy Vite en dev, API directe en production
    const isDev = import.meta.env.DEV;
    const openaiUrl = isDev 
      ? '/api/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en produits cosmétiques. Tu réponds uniquement en JSON valide, sans texte supplémentaire.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur OpenAI:', errorText);
      throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    console.log('Extraction réussie!');
    return extractedData as ProductDetails;
  } catch (error) {
    console.error('Erreur lors de l\'extraction depuis URL:', error);
    throw error;
  }
}

export async function extractProductFromDocuments(files: File[]): Promise<ProductDetails> {
  try {
    console.log('Lecture du fichier produit...');
    
    // Lire le contenu du premier fichier
    const firstFile = files[0];
    const fileContent = await readFileAsText(firstFile);
    
    // Limiter à 4000 caractères pour ne pas dépasser les limites de l'API
    const truncatedContent = fileContent.substring(0, 4000);
    
    console.log('Analyse du contenu par l\'IA...');
    
    const prompt = `Tu es un expert en analyse de produits cosmétiques et beauté.

Analyse le contenu de ce document et extrait les informations du produit :

CONTENU DU DOCUMENT:
${truncatedContent}

Instructions :
1. Lis attentivement le contenu du document
2. Extrait toutes les informations pertinentes sur le produit
3. Si certaines informations manquent, infère-les de manière cohérente avec le contexte
4. Crée une fiche produit complète et détaillée

Réponds UNIQUEMENT avec un objet JSON valide contenant ces champs :
{
  "name": "Nom commercial du produit",
  "category": "Type de produit (ex: rouge à lèvres, fond de teint, parfum)",
  "shade": "Teinte/couleur/variante principale",
  "shadeDescription": "Description évocatrice de la teinte",
  "finish": "Finition/aspect visuel (ex: satin, matte, glossy)",
  "finishDescription": "Ce que suggère ce fini",
  "benefit": "Bénéfice clé du produit",
  "benefitTarget": "Pour quel type de personne/situation",
  "texture": "Texture/sensation",
  "application": "Sensation à l'application",
  "duration": "Durée/tenue (ex: 6-8 heures)",
  "resistance": "Résistance (ex: transfert, chaleur, humidité)",
  "positioning": "Positionnement émotionnel/univers"
}

Extrait les vraies informations du document. Sois précis et fidèle au contenu.`;

    const isDev = import.meta.env.DEV;
    const openaiUrl = isDev 
      ? '/api/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en produits cosmétiques. Tu réponds uniquement en JSON valide, sans texte supplémentaire.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur OpenAI:', errorText);
      throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    console.log('Extraction réussie depuis le document produit!');
    return extractedData as ProductDetails;
  } catch (error) {
    console.error('Erreur lors de l\'extraction depuis le document:', error);
    throw error;
  }
}

export async function extractPersonaFromUrl(url: string): Promise<PersonaDetails> {
  try {
    console.log('Analyse de l\'URL de la persona...');
    
    // Analyser l'URL directement avec l'IA
    const prompt = `Tu es un expert en profils clients et personas marketing.

Analyse cette URL et crée un profil client/persona cohérent :

URL: ${url}

Instructions :
1. Analyse l'URL : titre, mots-clés, contexte
2. Utilise tes connaissances pour créer un profil réaliste et détaillé
3. Base-toi sur le type de contenu suggéré par l'URL
4. Crée une persona cohérente pour le secteur cosmétique/beauté

Réponds UNIQUEMENT avec un objet JSON valide contenant ces champs :
{
  "firstName": "Prénom de la persona",
  "age": 30,
  "profession": "Profession/métier",
  "location": "Ville/région",
  "lifestyle": "Style de vie",
  "values": "Valeurs principales",
  "tone": "Ton de communication",
  "language": "Style de langage",
  "emotion": "Émotion dominante",
  "salesReaction": "Réaction face à la vente",
  "comfortFactors": "Facteurs de confort",
  "propositionPreference": "Préférence de proposition",
  "buyingMotivation": "Motivation d'achat",
  "screeneProfile": "Profil SCREENE",
  "screeneMotivation": "Motivation SCREENE",
  "buyingHabits": "Habitudes d'achat",
  "buyingFrequency": "Fréquence d'achat",
  "buyingLocation": "Lieux d'achat préférés",
  "recentPurchase": "Achat récent",
  "summary": "Résumé du profil en une phrase"
}

Crée un profil cohérent, réaliste et détaillé.`;

    const isDev = import.meta.env.DEV;
    const openaiUrl = isDev 
      ? '/api/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en personas marketing. Tu réponds uniquement en JSON valide, sans texte supplémentaire.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur OpenAI:', errorText);
      throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    console.log('Extraction réussie!');
    return extractedData as PersonaDetails;
  } catch (error) {
    console.error('Erreur lors de l\'extraction depuis URL:', error);
    throw error;
  }
}

export async function extractPersonaFromDocuments(files: File[]): Promise<PersonaDetails> {
  try {
    console.log('Lecture du fichier...');
    
    // Lire le contenu du premier fichier
    const firstFile = files[0];
    const fileContent = await readFileAsText(firstFile);
    
    // Limiter à 4000 caractères pour ne pas dépasser les limites de l'API
    const truncatedContent = fileContent.substring(0, 4000);
    
    console.log('Analyse du contenu par l\'IA...');
    
    const prompt = `Tu es un expert en profils clients et personas marketing.

Analyse le contenu de ce document et extrait les informations pour créer un profil client/persona détaillé :

CONTENU DU DOCUMENT:
${truncatedContent}

Instructions :
1. Lis attentivement le contenu du document
2. Extrait toutes les informations pertinentes sur la personne/client
3. Si certaines informations manquent, infère-les de manière cohérente avec le contexte
4. Crée un profil complet et réaliste pour le secteur cosmétique/beauté

Réponds UNIQUEMENT avec un objet JSON valide contenant ces champs :
{
  "firstName": "Prénom de la persona (extrait du document)",
  "age": 30,
  "profession": "Profession/métier",
  "location": "Ville/région",
  "lifestyle": "Style de vie",
  "values": "Valeurs principales",
  "tone": "Ton de communication",
  "language": "Style de langage",
  "emotion": "Émotion dominante",
  "salesReaction": "Réaction face à la vente",
  "comfortFactors": "Facteurs de confort",
  "propositionPreference": "Préférence de proposition",
  "buyingMotivation": "Motivation d'achat",
  "screeneProfile": "Profil SCREENE (Sécurité, Confort, Reconnaissance, Esthétique, Éthique, Nouveauté, Économie)",
  "screeneMotivation": "Motivation SCREENE détaillée",
  "buyingHabits": "Habitudes d'achat",
  "buyingFrequency": "Fréquence d'achat",
  "buyingLocation": "Lieux d'achat préférés",
  "recentPurchase": "Achat récent (si mentionné)",
  "summary": "Résumé du profil en une phrase"
}

Extrait les vraies informations du document. Sois précis et fidèle au contenu.`;

    const isDev = import.meta.env.DEV;
    const openaiUrl = isDev 
      ? '/api/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en personas marketing. Tu réponds uniquement en JSON valide, sans texte supplémentaire.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur OpenAI:', errorText);
      throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    console.log('Extraction réussie depuis le document!');
    return extractedData as PersonaDetails;
  } catch (error) {
    console.error('Erreur lors de l\'extraction depuis le document:', error);
    throw error;
  }
}

export async function generateScenarioSteps(
  productIds: string[],
  personaIds: string[],
  products: any[],
  personas: any[]
): Promise<any[]> {
  // Récupérer les détails des produits et personas sélectionnés
  const selectedProducts = products.filter(p => productIds.includes(p.id));
  const selectedPersonas = personas.filter(p => personaIds.includes(p.id));

  const prompt = `Tu es un expert en création de scénarios de formation pour vendeurs.
  Crée un scénario de vente détaillé en exactement 5 étapes pour former des vendeurs.

PRODUITS À VENDRE:
${selectedProducts.map(p => JSON.stringify(p.details, null, 2)).join('\n\n')}

PERSONAS CLIENTS:
${selectedPersonas.map(p => JSON.stringify(p.details, null, 2)).join('\n\n')}

  Crée un scénario de vente en EXACTEMENT 5 étapes (pas plus, pas moins).
  Ces 5 étapes DOIVENT avoir les titres SUIVANTS, dans cet ordre précis :
  1. "Bienvenue"
  2. "Découverte"
  3. "Présentation"
  4. "Objections"
  5. "Conclusion"

  Pour chaque étape :
  - Le champ "title" doit reprendre exactement UN de ces titres (sans variante, sans traduction, sans texte supplémentaire).
  - Le champ "comment" doit décrire précisément ce que le vendeur doit faire à cette étape, adapté aux produits et à la persona.
  - Le champ "tags" contient quelques mots-clés utiles (libres) pour décrire l'étape.

  Réponds UNIQUEMENT avec un tableau JSON de 5 étapes dans cet ordre précis :
  [
    { "title": "Bienvenue", ... },
    { "title": "Découverte", ... },
    { "title": "Présentation", ... },
    { "title": "Objections", ... },
    { "title": "Conclusion", ... }
  ]

  Format JSON exact attendu :
  [
    {
      "title": "Titre de l'étape",
      "comment": "Description détaillée de ce que le vendeur doit faire",
      "tags": ["tag1", "tag2"]
    }
  ]`;

  try {
    const isDev = import.meta.env.DEV;
    const openaiUrl = isDev 
      ? '/api/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en formation commerciale et répond uniquement en JSON valide.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API OpenAI: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const steps = JSON.parse(jsonMatch[0]);
    
    // Ajouter les IDs, l'ordre et le poids par défaut
    const defaultWeight = Math.floor(100 / steps.length);
    const remainder = 100 - (defaultWeight * steps.length);
    
    return steps.map((step: any, index: number) => ({
      id: `step-${Date.now()}-${index}`,
      ...step,
      order: index,
      scoreWeight: defaultWeight + (index === 0 ? remainder : 0), // Répartition équitable avec le reste sur la première étape
    }));
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    throw error;
  }
}

export async function translateScenarioSteps(
  steps: ScenarioStep[],
  _targetLanguage: string,
  languageName: string
): Promise<ScenarioStep[]> {
  const prompt = `Tu es un expert en traduction professionnelle.

Traduis toutes les étapes de ce scénario de formation en ${languageName}.

ÉTAPES À TRADUIRE:
${JSON.stringify(steps, null, 2)}

Instructions :
1. Traduis le "title" (titre) de chaque étape en ${languageName}
2. Traduis le "comment" (description) de chaque étape en ${languageName}
3. Traduis tous les "tags" en ${languageName}
4. Garde la même structure JSON
5. Conserve les IDs, order, scoreWeight, productId, isAdditionalSale tels quels
6. Assure-toi que la traduction est naturelle et professionnelle

Réponds UNIQUEMENT avec un tableau JSON d'étapes traduites, sans texte supplémentaire:
[
  {
    "id": "...",
    "title": "Titre traduit",
    "comment": "Description traduite",
    "tags": ["tag1 traduit", "tag2 traduit"],
    "order": 0,
    "scoreWeight": 20,
    ...
  }
]`;

  try {
    const isDev = import.meta.env.DEV;
    const openaiUrl = isDev 
      ? '/api/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en traduction professionnelle. Tu réponds uniquement en JSON valide, sans texte supplémentaire.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API OpenAI: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const translatedSteps = JSON.parse(jsonMatch[0]);
    console.log('Traduction réussie!');
    return translatedSteps as ScenarioStep[];
  } catch (error) {
    console.error('Erreur lors de la traduction:', error);
    throw error;
  }
}
