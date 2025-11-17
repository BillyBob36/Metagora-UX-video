import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { CreatePersonaModal } from '@/components/modals/CreatePersonaModal';
import { Persona } from '@/types';

export function PersonasTab() {
  const personas = useStore((state) => state.personas);
  const removePersona = useStore((state) => state.removePersona);
  const addToast = useStore((state) => state.addToast);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  useEffect(() => {
    // Écouter l'événement pour ouvrir la popup de création
    const handleOpenCreatePersona = () => {
      setShowCreateModal(true);
    };

    window.addEventListener('openCreatePersona', handleOpenCreatePersona as EventListener);
    return () => {
      window.removeEventListener('openCreatePersona', handleOpenCreatePersona as EventListener);
    };
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette persona ?')) {
      removePersona(id);
      addToast({
        type: 'success',
        message: 'Persona supprimée avec succès',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personas clients</h2>
          <p className="text-sm text-gray-600 mt-1">
            Créez les profils clients auxquels vos vendeurs seront confrontés
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Créer une nouvelle persona
        </Button>
      </div>

      {/* Personas List */}
      {personas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune persona pour le moment
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-md mb-6">
              Créez votre première persona client en remplissant manuellement les informations
              ou en important vos documents personas existants.
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Créer ma première persona
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {persona.avatar ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                      <img 
                        src={persona.avatar} 
                        alt={persona.details.firstName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
                      {persona.details.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {persona.details.firstName}, {persona.details.age} ans
                    </h3>
                    <p className="text-sm text-gray-600">{persona.details.profession}</p>
                    {(persona.sourceUrl || persona.sourceDocument) && (
                      <div className="flex gap-2 mt-2">
                        {persona.sourceUrl && (
                          <a 
                            href={persona.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            title="Voir la source"
                          >
                            🔗 Source
                          </a>
                        )}
                        {persona.sourceDocument && (
                          <span className="text-xs text-gray-600 flex items-center gap-1" title={persona.sourceDocument.name}>
                            📄 Document
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="text-sm space-y-1">
                    <p className="text-gray-600">
                      <span className="font-medium">Style:</span> {persona.details.lifestyle}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Profil S.C.R.E.E.N.E:</span>{' '}
                      {persona.details.screeneProfile}
                    </p>
                    {persona.details.summary && (
                      <p className="text-gray-600 italic line-clamp-2">
                        "{persona.details.summary}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 mt-3 border-t">
                  <Button
                    onClick={() => setEditingPersona(persona)}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(persona.id)}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreatePersonaModal onClose={() => setShowCreateModal(false)} />
      )}
      {editingPersona && (
        <CreatePersonaModal
          persona={editingPersona}
          onClose={() => setEditingPersona(null)}
        />
      )}
    </div>
  );
}
