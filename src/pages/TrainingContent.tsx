import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { ProductList } from '@/components/ProductList';
import { PersonaList } from '@/components/PersonaList';
import { DnDUpload } from '@/components/DnDUpload';
import { ScenarioList } from '@/components/ScenarioList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { importProduct, createPersona, mockProducts, mockPersonas } from '@/services/mockApi';
import { FileType } from '@/types';
import { X } from 'lucide-react';

export function TrainingContent() {
  const navigate = useNavigate();
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [personaForm, setPersonaForm] = useState({
    name: '',
    description: '',
    level: 'intermediate' as 'junior' | 'intermediate' | 'senior',
  });

  const products = useStore((state) => state.products);
  const personas = useStore((state) => state.personas);
  const scenarios = useStore((state) => state.scenarios);
  const selectedProductId = useStore((state) => state.selectedProductId);
  const selectedPersonaId = useStore((state) => state.selectedPersonaId);

  const setProducts = useStore((state) => state.setProducts);
  const setPersonas = useStore((state) => state.setPersonas);
  const addProduct = useStore((state) => state.addProduct);
  const addPersona = useStore((state) => state.addPersona);
  const addToast = useStore((state) => state.addToast);

  // Initialize with mock data
  useEffect(() => {
    if (products.length === 0) {
      setProducts(mockProducts);
    }
    if (personas.length === 0) {
      setPersonas(mockPersonas);
    }
  }, [products.length, personas.length, setProducts, setPersonas]);

  const handleUpload = async (file: File, type: FileType) => {
    try {
      const product = await importProduct(file, type);
      addProduct(product);
      addToast({
        type: 'success',
        message: `Produit "${product.name}" importé avec succès`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de l\'import du produit',
      });
    }
  };

  const handleCreatePersona = async () => {
    if (!personaForm.name || !personaForm.description) {
      addToast({
        type: 'warning',
        message: 'Veuillez remplir tous les champs',
      });
      return;
    }

    try {
      const persona = await createPersona(personaForm);
      addPersona(persona);
      addToast({
        type: 'success',
        message: `Persona "${persona.name}" créé avec succès`,
      });
      setShowPersonaModal(false);
      setPersonaForm({ name: '', description: '', level: 'intermediate' });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de la création du persona',
      });
    }
  };

  const handleGenerateScenario = () => {
    if (!selectedProductId || !selectedPersonaId) {
      addToast({
        type: 'warning',
        message: 'Veuillez sélectionner un produit et un persona',
      });
      return;
    }
    navigate('/generate');
  };

  const canGenerate = selectedProductId && selectedPersonaId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contenus de formation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Products */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Produits</h2>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <ProductList products={products} />
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Upload & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <DnDUpload onUpload={handleUpload} />

            {/* Scenarios List */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Scénarios créés</h2>
              </CardHeader>
              <CardContent>
                <ScenarioList
                  scenarios={scenarios}
                  onSelectScenario={(id) => navigate(`/scenario/${id}`)}
                />
              </CardContent>
            </Card>

            {/* Generate CTA */}
            <div className="sticky bottom-6">
              <Button
                onClick={handleGenerateScenario}
                disabled={!canGenerate}
                className="w-full py-4 text-lg shadow-lg"
                size="lg"
              >
                Générer un scénario
              </Button>
              {!canGenerate && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Sélectionnez un produit et un persona pour continuer
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Personas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-gray-900">Personas</h2>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <PersonaList
                  personas={personas}
                  onCreatePersona={() => setShowPersonaModal(true)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Persona Creation Modal */}
      {showPersonaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Créer un persona</h2>
              <button
                onClick={() => setShowPersonaModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nom du persona"
                value={personaForm.name}
                onChange={(e) => setPersonaForm({ ...personaForm, name: e.target.value })}
                placeholder="Ex: Client Tech-Savvy"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={personaForm.description}
                  onChange={(e) =>
                    setPersonaForm({ ...personaForm, description: e.target.value })
                  }
                  placeholder="Décrivez le profil du persona..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau
                </label>
                <select
                  value={personaForm.level}
                  onChange={(e) =>
                    setPersonaForm({
                      ...personaForm,
                      level: e.target.value as 'junior' | 'intermediate' | 'senior',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="junior">Junior</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreatePersona} className="flex-1">
                  Créer
                </Button>
                <Button
                  onClick={() => setShowPersonaModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
