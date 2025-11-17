import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { CreateProductModal } from '@/components/modals/CreateProductModal';
import { Product } from '@/types';

export function ProductsTab() {
  const products = useStore((state) => state.products);
  const removeProduct = useStore((state) => state.removeProduct);
  const addToast = useStore((state) => state.addToast);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Écouter l'événement pour ouvrir la popup de création
    const handleOpenCreateProduct = () => {
      setShowCreateModal(true);
    };

    window.addEventListener('openCreateProduct', handleOpenCreateProduct as EventListener);
    return () => {
      window.removeEventListener('openCreateProduct', handleOpenCreateProduct as EventListener);
    };
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      removeProduct(id);
      addToast({
        type: 'success',
        message: 'Produit supprimé avec succès',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produits</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les fiches produits que vos vendeurs devront présenter
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau produit
        </Button>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun produit pour le moment
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              Créez votre première fiche produit en remplissant manuellement les informations
              ou en important vos documents produits existants.
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer mon premier produit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  {product.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200">
                      <img 
                        src={product.image} 
                        alt={product.details.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {product.details.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.details.category}</p>
                    {(product.sourceUrl || product.sourceDocument) && (
                      <div className="flex gap-2 mt-2">
                        {product.sourceUrl && (
                          <a 
                            href={product.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            title="Voir la source"
                          >
                            🔗 Source
                          </a>
                        )}
                        {product.sourceDocument && (
                          <span className="text-xs text-gray-600 flex items-center gap-1" title={product.sourceDocument.name}>
                            📄 Document
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Teinte:</span> {product.details.shade}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Finition:</span> {product.details.finish}
                    </p>
                    <p className="text-gray-600 line-clamp-2">
                      <span className="font-medium">Bénéfice:</span> {product.details.benefit}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      onClick={() => setEditingProduct(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateProductModal onClose={() => setShowCreateModal(false)} />
      )}
      {editingProduct && (
        <CreateProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
