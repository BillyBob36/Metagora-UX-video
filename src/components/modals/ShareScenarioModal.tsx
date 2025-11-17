import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { Scenario } from '@/types';

interface ShareScenarioModalProps {
  scenario: Scenario;
  onClose: () => void;
}

export function ShareScenarioModal({ scenario, onClose }: ShareScenarioModalProps) {
  const updateScenario = useStore((state) => state.updateScenario);
  const addToast = useStore((state) => state.addToast);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState(scenario.shareLink || '');

  useEffect(() => {
    // Générer un lien de partage si il n'existe pas
    if (!scenario.shareLink) {
      const link = `${window.location.origin}/play/${scenario.id}`;
      setShareLink(link);
      updateScenario(scenario.id, { shareLink: link });
    }
  }, [scenario.id, scenario.shareLink, updateScenario]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Lien copié dans le presse-papier !',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de la copie du lien',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Partager le scénario</h2>
              <p className="text-sm text-gray-600">{scenario.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Partagez ce lien avec vos équipes pour qu'ils puissent accéder au scénario de formation
            </p>

            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 font-mono break-all">
                {shareLink}
              </div>
              <Button
                onClick={handleCopy}
                className="gap-2 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">À propos du partage</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Toute personne avec ce lien pourra accéder au scénario</li>
              <li>• Le scénario sera en mode lecture seule pour les participants</li>
              <li>• Vous pouvez révoquer l'accès en supprimant le scénario</li>
            </ul>
          </div>

          {scenario.status === 'draft' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Ce scénario est actuellement en brouillon. 
                Pensez à le publier pour une meilleure expérience de vos équipes.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
