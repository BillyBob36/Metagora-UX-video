import { ProductDetails, PersonaDetails, ScenarioStep } from '@/types';
import { generateId } from '@/lib/utils';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateAdditionalSaleStep(
  product: ProductDetails,
  persona: PersonaDetails
): Promise<ScenarioStep> {
  try {
    console.log('Génération de l\'étape de vente additionnelle...');

    const prompt = `Tu es un expert en techniques de vente et en psychologie du consommateur dans le secteur de la cosmétique.

Crée une étape de vente additionnelle (upsell/cross-sell) pour ce contexte :

PRODUIT ADDITIONNEL À VENDRE:
- Nom: ${product.name}
- Catégorie: ${product.category}
- Teinte: ${product.shade}
- Bénéfice: ${product.benefit}
- Texture: ${product.texture}

PROFIL CLIENT:
- Prénom: ${persona.firstName}, ${persona.age} ans
- Profession: ${persona.profession}
- Style de vie: ${persona.lifestyle}
- Profil SCREENE: ${persona.screeneProfile}
- Motivation d'achat: ${persona.buyingMotivation}
- Réaction face à la vente: ${persona.salesReaction}

Instructions :
1. Crée une étape de vente additionnelle naturelle et pertinente
2. NE FOURNIS PAS de titre personnalisé : le titre de l'étape sera toujours "Vente additionnelle" dans l'application.
3. Le commentaire doit expliquer COMMENT présenter ce produit additionnel de manière subtile et efficace.
4. Limite STRICTEMENT le commentaire à un maximum de 300 caractères (phrases courtes et concrètes).
5. Adapte l'approche au profil SCREENE et à la réaction face à la vente de la persona.
6. Propose 2 à 4 tags pertinents pour cette étape (ex: "Complémentarité", "Valeur ajoutée", "Subtilité").

Réponds UNIQUEMENT avec un objet JSON valide :
{
  "comment": "Explication (max 300 caractères) de comment présenter ce produit additionnel de manière naturelle et adaptée à la persona",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const response = await fetch('/api/openai/v1/chat/completions', {
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
            content: 'Tu es un expert en vente et psychologie du consommateur. Tu réponds uniquement en JSON valide.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse de l\'IA');
    }

    const stepData = JSON.parse(jsonMatch[0]);

    const rawComment: string = stepData.comment || '';
    const trimmedComment = rawComment.trim().slice(0, 300);

    return {
      id: generateId(),
      title: 'Vente additionnelle',
      comment: trimmedComment,
      tags: stepData.tags || [],
      order: 0, // Sera mis à jour lors de l'ajout
      isAdditionalSale: true,
      scoreWeight: 0, // Sera défini lors de la répartition
    };
  } catch (error) {
    console.error('Erreur lors de la génération de la vente additionnelle:', error);
    throw error;
  }
}
