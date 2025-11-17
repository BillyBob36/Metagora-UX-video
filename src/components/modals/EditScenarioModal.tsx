import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { X, Package, Users, Shuffle } from 'lucide-react';
import { Scenario } from '@/types';

interface EditScenarioModalProps {
  scenario: Scenario;
  onClose: () => void;
}

export function EditScenarioModal({ scenario, onClose }: EditScenarioModalProps) {
  const products = useStore((state) => state.products);
  const personas = useStore((state) => state.personas);
  const updateScenario = useStore((state) => state.updateScenario);
  const addToast = useStore((state) => state.addToast);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(scenario.productIds);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>(scenario.personaIds);
  const [randomizePersona, setRandomizePersona] = useState(scenario.randomizePersona);

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

  const handleSave = () => {
    if (selectedProductIds.length === 0) {
      addToast({
        type: 'error',
        message: 'Veuillez sélectionner au moins un produit',
      });
      return;
    }

    if (selectedPersonaIds.length === 0) {
      addToast({
        type: 'error',
        message: 'Veuillez sélectionner au moins une persona',
      });
      return;
    }

    updateScenario(scenario.id, {
      productIds: selectedProductIds,
      personaIds: selectedPersonaIds,
      randomizePersona,
    });

    addToast({
      type: 'success',
      message: 'Scénario mis à jour avec succès',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Modifier le scénario</h2>
            <p className="text-sm text-gray-600 mt-1">{scenario.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Products Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Produits du scénario</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les produits que les vendeurs doivent essayer de vendre
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedProductIds.includes(product.id)
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'border-2 border-transparent hover:border-gray-300'
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
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{product.details.name}</h4>
                      <p className="text-sm text-gray-600">{product.details.category}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Personas Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Personas du scénario</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez les personas clients auxquels vos vendeurs seront confrontés
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {personas.map((persona) => (
                <Card
                  key={persona.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedPersonaIds.includes(persona.id)
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'border-2 border-transparent hover:border-gray-300'
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
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">
                        {persona.details.firstName}, {persona.details.age} ans
                      </h4>
                      <p className="text-sm text-gray-600">{persona.details.profession}</p>
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
                      À chaque nouvelle partie, le vendeur sera confronté à une persona différente
                    </p>
                  </div>
                </label>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button onClick={onClose} variant="outline">
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}
