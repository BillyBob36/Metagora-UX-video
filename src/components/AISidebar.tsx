import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Sparkles, Lightbulb } from 'lucide-react';
import { getAISuggestions } from '@/services/mockApi';

interface AISidebarProps {
  scenarioId?: string;
}

export function AISidebar({ scenarioId }: AISidebarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scenarioId) {
      setLoading(true);
      getAISuggestions(scenarioId).then((data) => {
        setSuggestions(data);
        setLoading(false);
      });
    }
  }, [scenarioId]);

  return (
    <Card className="sticky top-4">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Assistant IA</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {loading ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            Chargement des suggestions...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sélectionnez un scénario pour obtenir des suggestions</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">Bonnes pratiques :</p>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg text-sm text-gray-700"
                >
                  <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
