'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  category: {
    name: string;
    slug: string;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (item: WishlistItem) => {
        const { items } = get();
        
        // Check if item already exists
        if (items.some(wishlistItem => wishlistItem.id === item.id)) {
          return;
        }

        // Add to local state only (no server sync)
        set({ items: [...items, item] });
      },

      removeItem: async (productId: string) => {
        const { items } = get();
        
        // Remove from local state only (no server sync)
        set({ items: items.filter(item => item.id !== productId) });
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      syncWithServer: async () => {
        // No longer syncing with server (auth removed)
        // Wishlist is stored locally only
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
