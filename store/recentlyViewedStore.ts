import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  viewedAt: number;
}

interface RecentlyViewedState {
  products: RecentProduct[];
  addProduct: (product: Omit<RecentProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
  getRecent: (limit?: number, excludeId?: string) => RecentProduct[];
}

const MAX_RECENT_PRODUCTS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.products.filter((p) => p.id !== product.id);
          
          // Add to front with timestamp
          const updated = [
            { ...product, viewedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_PRODUCTS);
          
          return { products: updated };
        });
      },
      
      clearHistory: () => set({ products: [] }),
      
      getRecent: (limit = 8, excludeId) => {
        const { products } = get();
        return products
          .filter((p) => p.id !== excludeId)
          .slice(0, limit);
      },
    }),
    {
      name: 'auracase-recently-viewed',
    }
  )
);
