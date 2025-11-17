import { create } from 'zustand';
import { Product, Persona, Scenario, Toast, GenerationProgress } from '@/types';
import { initialPersonas } from '@/data/initialPersonas';

interface StoreState {
  // Data
  products: Product[];
  personas: Persona[];
  scenarios: Scenario[];
  
  // UI State
  toasts: Toast[];
  loading: boolean;
  generationProgress: GenerationProgress | null;
  
  // Selected items
  selectedProductId: string | null;
  selectedPersonaId: string | null;
  selectedScenarioId: string | null;
  
  // Actions - Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  
  // Actions - Personas
  addPersona: (persona: Persona) => void;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  removePersona: (id: string) => void;
  setPersonas: (personas: Persona[]) => void;
  
  // Actions - Scenarios
  addScenario: (scenario: Scenario) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  removeScenario: (id: string) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  publishScenario: (id: string) => void;
  
  // Actions - Selection
  selectProduct: (id: string | null) => void;
  selectPersona: (id: string | null) => void;
  selectScenario: (id: string | null) => void;
  
  // Actions - UI
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  products: [],
  personas: initialPersonas,
  scenarios: [],
  toasts: [],
  loading: false,
  generationProgress: null,
  selectedProductId: null,
  selectedPersonaId: null,
  selectedScenarioId: null,
  
  // Products
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),
  
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  
  setProducts: (products) => set({ products }),
  
  // Personas
  addPersona: (persona) =>
    set((state) => ({ personas: [...state.personas, persona] })),
  
  updatePersona: (id, updates) =>
    set((state) => ({
      personas: state.personas.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),
  
  removePersona: (id) =>
    set((state) => ({
      personas: state.personas.filter((p) => p.id !== id),
    })),
  
  setPersonas: (personas) => set({ personas }),
  
  // Scenarios
  addScenario: (scenario) =>
    set((state) => ({ scenarios: [scenario, ...state.scenarios] })),
  
  updateScenario: (id, updates) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      ),
    })),
  
  removeScenario: (id) =>
    set((state) => ({
      scenarios: state.scenarios.filter((s) => s.id !== id),
    })),
  
  setScenarios: (scenarios) => set({ scenarios }),
  
  publishScenario: (id) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === id ? { ...s, status: 'published', updatedAt: new Date().toISOString() } : s
      ),
    })),
  
  // Selection
  selectProduct: (id) => set({ selectedProductId: id }),
  selectPersona: (id) => set({ selectedPersonaId: id }),
  selectScenario: (id) => set({ selectedScenarioId: id }),
  
  // UI
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
    })),
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  
  setLoading: (loading) => set({ loading }),
  
  setGenerationProgress: (generationProgress) => set({ generationProgress }),
}));
