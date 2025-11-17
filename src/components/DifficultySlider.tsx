import { Card, CardContent } from '@/components/ui/Card';
import { GraduationCap } from 'lucide-react';

interface DifficultySliderProps {
  difficulty: number;
  onChange: (difficulty: number) => void;
}

export function DifficultySlider({ difficulty, onChange }: DifficultySliderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Niveau de difficulté</h3>
          </div>
          <span className="text-blue-600 font-bold text-lg">{difficulty}%</span>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 text-sm">
            <span className="text-gray-600 font-medium text-left">Onboarding</span>
            <span className="text-gray-600 font-medium text-center">Junior</span>
            <span className="text-gray-600 font-medium text-right">Senior</span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={difficulty}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${difficulty}%, #e5e7eb ${difficulty}%, #e5e7eb 100%)`
            }}
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
              <span key={val} className="w-0.5 h-1 bg-gray-300"></span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
