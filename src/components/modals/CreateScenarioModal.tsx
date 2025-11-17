import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { X, Package, Users, Shuffle } from 'lucide-react';
import { generateScenarioSteps } from '@/services/openai';
import { Scenario } from '@/types';
import { getAssetUrl } from '@/lib/assets';

interface CreateScenarioModalProps {
  onClose: () => void;
}

export function CreateScenarioModal({ onClose }: CreateScenarioModalProps) {
  const navigate = useNavigate();
  const products = useStore((state) => state.products);
  const personas = useStore((state) => state.personas);
  const addScenario = useStore((state) => state.addScenario);
  const addToast = useStore((state) => state.addToast);

  const [step, setStep] = useState<'products' | 'personas' | 'name' | 'generating'>('products');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const [randomizePersona, setRandomizePersona] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleProductToggle = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handlePersonaToggle = (id: string) => {
    setSelectedPersonaIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleNextFromProducts = () => {
    if (products.length === 0) {
      if (confirm('Aucun produit n\'a encore été créé. Voulez-vous commencer par créer un produit ?')) {
        onClose();
        // Rediriger vers l'onglet produits et ouvrir la popup de création
        window.dispatchEvent(new CustomEvent('switchTab', { detail: 'products' }));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openCreateProduct'));
        }, 100);
      }
      return;
    }

    if (selectedProductIds.length === 0) {
      addToast({
        type: 'error',
        message: 'Veuillez sélectionner au moins un produit',
      });
      return;
    }

    setStep('personas');
  };

  const handleNextFromPersonas = () => {
    if (personas.length === 0) {
      if (confirm('Aucune persona n\'a encore été créée. Voulez-vous commencer par créer une persona ?')) {
        onClose();
        // Rediriger vers l'onglet personas et ouvrir la popup de création
        window.dispatchEvent(new CustomEvent('switchTab', { detail: 'personas' }));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openCreatePersona'));
        }, 100);
      }
      return;
    }

    if (selectedPersonaIds.length === 0) {
      addToast({
        type: 'error',
        message: 'Veuillez sélectionner au moins une persona',
      });
      return;
    }

    // Pré-remplir le nom du scénario avec le premier produit sélectionné si aucun nom n'a encore été saisi
    if (!scenarioName.trim() && selectedProductIds.length > 0) {
      const firstProduct = products.find((p) => p.id === selectedProductIds[0]);
      if (firstProduct?.details?.name && firstProduct.details.category) {
        const rawCategory = firstProduct.details.category.trim();
        const formattedCategory = rawCategory
          ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
          : rawCategory;
        setScenarioName(`${formattedCategory} - "${firstProduct.details.name}"`);
      }
    }

    setStep('name');
  };

  const handleGenerate = async () => {
    if (!scenarioName.trim()) {
      addToast({
        type: 'error',
        message: 'Veuillez donner un nom à votre scénario',
      });
      return;
    }

    setStep('generating');
    setGenerationProgress(0);

    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const steps = await generateScenarioSteps(
        selectedProductIds,
        selectedPersonaIds,
        products,
        personas
      );

      clearInterval(progressInterval);
      setGenerationProgress(100);

      const now = new Date().toISOString();
      const newScenario: Scenario = {
        id: `scenario-${Date.now()}`,
        name: scenarioName,
        productIds: selectedProductIds,
        personaIds: selectedPersonaIds,
        randomizePersona,
        steps,
        availableLanguages: [
          { code: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w40/fr.png' }
        ],
        currentLanguage: 'fr',
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };

      addScenario(newScenario);
      addToast({
        type: 'success',
        message: 'Scénario généré avec succès !',
      });

      setTimeout(() => {
        onClose();
        navigate(`/scenario/${newScenario.id}`);
      }, 1000);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de la génération du scénario. Veuillez réessayer.',
      });
      setStep('name');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Créer un nouveau scénario</h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'products' && 'Étape 1/3 : Sélection des produits'}
              {step === 'personas' && 'Étape 2/3 : Sélection des personas'}
              {step === 'name' && 'Étape 3/3 : Nom du scénario'}
              {step === 'generating' && 'Génération en cours...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={step === 'generating'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'products' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Sélectionnez le ou les produits</strong> que les vendeurs doivent essayer de vendre dans votre scénario
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun produit disponible</p>
                  <Button onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('switchTab', { detail: 'products' }));
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('openCreateProduct'));
                    }, 100);
                  }}>
                    Créer un produit
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedProductIds.includes(product.id)
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : 'border-2 border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleProductToggle(product.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedProductIds.includes(product.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedProductIds.includes(product.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        {product.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img 
                              src={product.image} 
                              alt={product.details.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{product.details.name}</h3>
                          <p className="text-sm text-gray-600">{product.details.category}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.details.benefit}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'personas' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Sélectionnez la ou les personas clients</strong> auxquels vos vendeurs seront confrontés dans votre scénario
                </p>
              </div>

              {personas.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucune persona disponible</p>
                  <Button onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('switchTab', { detail: 'personas' }));
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('openCreatePersona'));
                    }, 100);
                  }}>
                    Créer une persona
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personas.map((persona) => (
                      <Card
                        key={persona.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedPersonaIds.includes(persona.id)
                            ? 'border-2 border-blue-500 bg-blue-50'
                            : 'border-2 border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => handlePersonaToggle(persona.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            selectedPersonaIds.includes(persona.id)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedPersonaIds.includes(persona.id) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          {persona.avatar ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                              <img 
                                src={getAssetUrl(persona.avatar)} 
                                alt={persona.details.firstName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              {persona.details.firstName}, {persona.details.age} ans
                            </h3>
                            <p className="text-sm text-gray-600">{persona.details.profession}</p>
                            <p className="text-xs text-gray-500 mt-1">{persona.details.screeneProfile}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {selectedPersonaIds.length > 1 && (
                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={randomizePersona}
                          onChange={(e) => setRandomizePersona(e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Shuffle className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-gray-900">Randomiser la persona</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            À chaque nouvelle partie, le vendeur sera confronté à une persona différente choisie aléatoirement
                          </p>
                        </div>
                      </label>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {step === 'name' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Donnez un nom à votre scénario pour le retrouver facilement
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du scénario *
                </label>
                <Input
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder='ex: Formation Rouge à lèvres - Profil Esthète'
                  autoFocus
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>Produits sélectionnés:</strong> {selectedProductIds.length}
                  </p>
                  <p className="text-gray-600">
                    <strong>Personas sélectionnées:</strong> {selectedPersonaIds.length}
                    {randomizePersona && ' (randomisées)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="py-12 text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Génération de votre scénario en cours...
                </h3>
                <p className="text-sm text-gray-600">
                  L'IA analyse vos produits et personas pour créer un scénario de formation optimal
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{generationProgress}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'generating' && (
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <Button
              onClick={() => {
                if (step === 'personas') setStep('products');
                else if (step === 'name') setStep('personas');
                else onClose();
              }}
              variant="ghost"
            >
              {step === 'products' ? 'Annuler' : 'Retour'}
            </Button>
            <Button
              onClick={() => {
                if (step === 'products') handleNextFromProducts();
                else if (step === 'personas') handleNextFromPersonas();
                else if (step === 'name') handleGenerate();
              }}
            >
              {step === 'name' ? 'Générer le scénario' : 'Suivant'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
