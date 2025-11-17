import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Plus, Edit, Share2, Trash2, Layers, Play } from 'lucide-react';
import { CreateScenarioModal } from '@/components/modals/CreateScenarioModal';
import { EditScenarioModal } from '@/components/modals/EditScenarioModal';
import { ShareScenarioModal } from '@/components/modals/ShareScenarioModal';
import { Scenario } from '@/types';

export function ScenariosTab() {
  const navigate = useNavigate();
  const scenarios = useStore((state) => state.scenarios);
  const removeScenario = useStore((state) => state.removeScenario);
  const addToast = useStore((state) => state.addToast);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [sharingScenario, setSharingScenario] = useState<Scenario | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce scénario ?')) {
      removeScenario(id);
      addToast({
        type: 'success',
        message: 'Scénario supprimé avec succès',
      });
    }
  };

  const handleViewScenario = (id: string) => {
    navigate(`/scenario/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes scénarios de formation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Créez et gérez vos scénarios de formation pour vos équipes de vente
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau scénario
        </Button>
      </div>

      {/* Scenarios List */}
      {scenarios.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun scénario pour le moment
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              Commencez par créer votre premier scénario de formation en sélectionnant
              les produits et personas clients que vos vendeurs devront maîtriser.
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer mon premier scénario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {scenario.name}
                      </h3>
                      {/* Drapeau de la langue active */}
                      {(() => {
                        const currentLang = scenario.availableLanguages.find(
                          lang => lang.code === scenario.currentLanguage
                        );
                        return currentLang ? (
                          <img 
                            src={currentLang.flagUrl} 
                            alt={currentLang.name}
                            className="w-6 h-4 object-cover rounded"
                            title={currentLang.name}
                          />
                        ) : null;
                      })()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{scenario.productIds.length} produit(s)</span>
                      <span>•</span>
                      <span>{scenario.personaIds.length} persona(s)</span>
                      {/* Afficher la difficulté */}
                      {scenario.difficulty !== undefined && (
                        <>
                          <span>•</span>
                          <span>Difficulté: {scenario.difficulty}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      scenario.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {scenario.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    onClick={() => handleViewScenario(scenario.id)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier le scénario
                  </Button>
                  <Button
                    onClick={() => {
                      let url = 'https://metaverse.ww.fo/avatarworld/?lang=fr';
                      
                      if (scenario.currentLanguage === 'zh') {
                        url = 'https://metaverse.ww.fo/avatarworld/?lang=CHINESE';
                      } else if (scenario.currentLanguage === 'en') {
                        url = 'https://metaverse.ww.fo/avatarz/';
                      } else if (scenario.currentLanguage === 'fr') {
                        url = 'https://metaverse.ww.fo/avatarworld/?lang=fr';
                      }
                      
                      window.open(url, '_blank');
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Tester la formation
                  </Button>
                  <Button
                    onClick={() => {
                      if (scenario.status === 'published') {
                        setSharingScenario(scenario);
                      } else {
                        addToast({
                          type: 'error',
                          message: 'Vous devez publier le scénario avant de le distribuer',
                        });
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    disabled={scenario.status !== 'published'}
                  >
                    <Share2 className="w-4 h-4" />
                    Distribuer la formation
                  </Button>
                  <Button
                    onClick={() => handleDelete(scenario.id)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateScenarioModal onClose={() => setShowCreateModal(false)} />
      )}
      {editingScenario && (
        <EditScenarioModal
          scenario={editingScenario}
          onClose={() => setEditingScenario(null)}
        />
      )}
      {sharingScenario && (
        <ShareScenarioModal
          scenario={sharingScenario}
          onClose={() => setSharingScenario(null)}
        />
      )}
    </div>
  );
}
