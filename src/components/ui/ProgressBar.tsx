import { GenerationProgress } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: GenerationProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const steps = [
    { key: 'analyzing', label: 'Analyse produit' },
    { key: 'creating', label: 'Création' },
    { key: 'finalizing', label: 'Finalisation' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === progress.step);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                    index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : index === currentStepIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {index < currentStepIndex ? (
                    '✓'
                  ) : index === currentStepIndex ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2 rounded transition-all',
                    index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{progress.message}</span>
            <span className="font-semibold text-gray-900">{progress.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
