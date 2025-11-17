import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { X, Upload, FileText, Link as LinkIcon } from 'lucide-react';
import { Persona, PersonaDetails } from '@/types';
import { extractPersonaFromDocuments, extractPersonaFromUrl } from '@/services/openai';
import { getAssetUrl } from '@/lib/assets';

interface CreatePersonaModalProps {
  persona?: Persona;
  onClose: () => void;
}

export function CreatePersonaModal({ persona, onClose }: CreatePersonaModalProps) {
  const addPersona = useStore((state) => state.addPersona);
  const updatePersona = useStore((state) => state.updatePersona);
  const addToast = useStore((state) => state.addToast);

  const [mode, setMode] = useState<'choose' | 'manual' | 'upload' | 'url'>('choose');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [personaUrl, setPersonaUrl] = useState('');
  const [personaAvatar, setPersonaAvatar] = useState<string | undefined>(
    persona?.avatar || getAssetUrl('/images/personnats/avatar.png')
  );
  const [saveDocument, setSaveDocument] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | undefined>(persona?.sourceUrl);
  const [sourceDocument, setSourceDocument] = useState<{name: string; content: string; type: string} | undefined>(persona?.sourceDocument);
  
  const [formData, setFormData] = useState<PersonaDetails>(
    persona?.details || {
      firstName: '',
      age: 30,
      profession: '',
      location: '',
      lifestyle: '',
      values: '',
      tone: '',
      language: '',
      emotion: '',
      salesReaction: '',
      comfortFactors: '',
      propositionPreference: '',
      buyingMotivation: '',
      screeneProfile: '',
      screeneMotivation: '',
      buyingHabits: '',
      buyingFrequency: '',
      buyingLocation: '',
      recentPurchase: '',
      summary: '',
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleUploadAndExtract = async () => {
    if (files.length === 0) {
      addToast({ type: 'error', message: 'Veuillez sélectionner au moins un fichier' });
      return;
    }

    setLoading(true);
    try {
      const extractedData = await extractPersonaFromDocuments(files);
      setFormData(extractedData);
      
      // Sauvegarder le document si demandé
      if (saveDocument && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setSourceDocument({
            name: files[0].name,
            content: content.split(',')[1],
            type: files[0].type
          });
        };
        reader.readAsDataURL(files[0]);
      }
      
      setMode('manual');
      addToast({
        type: 'success',
        message: 'Informations extraites avec succès ! Vous pouvez les modifier si nécessaire.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de l\'extraction des informations. Veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUrlExtract = async () => {
    if (!personaUrl.trim()) {
      addToast({ type: 'error', message: 'Veuillez entrer une URL valide' });
      return;
    }

    try {
      new URL(personaUrl);
    } catch {
      addToast({ type: 'error', message: 'L\'URL entrée n\'est pas valide' });
      return;
    }

    setLoading(true);
    try {
      const extractedData = await extractPersonaFromUrl(personaUrl);
      setFormData(extractedData);
      setSourceUrl(personaUrl); // Sauvegarder l'URL source
      setMode('manual');
      addToast({
        type: 'success',
        message: 'Informations extraites avec succès depuis le site ! Vous pouvez les modifier si nécessaire.',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de l\'extraction des informations depuis l\'URL. Veuillez réessayer.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.profession) {
      addToast({
        type: 'error',
        message: 'Veuillez remplir au moins le prénom et la profession',
      });
      return;
    }

    const now = new Date().toISOString();
    
    if (persona) {
      updatePersona(persona.id, {
        details: formData,
        avatar: personaAvatar,
        sourceUrl: sourceUrl,
        sourceDocument: sourceDocument,
        updatedAt: now,
      });
      addToast({ type: 'success', message: 'Persona mise à jour avec succès' });
    } else {
      const newPersona: Persona = {
        id: `persona-${Date.now()}`,
        details: formData,
        avatar: personaAvatar,
        sourceUrl: sourceUrl,
        sourceDocument: sourceDocument,
        createdAt: now,
        updatedAt: now,
      };
      addPersona(newPersona);
      addToast({ type: 'success', message: 'Persona créée avec succès' });
    }

    onClose();
  };

  const handleChange = (field: keyof PersonaDetails, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isDisabled = mode === 'choose';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {persona ? 'Modifier la persona' : 'Créer une nouvelle persona'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                {persona 
                  ? 'Comment souhaitez-vous modifier votre persona client ?'
                  : 'Comment souhaitez-vous créer votre persona client ?'
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => setMode('manual')}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      {persona ? 'Modifier manuellement' : 'Remplir manuellement'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {persona 
                        ? 'Modifiez les informations de la persona dans le formulaire'
                        : 'Remplissez vous-même les informations de la persona dans le formulaire'
                      }
                    </p>
                  </div>
                </Card>

                <Card
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => setMode('upload')}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Depuis mes documents</h3>
                    <p className="text-sm text-gray-600">
                      {persona
                        ? 'Importez de nouveaux documents pour mettre à jour les informations'
                        : 'Importez vos fiches personas (PDF, TXT) et laissez l\'IA extraire les informations'
                      }
                    </p>
                  </div>
                </Card>

                <Card
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => setMode('url')}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <LinkIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Depuis un lien web</h3>
                    <p className="text-sm text-gray-600">
                      {persona
                        ? 'Entrez une nouvelle URL pour mettre à jour les informations'
                        : 'Entrez l\'URL d\'un article ou profil client et laissez l\'IA extraire les informations'
                      }
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {mode === 'upload' && files.length === 0 && (
            <div className="space-y-4">
              <Button
                onClick={() => setMode('choose')}
                variant="ghost"
                size="sm"
                className="mb-4"
              >
                ← Retour
              </Button>
              
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragOver ? 'border-blue-400 bg-blue-50/40' : 'border-gray-300'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const related = e.relatedTarget as Node | null;
                  if (!related || !e.currentTarget.contains(related)) {
                    setIsDragOver(false);
                  }
                }}
                onDrop={(e) => {
                  setIsDragOver(false);
                  handleDropFiles(e);
                }}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Glissez-déposez vos documents ici
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  ou cliquez pour sélectionner des fichiers (PDF, TXT)
                </p>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="persona-file-upload"
                />
                <label htmlFor="persona-file-upload">
                  <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    Sélectionner des fichiers
                  </span>
                </label>
              </div>
            </div>
          )}

          {mode === 'upload' && files.length > 0 && (
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setFiles([]);
                  setMode('choose');
                }}
                variant="ghost"
                size="sm"
                className="mb-4"
              >
                ← Retour
              </Button>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-2">Fichiers sélectionnés:</h3>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    {file.name}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="saveDocumentPersona"
                  checked={saveDocument}
                  onChange={(e) => setSaveDocument(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="saveDocumentPersona" className="text-sm text-gray-700 cursor-pointer">
                  Conserver le document dans l'application (accessible depuis la fiche persona)
                </label>
              </div>

              <Button
                onClick={handleUploadAndExtract}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Extraction en cours...' : 'Extraire les informations'}
              </Button>
            </div>
          )}

          {mode === 'url' && (
            <div className="space-y-4">
              <Button
                onClick={() => setMode('choose')}
                variant="ghost"
                size="sm"
                className="mb-4"
              >
                ← Retour
              </Button>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Extraction depuis un article ou profil web
                  </h3>
                  <p className="text-sm text-green-800">
                    Entrez l'URL d'un article de blog, étude de cas, ou profil client et l'IA analysera 
                    automatiquement le contenu pour créer une persona.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la persona *
                  </label>
                  <Input
                    type="url"
                    value={personaUrl}
                    onChange={(e) => setPersonaUrl(e.target.value)}
                    placeholder="https://www.exemple.com/blog/profil-client-sophie"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'URL doit pointer vers un article ou profil contenant des informations sur un client type
                  </p>
                </div>

                <Button
                  onClick={handleUrlExtract}
                  disabled={loading || !personaUrl.trim()}
                  className="w-full"
                >
                  {loading ? 'Extraction en cours...' : 'Extraire les informations depuis l\'URL'}
                </Button>
              </div>
            </div>
          )}

          {mode === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Avatar de la persona */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avatar de la persona
                </label>
                <div className="flex items-start gap-4">
                  {personaAvatar && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                      <img 
                        src={personaAvatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setPersonaAvatar(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="persona-avatar"
                    />
                    <label 
                      htmlFor="persona-avatar"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {personaAvatar ? 'Changer l\'avatar' : 'Ajouter un avatar'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Afficher l'URL source si elle existe */}
              {sourceUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    <span className="font-medium">Source:</span>
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">
                      {sourceUrl.length > 50 ? sourceUrl.substring(0, 50) + '...' : sourceUrl}
                    </a>
                  </p>
                </div>
              )}

              {/* Afficher le document source si il existe */}
              {sourceDocument && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">Document source:</span>
                    <span>{sourceDocument.name}</span>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Prénom *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quel est le prénom de cette personne ?
                  </p>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder='ex: Sophie'
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âge approximatif *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quel est son âge ?
                  </p>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                    placeholder='ex: 32'
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Profession ou domaine d'activité
                  </p>
                  <Input
                    value={formData.profession}
                    onChange={(e) => handleChange('profession', e.target.value)}
                    placeholder='ex: Directrice marketing'
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Où vit-elle ou travaille-t-elle ?
                  </p>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder='ex: Paris, environnement urbain'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Style de vie
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Style de vie général
                  </p>
                  <Input
                    value={formData.lifestyle}
                    onChange={(e) => handleChange('lifestyle', e.target.value)}
                    placeholder='ex: actif, citadin, créatif'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeurs et centres d'intérêt
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Valeurs ou centres d'intérêt principaux
                  </p>
                  <Input
                    value={formData.values}
                    onChange={(e) => handleChange('values', e.target.value)}
                    placeholder='ex: esthétique, bien-être, durabilité'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. Ton de voix
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Comment s'exprime-t-elle ?
                  </p>
                  <Input
                    value={formData.tone}
                    onChange={(e) => handleChange('tone', e.target.value)}
                    placeholder='ex: calme, énergique, confiante'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de langage
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quel langage utilise-t-elle ?
                  </p>
                  <Input
                    value={formData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    placeholder='ex: simple et concret, soutenu, chaleureux'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Émotion dominante
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quelle émotion ressort quand elle parle ?
                  </p>
                  <Input
                    value={formData.emotion}
                    onChange={(e) => handleChange('emotion', e.target.value)}
                    placeholder='ex: curiosité, enthousiasme, prudence'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    4. Réaction face à un vendeur
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Comment réagit-elle ?
                  </p>
                  <Input
                    value={formData.salesReaction}
                    onChange={(e) => handleChange('salesReaction', e.target.value)}
                    placeholder='ex: écoute attentive, comparaison, hésitation'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facteurs de confort/frein
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Qu'est-ce qui la met à l'aise ou la freine ?
                  </p>
                  <Input
                    value={formData.comfortFactors}
                    onChange={(e) => handleChange('comfortFactors', e.target.value)}
                    placeholder="ex: trop de choix, insistance, manque d'écoute"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Préférence de proposition
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Peu de choix ciblés ou toutes les options ?
                  </p>
                  <Input
                    value={formData.propositionPreference}
                    onChange={(e) => handleChange('propositionPreference', e.target.value)}
                    placeholder='ex: préfère 2-3 options bien ciblées'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivation d'achat
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Motivation principale quand elle achète
                  </p>
                  <Input
                    value={formData.buyingMotivation}
                    onChange={(e) => handleChange('buyingMotivation', e.target.value)}
                    placeholder='ex: plaisir, besoin, statut, curiosité'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    5. Profil S.C.R.E.E.N.E
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Profil dominant selon la grille S.C.R.E.E.N.E
                  </p>
                  <Input
                    value={formData.screeneProfile}
                    onChange={(e) => handleChange('screeneProfile', e.target.value)}
                    placeholder='ex: Esthète, Rationnel, Émotionnel'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivation S.C.R.E.E.N.E
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Motivation spécifique selon S.C.R.E.E.N.E
                  </p>
                  <Input
                    value={formData.screeneMotivation}
                    onChange={(e) => handleChange('screeneMotivation', e.target.value)}
                    placeholder='ex: Rechercher la beauté simple et efficace'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6. Habitudes d'achat
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Types de produits/marques achetés
                  </p>
                  <Input
                    value={formData.buyingHabits}
                    onChange={(e) => handleChange('buyingHabits', e.target.value)}
                    placeholder='ex: marques premium, produits naturels'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence d'achat
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    À quelle fréquence achète-t-elle ?
                  </p>
                  <Input
                    value={formData.buyingFrequency}
                    onChange={(e) => handleChange('buyingFrequency', e.target.value)}
                    placeholder='ex: 2-3 fois par mois'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu d'achat
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Où effectue-t-elle ses achats ?
                  </p>
                  <Input
                    value={formData.buyingLocation}
                    onChange={(e) => handleChange('buyingLocation', e.target.value)}
                    placeholder='ex: en ligne, boutiques, grands magasins'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achat récent (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Exemple d'achat récent
                  </p>
                  <Input
                    value={formData.recentPurchase}
                    onChange={(e) => handleChange('recentPurchase', e.target.value)}
                    placeholder='ex: Rouge à lèvres Chanel il y a 6 mois'
                    disabled={isDisabled}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    7. Synthèse (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Décrivez cette personne en une phrase
                  </p>
                  <Input
                    value={formData.summary}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    placeholder='ex: Une femme posée, raffinée, qui aime les choses simples et durables'
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" onClick={onClose} variant="outline">
                  Annuler
                </Button>
                <Button type="submit">
                  {persona ? 'Mettre à jour' : 'Créer la persona'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
