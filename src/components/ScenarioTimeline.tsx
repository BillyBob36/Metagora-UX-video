import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScenarioStep } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TagChip } from '@/components/ui/TagChip';
import { Input } from '@/components/ui/Input';
import { GripVertical, Trash2, Plus, AlertCircle, Check } from 'lucide-react';
import { AddStepModal } from '@/components/modals/AddStepModal';

interface ScenarioTimelineProps {
  steps: ScenarioStep[];
  scenarioId: string;
  currentProductIds: string[];
  onChange: (steps: ScenarioStep[]) => void;
}

export function ScenarioTimeline({ steps, scenarioId, currentProductIds, onChange }: ScenarioTimelineProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletedSteps, setDeletedSteps] = useState<ScenarioStep[]>([]);
  const [localWeights, setLocalWeights] = useState<Record<string, number>>({});

  // Initialiser les poids locaux
  useEffect(() => {
    const weights: Record<string, number> = {};
    const totalSteps = steps.length;
    const defaultWeight = totalSteps > 0 ? Math.floor(100 / totalSteps) : 0;

    steps.forEach((step) => {
      weights[step.id] = step.scoreWeight ?? defaultWeight;
    });

    setLocalWeights(weights);
  }, [steps.length]); // Uniquement quand le nombre d'étapes change

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex).map((step, index) => ({
        ...step,
        order: index,
      }));

      onChange(newSteps);
    }
  };

  const handleAddStep = (step: ScenarioStep) => {
    // Ajouter l'étape à la fin
    const newStep = { ...step, order: steps.length };
    onChange([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    const stepToRemove = steps.find((s) => s.id === id);
    if (stepToRemove) {
      // Ajouter aux étapes supprimées pour pouvoir les restaurer
      setDeletedSteps((prev) => [...prev, stepToRemove]);
    }
    const newSteps = steps
      .filter((s) => s.id !== id)
      .map((step, index) => ({ ...step, order: index }));
    onChange(newSteps);
  };

  const handleUpdateStep = (id: string, updates: Partial<ScenarioStep>) => {
    const newSteps = steps.map((step) =>
      step.id === id ? { ...step, ...updates } : step
    );
    onChange(newSteps);
  };

  const handleWeightChange = (stepId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    
    const newWeights = {
      ...localWeights,
      [stepId]: clampedValue,
    };
    
    setLocalWeights(newWeights);
    
    // Appliquer automatiquement les changements
    const updatedSteps = steps.map((step) => ({
      ...step,
      scoreWeight: newWeights[step.id] ?? 0,
    }));
    onChange(updatedSteps);
  };

  const handleDistributeEqually = () => {
    const equalWeight = Math.floor(100 / steps.length);
    const remainder = 100 - (equalWeight * steps.length);
    
    const newWeights: Record<string, number> = {};
    steps.forEach((step, index) => {
      newWeights[step.id] = equalWeight + (index === 0 ? remainder : 0);
    });

    setLocalWeights(newWeights);
    
    // Appliquer automatiquement les changements
    const updatedSteps = steps.map((step) => ({
      ...step,
      scoreWeight: newWeights[step.id] ?? 0,
    }));
    onChange(updatedSteps);
  };

  const totalWeight = Object.values(localWeights).reduce((sum, weight) => sum + weight, 0);
  const isScoreValid = totalWeight === 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Timeline du scénario</h2>
          <p className="text-sm text-gray-600 mt-1">Gérez les étapes et leur importance (scoring)</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="sm" variant="outline">
          <Plus className="w-4 h-4" />
          Ajouter une étape
        </Button>
      </div>

      {/* Barre de scoring */}
      <div className={`flex items-center justify-between p-3 rounded-lg border mb-4 ${
        isScoreValid 
          ? 'bg-green-50 border-green-300' 
          : 'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Scoring total:</span>
          <span
            className={`text-lg font-bold ${
              isScoreValid ? 'text-green-600' : 'text-amber-600'
            }`}
          >
            {totalWeight}%
          </span>
          {isScoreValid ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Doit totaliser 100%
              </span>
            </div>
          )}
        </div>
        <Button onClick={handleDistributeEqually} size="sm" variant="ghost">
          Répartir équitablement
        </Button>
      </div>

      {/* Étapes avec scoring intégré */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <SortableStepCard
                key={step.id}
                step={step}
                index={index}
                scoreWeight={localWeights[step.id] ?? 0}
                onUpdate={handleUpdateStep}
                onRemove={handleRemoveStep}
                onWeightChange={handleWeightChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showAddModal && (
        <AddStepModal
          scenarioId={scenarioId}
          currentProductIds={currentProductIds}
          deletedSteps={deletedSteps}
          onClose={() => setShowAddModal(false)}
          onAddStep={handleAddStep}
        />
      )}
    </div>
  );
}

interface SortableStepCardProps {
  step: ScenarioStep;
  index: number;
  scoreWeight: number;
  onUpdate: (id: string, updates: Partial<ScenarioStep>) => void;
  onRemove: (id: string) => void;
  onWeightChange: (stepId: string, value: string) => void;
}

function SortableStepCard({ step, index, scoreWeight, onUpdate, onRemove, onWeightChange }: SortableStepCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddTag = () => {
    if (newTag.trim() && !step.tags.includes(newTag.trim())) {
      onUpdate(step.id, { tags: [...step.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onUpdate(step.id, { tags: step.tags.filter((t) => t !== tag) });
  };

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <button
            className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {/* Step number */}
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0 mt-1">
            {index + 1}
          </div>

          {/* Content - Divisé en 2 parties */}
          <div className="flex-1 min-w-0 flex gap-4">
            {/* Partie gauche: Détails de l'étape */}
            <div className="flex-1 min-w-0 space-y-3">
            {isEditing ? (
              <>
                <Input
                  value={step.title}
                  onChange={(e) => onUpdate(step.id, { title: e.target.value })}
                  placeholder="Titre de l'étape"
                />
                <textarea
                  value={step.comment}
                  onChange={(e) => onUpdate(step.id, { comment: e.target.value })}
                  placeholder="Commentaire"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
              </>
            ) : (
              <>
                <h3
                  className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.comment}</p>
              </>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {step.tags.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    variant="primary"
                    onRemove={() => handleRemoveTag(tag)}
                  />
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Ajouter un tag"
                    className="text-sm"
                  />
                  <Button onClick={handleAddTag} size="sm" variant="outline">
                    Ajouter
                  </Button>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(false)} size="sm" variant="primary">
                  Enregistrer
                </Button>
                <Button onClick={() => setIsEditing(false)} size="sm" variant="ghost">
                  Annuler
                </Button>
              </div>
            )}
            </div>

            {/* Partie droite: Scoring */}
            <div className="flex flex-col items-center justify-center pl-4 border-l border-gray-200 min-h-full">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreWeight}
                  onChange={(e) => onWeightChange(step.id, e.target.value)}
                  className="w-16 text-center text-sm"
                />
                <span className="text-gray-600 font-medium text-sm">%</span>
              </div>
              <span className="text-sm text-gray-500 mt-1">du scoring total</span>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={() => onRemove(step.id)}
            className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
