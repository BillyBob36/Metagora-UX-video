import { useState, useEffect } from 'react';
import { ScenariosTab } from '@/components/tabs/ScenariosTab';
import { ProductsTab } from '@/components/tabs/ProductsTab';
import { PersonasTab } from '@/components/tabs/PersonasTab';
import { Layers, Package, Users } from 'lucide-react';
import { getAssetUrl } from '@/lib/assets';

type TabType = 'scenarios' | 'products' | 'personas';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('scenarios');

  useEffect(() => {
    // Écouter les événements de changement d'onglet
    const handleSwitchTab = (event: CustomEvent<TabType>) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('switchTab', handleSwitchTab as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleSwitchTab as EventListener);
    };
  }, []);

  const tabs = [
    { id: 'scenarios' as TabType, label: 'Mes scénarios de formation', icon: Layers },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'personas' as TabType, label: 'Personas clients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={getAssetUrl('/images/Logo-Metagora-Black.png')}
              alt="Metagora" 
              className="h-8 w-auto"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">Plateforme de création de scénarios de formation</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'scenarios' && <ScenariosTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'personas' && <PersonasTab />}
      </div>
    </div>
  );
}
