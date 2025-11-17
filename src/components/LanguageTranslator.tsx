import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Languages, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flagUrl: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'Anglais', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'es', name: 'Espagnol', flagUrl: 'https://flagcdn.com/w40/es.png' },
  { code: 'de', name: 'Allemand', flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'it', name: 'Italien', flagUrl: 'https://flagcdn.com/w40/it.png' },
  { code: 'pt', name: 'Portugais', flagUrl: 'https://flagcdn.com/w40/pt.png' },
  { code: 'nl', name: 'Néerlandais', flagUrl: 'https://flagcdn.com/w40/nl.png' },
  { code: 'pl', name: 'Polonais', flagUrl: 'https://flagcdn.com/w40/pl.png' },
  { code: 'ru', name: 'Russe', flagUrl: 'https://flagcdn.com/w40/ru.png' },
  { code: 'ja', name: 'Japonais', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { code: 'zh', name: 'Chinois', flagUrl: 'https://flagcdn.com/w40/cn.png' },
  { code: 'ko', name: 'Coréen', flagUrl: 'https://flagcdn.com/w40/kr.png' },
  { code: 'ar', name: 'Arabe', flagUrl: 'https://flagcdn.com/w40/sa.png' },
  { code: 'hi', name: 'Hindi', flagUrl: 'https://flagcdn.com/w40/in.png' },
  { code: 'tr', name: 'Turc', flagUrl: 'https://flagcdn.com/w40/tr.png' },
  { code: 'sv', name: 'Suédois', flagUrl: 'https://flagcdn.com/w40/se.png' },
  { code: 'no', name: 'Norvégien', flagUrl: 'https://flagcdn.com/w40/no.png' },
  { code: 'da', name: 'Danois', flagUrl: 'https://flagcdn.com/w40/dk.png' },
  { code: 'fi', name: 'Finnois', flagUrl: 'https://flagcdn.com/w40/fi.png' },
  { code: 'el', name: 'Grec', flagUrl: 'https://flagcdn.com/w40/gr.png' },
  { code: 'cs', name: 'Tchèque', flagUrl: 'https://flagcdn.com/w40/cz.png' },
  { code: 'hu', name: 'Hongrois', flagUrl: 'https://flagcdn.com/w40/hu.png' },
  { code: 'ro', name: 'Roumain', flagUrl: 'https://flagcdn.com/w40/ro.png' },
  { code: 'bg', name: 'Bulgare', flagUrl: 'https://flagcdn.com/w40/bg.png' },
  { code: 'hr', name: 'Croate', flagUrl: 'https://flagcdn.com/w40/hr.png' },
  { code: 'sk', name: 'Slovaque', flagUrl: 'https://flagcdn.com/w40/sk.png' },
  { code: 'sl', name: 'Slovène', flagUrl: 'https://flagcdn.com/w40/si.png' },
  { code: 'lt', name: 'Lituanien', flagUrl: 'https://flagcdn.com/w40/lt.png' },
  { code: 'lv', name: 'Letton', flagUrl: 'https://flagcdn.com/w40/lv.png' },
  { code: 'et', name: 'Estonien', flagUrl: 'https://flagcdn.com/w40/ee.png' },
  { code: 'uk', name: 'Ukrainien', flagUrl: 'https://flagcdn.com/w40/ua.png' },
  { code: 'th', name: 'Thaï', flagUrl: 'https://flagcdn.com/w40/th.png' },
  { code: 'vi', name: 'Vietnamien', flagUrl: 'https://flagcdn.com/w40/vn.png' },
  { code: 'id', name: 'Indonésien', flagUrl: 'https://flagcdn.com/w40/id.png' },
  { code: 'ms', name: 'Malais', flagUrl: 'https://flagcdn.com/w40/my.png' },
  { code: 'tl', name: 'Tagalog', flagUrl: 'https://flagcdn.com/w40/ph.png' },
  { code: 'he', name: 'Hébreu', flagUrl: 'https://flagcdn.com/w40/il.png' },
  { code: 'fa', name: 'Persan', flagUrl: 'https://flagcdn.com/w40/ir.png' },
  { code: 'ur', name: 'Ourdou', flagUrl: 'https://flagcdn.com/w40/pk.png' },
  { code: 'bn', name: 'Bengali', flagUrl: 'https://flagcdn.com/w40/bd.png' },
  { code: 'ta', name: 'Tamoul', flagUrl: 'https://flagcdn.com/w40/lk.png' },
  { code: 'te', name: 'Télougou', flagUrl: 'https://flagcdn.com/w40/in.png' },
  { code: 'mr', name: 'Marathi', flagUrl: 'https://flagcdn.com/w40/in.png' },
  { code: 'sw', name: 'Swahili', flagUrl: 'https://flagcdn.com/w40/ke.png' },
  { code: 'af', name: 'Afrikaans', flagUrl: 'https://flagcdn.com/w40/za.png' },
  { code: 'am', name: 'Amharique', flagUrl: 'https://flagcdn.com/w40/et.png' },
  { code: 'is', name: 'Islandais', flagUrl: 'https://flagcdn.com/w40/is.png' },
  { code: 'mt', name: 'Maltais', flagUrl: 'https://flagcdn.com/w40/mt.png' },
  { code: 'ga', name: 'Irlandais', flagUrl: 'https://flagcdn.com/w40/ie.png' },
  { code: 'cy', name: 'Gallois', flagUrl: 'https://flagcdn.com/w40/gb-wls.png' },
  { code: 'eu', name: 'Basque', flagUrl: 'https://flagcdn.com/w40/es.png' },
];

interface LanguageVersion {
  code: string;
  name: string;
  flagUrl: string;
  scenarioId: string;
  isCurrentScenario: boolean;
}

interface LanguageTranslatorProps {
  allLanguageVersions: LanguageVersion[];
  onTranslate: (languageCode: string, languageName: string) => void;
  onSwitchLanguage: (languageCode: string) => void;
  isTranslating: boolean;
}

export function LanguageTranslator({ 
  allLanguageVersions, 
  onTranslate, 
  onSwitchLanguage, 
  isTranslating 
}: LanguageTranslatorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLanguage = (lang: Language) => {
    onTranslate(lang.code, lang.name);
    setShowDropdown(false);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showDropdown) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Animation de chargement pendant la traduction */}
        {isTranslating && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Traduction en cours...</p>
                <p className="text-xs text-blue-700">Veuillez patienter quelques instants</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Traduction</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Générez une version traduite de votre scénario dans une autre langue
        </p>

        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            variant="outline"
            className="w-full justify-between gap-2"
            disabled={isTranslating}
          >
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span>{isTranslating ? 'Traduction en cours...' : 'Générer dans une nouvelle langue'}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </Button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Rechercher une langue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto">
                {filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <img src={lang.flagUrl} alt={lang.name} className="w-6 h-4 object-cover rounded" />
                    <span className="text-sm text-gray-900">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Boutons de langues disponibles */}
        {allLanguageVersions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Langues disponibles :</p>
            <div className="flex flex-wrap gap-2">
              {/* Afficher tous les boutons de langues */}
              {allLanguageVersions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => !lang.isCurrentScenario && onSwitchLanguage(lang.code)}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                    lang.isCurrentScenario
                      ? 'bg-blue-500 border-2 border-blue-600 cursor-default'
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <img src={lang.flagUrl} alt={lang.name} className="w-5 h-3.5 object-cover rounded" />
                  <span className={`font-medium ${
                    lang.isCurrentScenario ? 'text-white' : 'text-gray-900'
                  }`}>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
