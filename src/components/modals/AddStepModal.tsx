import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { X, Plus, Package } from 'lucide-react';
import { ScenarioStep } from '@/types';
import { generateAdditionalSaleStep } from '@/services/additionalSale';

interface AddStepModalProps {
  scenarioId: string;
  currentProductIds: string[];
  deletedSteps: ScenarioStep[];
  onClose: () => void;
  onAddStep: (step: ScenarioStep) => void;
}

export function AddStepModal({
  scenarioId,
  currentProductIds,
  deletedSteps,
  onClose,
  onAddStep,
}: AddStepModalProps) {
  const products = useStore((state) => state.products);
  const personas = useStore((state) => state.personas);
  const scenarios = useStore((state) => state.scenarios);
  const addToast = useStore((state) => state.addToast);

  const [mode, setMode] = useState<'choose' | 'selectProduct'>('choose');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scenario = scenarios.find((s) => s.id === scenarioId);
  const availableProducts = products.filter((p) => !currentProductIds.includes(p.id));

  const handleAddAdditionalSale = async () => {
    if (!selectedProductId) {
      addToast({ type: 'error', message: 'Veuillez sélectionner un produit' });
      return;
    }

    if (!scenario) {
      addToast({ type: 'error', message: 'Scénario introuvable' });
      return;
    }

    setLoading(true);
    try {
      const product = products.find((p) => p.id === selectedProductId);
      const persona = personas.find((p) => scenario.personaIds.includes(p.id));

      if (!product || !persona) {
        throw new Error('Produit ou persona introuvable');
      }

      const step = await generateAdditionalSaleStep(product.details, persona.details);
      step.productId = selectedProductId;

      onAddStep(step);
      addToast({
        type: 'success',
        message: 'Étape de vente additionnelle ajoutée avec succès',
      });
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de la génération de l\'étape',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreStep = (step: ScenarioStep) => {
    onAddStep(step);
    addToast({
      type: 'success',
      message: 'Étape restaurée avec succès',
    });
    onClose();
  };

  const handleCreateProduct = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('switchTab', { detail: 'products' }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openCreateProduct'));
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Ajouter une étape</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Quelle étape souhaitez-vous ajouter à votre scénario ?
              </p>

              <div className="space-y-3">
                {/* Vente additionnelle */}
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => setMode('selectProduct')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Vente additionnelle</h3>
                      <p className="text-sm text-gray-600">
                        Proposer un produit complémentaire au client
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Étapes supprimées */}
                {deletedSteps.length > 0 && (
                  <>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Étapes supprimées (restaurer)
                      </h3>
                    </div>
                    {deletedSteps.map((step) => (
                      <Card
                        key={step.id}
                        className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
                        onClick={() => handleRestoreStep(step)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Plus className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{step.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {step.comment}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {mode === 'selectProduct' && (
            <div className="space-y-4">
              <Button
                onClick={() => setMode('choose')}
                variant="ghost"
                size="sm"
                className="mb-4"
              >
                ← Retour
              </Button>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Sélectionnez le produit à vendre en complément
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choisissez un produit complémentaire à proposer au client
                </p>
              </div>

              {availableProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Tous vos produits sont déjà dans ce scénario
                  </p>
                  <Button onClick={handleCreateProduct}>
                    Créer un nouveau produit
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {availableProducts.map((product) => (
                    <Card
                      key={product.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedProductId === product.id
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : 'border-2 border-transparent hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedProductId(product.id)}
                    >
                      <div className="flex items-start gap-3">
                        {product.image && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img
                              src={product.image}
                              alt={product.details.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">
                            {product.details.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {product.details.category}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {product.details.benefit}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {mode === 'selectProduct' && availableProducts.length > 0 && (
          <div className="flex gap-3 p-6 border-t">
            <Button onClick={onClose} variant="ghost" className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleAddAdditionalSale}
              disabled={!selectedProductId || loading}
              className="flex-1"
            >
              {loading ? 'Génération...' : 'Ajouter la vente additionnelle'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
