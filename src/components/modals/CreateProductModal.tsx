import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { X, Upload, FileText, Link as LinkIcon } from 'lucide-react';
import { Product, ProductDetails } from '@/types';
import { extractProductFromDocuments, extractProductFromUrl } from '@/services/openai';

interface CreateProductModalProps {
  product?: Product;
  onClose: () => void;
}

export function CreateProductModal({ product, onClose }: CreateProductModalProps) {
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const addToast = useStore((state) => state.addToast);

  const [mode, setMode] = useState<'choose' | 'manual' | 'upload' | 'url'>('choose');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [productImage, setProductImage] = useState<string | undefined>(
    product?.image || '/images/lipstick.png'
  );
  const [saveDocument, setSaveDocument] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | undefined>(product?.sourceUrl);
  const [sourceDocument, setSourceDocument] = useState<{name: string; content: string; type: string} | undefined>(product?.sourceDocument);
  
  const [formData, setFormData] = useState<ProductDetails>(
    product?.details || {
      name: '',
      category: '',
      shade: '',
      shadeDescription: '',
      finish: '',
      finishDescription: '',
      benefit: '',
      benefitTarget: '',
      texture: '',
      application: '',
      duration: '',
      resistance: '',
      positioning: '',
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
      const extractedData = await extractProductFromDocuments(files);
      setFormData(extractedData);
      
      // Sauvegarder le document si demandé
      if (saveDocument && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setSourceDocument({
            name: files[0].name,
            content: content.split(',')[1], // Enlever le préfixe data:...
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
    if (!productUrl.trim()) {
      addToast({ type: 'error', message: 'Veuillez entrer une URL valide' });
      return;
    }

    // Validation basique de l'URL
    try {
      new URL(productUrl);
    } catch {
      addToast({ type: 'error', message: 'L\'URL entrée n\'est pas valide' });
      return;
    }

    setLoading(true);
    try {
      const extractedData = await extractProductFromUrl(productUrl);
      setFormData(extractedData);
      setSourceUrl(productUrl); // Sauvegarder l'URL source
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

    // Validation
    if (!formData.name || !formData.category) {
      addToast({
        type: 'error',
        message: 'Veuillez remplir au moins le nom et la catégorie du produit',
      });
      return;
    }

    const now = new Date().toISOString();
    
    if (product) {
      // Update existing product
      updateProduct(product.id, {
        details: formData,
        image: productImage,
        sourceUrl: sourceUrl,
        sourceDocument: sourceDocument,
        updatedAt: now,
      });
      addToast({ type: 'success', message: 'Produit mis à jour avec succès' });
    } else {
      // Create new product
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        details: formData,
        image: productImage,
        sourceUrl: sourceUrl,
        sourceDocument: sourceDocument,
        createdAt: now,
        updatedAt: now,
      };
      addProduct(newProduct);
      addToast({ type: 'success', message: 'Produit créé avec succès' });
    }

    onClose();
  };

  const handleChange = (field: keyof ProductDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isDisabled = mode === 'choose';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Modifier le produit' : 'Créer un nouveau produit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                {product 
                  ? 'Comment souhaitez-vous modifier votre fiche produit ?'
                  : 'Comment souhaitez-vous créer votre fiche produit ?'
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
                      {product ? 'Modifier manuellement' : 'Remplir manuellement'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {product 
                        ? 'Modifiez les informations du produit dans le formulaire'
                        : 'Remplissez vous-même les informations du produit dans le formulaire'
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
                      {product
                        ? 'Importez de nouveaux documents pour mettre à jour les informations'
                        : 'Importez vos fiches produits (PDF, TXT) et laissez l\'IA extraire les informations'
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
                      {product
                        ? 'Entrez une nouvelle URL pour mettre à jour les informations'
                        : 'Entrez l\'URL d\'un produit sur un site marchand et laissez l\'IA extraire les informations'
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
                  id="file-upload"
                />
                <label htmlFor="file-upload">
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
                  id="saveDocument"
                  checked={saveDocument}
                  onChange={(e) => setSaveDocument(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="saveDocument" className="text-sm text-gray-700 cursor-pointer">
                  Conserver le document dans l'application (accessible depuis la fiche produit)
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Extraction intelligente depuis URL
                  </h3>
                  <p className="text-sm text-blue-800 mb-2">
                    Entrez l'URL d'une page produit et l'IA analysera l'URL pour inférer intelligemment les informations du produit.
                  </p>
                  <p className="text-xs text-blue-700 italic">
                    💡 L'IA utilise l'URL et ses connaissances pour créer un profil produit cohérent. Vous pourrez modifier les informations après extraction.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du produit *
                  </label>
                  <Input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://www.exemple.com/produit/rouge-a-levres-capri-coral"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'URL doit pointer vers une page produit spécifique
                  </p>
                </div>

                <Button
                  onClick={handleUrlExtract}
                  disabled={loading || !productUrl.trim()}
                  className="w-full"
                >
                  {loading ? 'Extraction en cours...' : 'Extraire les informations depuis l\'URL'}
                </Button>
              </div>
            </div>
          )}

          {mode === 'manual' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Image du produit */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image du produit (optionnel)
                </label>
                <div className="flex items-start gap-4">
                  {productImage && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img 
                        src={productImage} 
                        alt="Produit" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setProductImage(undefined)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
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
                            setProductImage(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="product-image"
                    />
                    <label 
                      htmlFor="product-image"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      {productImage ? 'Changer l\'image' : 'Ajouter une image'}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG ou GIF (max 5MB)
                    </p>
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
                    1. Nom du produit *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quel est le nom commercial ou créatif du produit ?
                  </p>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder='ex: "Capri Coral", "Tokyo Velvet"'
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Catégorie / Type *
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    De quel type de produit s'agit-il ?
                  </p>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder='ex: rouge à lèvres, fond de teint, parfum'
                    disabled={isDisabled}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3. Teinte / Couleur / Variante
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quelle est la couleur, teinte ou variante principale ?
                  </p>
                  <Input
                    value={formData.shade}
                    onChange={(e) => handleChange('shade', e.target.value)}
                    placeholder='ex: "luminous coral", "deep blue-toned red"'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description évocatrice de la teinte
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Comment décrire cette teinte en une phrase ?
                  </p>
                  <Input
                    value={formData.shadeDescription}
                    onChange={(e) => handleChange('shadeDescription', e.target.value)}
                    placeholder='ex: "a sunny coral that brightens tanned skin"'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    4. Finition / Aspect visuel
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quel est le fini visuel ou le rendu final ?
                  </p>
                  <Input
                    value={formData.finish}
                    onChange={(e) => handleChange('finish', e.target.value)}
                    placeholder='ex: satin, matte velvet, glossy'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ce que suggère ce fini
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Visuellement ou émotionnellement ?
                  </p>
                  <Input
                    value={formData.finishDescription}
                    onChange={(e) => handleChange('finishDescription', e.target.value)}
                    placeholder='ex: élégant, lumineux, naturel'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    5. Bénéfice clé / Promesse
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quel est le bénéfice principal du produit ?
                  </p>
                  <Input
                    value={formData.benefit}
                    onChange={(e) => handleChange('benefit', e.target.value)}
                    placeholder='ex: "adds radiance", "whitens teeth visually"'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pour quel type de personne/situation ?
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Ce bénéfice est idéal pour...
                  </p>
                  <Input
                    value={formData.benefitTarget}
                    onChange={(e) => handleChange('benefitTarget', e.target.value)}
                    placeholder='ex: peaux bronzées, looks de soirée'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6. Texture / Sensation
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Comment décrire la texture ou le toucher ?
                  </p>
                  <Input
                    value={formData.texture}
                    onChange={(e) => handleChange('texture', e.target.value)}
                    placeholder='ex: "smooth and creamy", "non-sticky gel"'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sensation à l'application
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quelle sensation lors de l'utilisation ?
                  </p>
                  <Input
                    value={formData.application}
                    onChange={(e) => handleChange('application', e.target.value)}
                    placeholder='ex: glisse facilement, effet seconde peau'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    7. Durée / Tenue
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Durée moyenne d'efficacité ?
                  </p>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder='ex: "6 to 8 hours", "up to 12 hours"'
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Résistance
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Résistant à certaines conditions ?
                  </p>
                  <Input
                    value={formData.resistance}
                    onChange={(e) => handleChange('resistance', e.target.value)}
                    placeholder='ex: transfert, chaleur, humidité'
                    disabled={isDisabled}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    8. Positionnement émotionnel (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Quelle émotion, ambiance ou univers évoque-t-il ?
                  </p>
                  <Input
                    value={formData.positioning}
                    onChange={(e) => handleChange('positioning', e.target.value)}
                    placeholder='ex: "chic parisien", "été tropical"'
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" onClick={onClose} variant="outline">
                  Annuler
                </Button>
                <Button type="submit">
                  {product ? 'Mettre à jour' : 'Créer le produit'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
