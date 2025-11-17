import { Button } from '@/components/ui/Button';
import { AlertCircle, Copy, Save } from 'lucide-react';

interface SaveScenarioModalProps {
  scenarioName: string;
  onReplace: () => void;
  onCreateCopy: () => void;
  onCancel: () => void;
}

export function SaveScenarioModal({
  scenarioName,
  onReplace,
  onCreateCopy,
  onCancel,
}: SaveScenarioModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Sauvegarder les modifications</h2>
            <p className="text-sm text-gray-600">{scenarioName}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700">
            Vous avez modifié les paramètres du scénario (difficulté, langue, etc.). 
            Que souhaitez-vous faire ?
          </p>

          <div className="space-y-3">
            <button
              onClick={onReplace}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200">
                  <Save className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Remplacer le scénario actuel
                  </h3>
                  <p className="text-xs text-gray-600">
                    Les modifications seront appliquées au scénario existant
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={onCreateCopy}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200">
                  <Copy className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Créer une copie avec les nouveaux paramètres
                  </h3>
                  <p className="text-xs text-gray-600">
                    Un nouveau scénario sera créé avec vos modifications
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={onCancel} variant="ghost">
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
