import { useState, useEffect } from 'react';
import { ScenarioStep } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, Check } from 'lucide-react';

interface ScoreDistributionProps {
  steps: ScenarioStep[];
  onChange: (steps: ScenarioStep[]) => void;
}

export function ScoreDistribution({ steps, onChange }: ScoreDistributionProps) {
  const [localWeights, setLocalWeights] = useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialiser les poids locaux
  useEffect(() => {
    const weights: Record<string, number> = {};
    const totalSteps = steps.length;
    const defaultWeight = totalSteps > 0 ? Math.floor(100 / totalSteps) : 0;

    steps.forEach((step) => {
      weights[step.id] = step.scoreWeight ?? defaultWeight;
    });

    setLocalWeights(weights);
    setHasChanges(false);
  }, [steps]);

  const totalWeight = Object.values(localWeights).reduce((sum, weight) => sum + weight, 0);
  const isValid = totalWeight === 100;

  const handleWeightChange = (stepId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    
    setLocalWeights((prev) => ({
      ...prev,
      [stepId]: clampedValue,
    }));
    setHasChanges(true);
  };

  const handleDistributeEqually = () => {
    const equalWeight = Math.floor(100 / steps.length);
    const remainder = 100 - (equalWeight * steps.length);
    
    const newWeights: Record<string, number> = {};
    steps.forEach((step, index) => {
      newWeights[step.id] = equalWeight + (index === 0 ? remainder : 0);
    });

    setLocalWeights(newWeights);
    setHasChanges(true);
  };

  const handleApply = () => {
    if (!isValid) return;

    const updatedSteps = steps.map((step) => ({
      ...step,
      scoreWeight: localWeights[step.id] ?? 0,
    }));

    onChange(updatedSteps);
    setHasChanges(false);
  };

  const handleReset = () => {
    const weights: Record<string, number> = {};
    steps.forEach((step) => {
      weights[step.id] = step.scoreWeight ?? 0;
    });
    setLocalWeights(weights);
    setHasChanges(false);
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Répartition du scoring</h3>
            <p className="text-sm text-gray-600 mt-1">
              Définissez l'importance de chaque étape (total doit être 100%)
            </p>
          </div>
          <Button
            onClick={handleDistributeEqually}
            variant="outline"
            size="sm"
          >
            Répartir équitablement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{step.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={localWeights[step.id] ?? 0}
                  onChange={(e) => handleWeightChange(step.id, e.target.value)}
                  className="w-20 text-center"
                />
                <span className="text-gray-600 font-medium">%</span>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border-2 border-gray-300 mt-4">
            <span className="font-semibold text-gray-900">Total</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  isValid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {totalWeight}%
              </span>
              {isValid ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>

          {!isValid && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  La répartition doit totaliser exactement 100%
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {totalWeight > 100
                    ? `Vous avez ${totalWeight - 100}% en trop`
                    : `Il manque ${100 - totalWeight}%`}
                </p>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          {hasChanges && (
            <div className="flex gap-3 pt-3 border-t">
              <Button
                onClick={handleApply}
                disabled={!isValid}
                className="flex-1"
              >
                Appliquer les modifications
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
