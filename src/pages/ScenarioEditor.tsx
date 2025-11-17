import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { ScenarioTimeline } from '@/components/ScenarioTimeline';
import { AISidebar } from '@/components/AISidebar';
import { DifficultySlider } from '@/components/DifficultySlider';
import { LanguageTranslator } from '@/components/LanguageTranslator';
import { SaveScenarioModal } from '@/components/modals/SaveScenarioModal';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { ScenarioStep } from '@/types';

export function ScenarioEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const scenarios = useStore((state) => state.scenarios);
  const updateScenario = useStore((state) => state.updateScenario);
  const addScenario = useStore((state) => state.addScenario);
  const addToast = useStore((state) => state.addToast);

  const scenario = scenarios.find((s) => s.id === id);

  useEffect(() => {
    if (!scenario) {
      navigate('/');
    }
  }, [scenario, navigate]);

  if (!scenario) {
    return null;
  }

  const [isTranslating, setIsTranslating] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(scenario.name);
  
  // Sauvegarder les paramètres initiaux pour détecter les changements
  const initialParams = useRef({
    difficulty: scenario.difficulty ?? 50,
  });
  
  // Détecter si les paramètres ont changé
  const hasParamChanges = 
    (scenario.difficulty ?? 50) !== initialParams.current.difficulty;

  const handleStepsChange = (steps: ScenarioStep[]) => {
    // Toujours mettre à jour les steps originaux (pas de traduction réelle)
    updateScenario(scenario.id, { steps });
  };

  const handleDifficultyChange = (difficulty: number) => {
    updateScenario(scenario.id, { difficulty });
  };

  const handleTranslate = async (languageCode: string, languageName: string) => {
    setIsTranslating(true);
    
    // Simulation de traduction avec un délai de 5 secondes
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Trouver l'URL du drapeau
    const languageFlagUrl = `https://flagcdn.com/w40/${languageCode === 'en' ? 'gb' : languageCode === 'ja' ? 'jp' : languageCode === 'zh' ? 'cn' : languageCode === 'ko' ? 'kr' : languageCode === 'ar' ? 'sa' : languageCode === 'hi' ? 'in' : languageCode === 'sv' ? 'se' : languageCode === 'el' ? 'gr' : languageCode === 'cs' ? 'cz' : languageCode === 'da' ? 'dk' : languageCode === 'uk' ? 'ua' : languageCode === 'he' ? 'il' : languageCode === 'fa' ? 'ir' : languageCode === 'ur' ? 'pk' : languageCode === 'bn' ? 'bd' : languageCode === 'ta' ? 'lk' : languageCode === 'sw' ? 'ke' : languageCode === 'af' ? 'za' : languageCode === 'am' ? 'et' : languageCode === 'ga' ? 'ie' : languageCode === 'cy' ? 'gb-wls' : languageCode}.png`;
    
    // Ajouter la langue sans vraiment traduire le contenu
    const updatedAvailableLanguages = [
      ...scenario.availableLanguages,
      { code: languageCode, name: languageName, flagUrl: languageFlagUrl },
    ];
    
    updateScenario(scenario.id, {
      availableLanguages: updatedAvailableLanguages,
      currentLanguage: languageCode,
    });
    
    setIsTranslating(false);
    addToast({
      type: 'success',
      message: `Langue ${languageName} ajoutée avec succès !`,
    });
  };

  const handleSwitchLanguage = (languageCode: string) => {
    updateScenario(scenario.id, { currentLanguage: languageCode });
  };

  // Récupérer toutes les versions linguistiques disponibles
  const allLanguageVersions = scenario.availableLanguages.map(lang => ({
    ...lang,
    scenarioId: scenario.id,
    isCurrentScenario: lang.code === scenario.currentLanguage,
  }));
  
  // Toujours afficher les steps originaux (pas de traduction réelle)
  const currentSteps = scenario.steps;

  const totalWeight = scenario.steps.reduce((sum, step) => sum + (step.scoreWeight ?? 0), 0);
  const isScoreValid = totalWeight === 100;

  const handleSave = () => {
    if (!isScoreValid) {
      addToast({
        type: 'error',
        message: 'La répartition du scoring doit totaliser exactement 100%',
      });
      return;
    }
    
    // Si les paramètres ont changé, demander confirmation
    if (hasParamChanges) {
      setShowSaveModal(true);
    } else {
      // Sauvegarder directement si pas de changement de paramètres
      addToast({
        type: 'success',
        message: 'Scénario sauvegardé avec succès',
      });
    }
  };
  
  const handleReplaceSave = () => {
    // Remplacer le scénario actuel
    initialParams.current = {
      difficulty: scenario.difficulty ?? 50,
    };
    setShowSaveModal(false);
    addToast({
      type: 'success',
      message: 'Scénario sauvegardé avec succès',
    });
  };
  
  const handleCreateCopy = () => {
    // Trouver le numéro de version suivant
    const baseNameMatch = scenario.name.match(/^(.+?)(?:\s+V(\d+))?$/);
    const baseName = baseNameMatch ? baseNameMatch[1] : scenario.name;
    
    // Compter les versions existantes avec ce nom de base
    const existingVersions = scenarios.filter(s => 
      s.name.startsWith(baseName)
    ).length;
    
    const versionNumber = existingVersions + 1;
    
    // Récupérer la langue actuelle
    const currentLang = scenario.availableLanguages.find(
      lang => lang.code === scenario.currentLanguage
    );
    const languageName = currentLang?.name || 'Français';
    
    // Créer une copie du scénario avec les nouveaux paramètres
    const now = new Date().toISOString();
    const copiedScenario = {
      ...scenario,
      id: `scenario-${Date.now()}`,
      name: `${baseName} ${languageName} V${versionNumber}`,
      createdAt: now,
      updatedAt: now,
    };
    
    addScenario(copiedScenario);
    setShowSaveModal(false);
    addToast({
      type: 'success',
      message: 'Copie du scénario créée avec succès',
    });
    
    // Naviguer vers la copie
    setTimeout(() => {
      navigate(`/scenario/${copiedScenario.id}`);
    }, 500);
  };
  
  const handleNameSave = () => {
    if (editedName.trim()) {
      updateScenario(scenario.id, { name: editedName.trim() });
      setIsEditingName(false);
      addToast({
        type: 'success',
        message: 'Nom du scénario modifié',
      });
    }
  };

  const handlePublish = () => {
    if (!isScoreValid) {
      addToast({
        type: 'error',
        message: 'La répartition du scoring doit totaliser exactement 100%',
      });
      return;
    }
    updateScenario(scenario.id, { status: 'published' });
    addToast({
      type: 'success',
      message: 'Scénario publié avec succès',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSave();
                      if (e.key === 'Escape') {
                        setEditedName(scenario.name);
                        setIsEditingName(false);
                      }
                    }}
                    className="text-2xl font-bold text-gray-900 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none"
                    autoFocus
                  />
                  <Button onClick={handleNameSave} size="sm">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditedName(scenario.name);
                      setIsEditingName(false);
                    }} 
                    variant="ghost" 
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{scenario.name}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">
                {scenario.steps.length} étape(s) • {scenario.productIds.length} produit(s)
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="outline">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
            <Button onClick={handlePublish}>
              Publier
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="p-6">
                <ScenarioTimeline
                  steps={currentSteps}
                  scenarioId={scenario.id}
                  currentProductIds={scenario.productIds}
                  onChange={handleStepsChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <DifficultySlider
              difficulty={scenario.difficulty ?? 50}
              onChange={handleDifficultyChange}
            />
            
            <LanguageTranslator
              allLanguageVersions={allLanguageVersions}
              onTranslate={handleTranslate}
              onSwitchLanguage={handleSwitchLanguage}
              isTranslating={isTranslating}
            />
            
            <AISidebar scenarioId={scenario.id} />
          </div>
        </div>
      </div>
      
      {/* Modal de confirmation de sauvegarde */}
      {showSaveModal && (
        <SaveScenarioModal
          scenarioName={scenario.name}
          hasChanges={hasParamChanges}
          onReplace={handleReplaceSave}
          onCreateCopy={handleCreateCopy}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}
