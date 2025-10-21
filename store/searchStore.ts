'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultsCount?: number;
}

interface SearchFilters {
  category: string;
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  inStock: boolean;
  featured: boolean;
}

interface SearchStore {
  searchHistory: SearchHistoryItem[];
  recentSearches: string[];
  savedSearches: SearchHistoryItem[];
  filters: SearchFilters;
  isAdvancedSearchOpen: boolean;
  
  // Actions
  addToHistory: (query: string, resultsCount?: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  saveSearch: (id: string) => void;
  unsaveSearch: (id: string) => void;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setAdvancedSearchOpen: (open: boolean) => void;
  getRecentSearches: (limit?: number) => string[];
  getPopularSearches: () => string[];
}

const defaultFilters: SearchFilters = {
  category: 'all',
  priceRange: [0, 1000],
  brands: [],
  colors: [],
  sizes: [],
  rating: 0,
  inStock: false,
  featured: false,
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      searchHistory: [],
      recentSearches: [],
      savedSearches: [],
      filters: defaultFilters,
      isAdvancedSearchOpen: false,

      addToHistory: (query: string, resultsCount?: number) => {
        const { searchHistory } = get();
        const trimmedQuery = query.trim().toLowerCase();
        
        if (!trimmedQuery) return;

        // Remove existing entry if it exists
        const filteredHistory = searchHistory.filter(item => item.query !== trimmedQuery);
        
        // Add new entry at the beginning
        const newItem: SearchHistoryItem = {
          id: Date.now().toString(),
          query: trimmedQuery,
          timestamp: Date.now(),
          resultsCount,
        };

        const updatedHistory = [newItem, ...filteredHistory].slice(0, 50); // Keep last 50 searches
        
        // Update recent searches (last 10)
        const recentSearches = updatedHistory.slice(0, 10).map(item => item.query);

        set({ 
          searchHistory: updatedHistory,
          recentSearches,
        });
      },

      removeFromHistory: (id: string) => {
        const { searchHistory } = get();
        set({ 
          searchHistory: searchHistory.filter(item => item.id !== id),
          recentSearches: searchHistory.filter(item => item.id !== id).slice(0, 10).map(item => item.query),
        });
      },

      clearHistory: () => {
        set({ 
          searchHistory: [],
          recentSearches: [],
        });
      },

      saveSearch: (id: string) => {
        const { searchHistory, savedSearches } = get();
        const item = searchHistory.find(item => item.id === id);
        
        if (item && !savedSearches.find(saved => saved.id === id)) {
          set({ savedSearches: [...savedSearches, item] });
        }
      },

      unsaveSearch: (id: string) => {
        const { savedSearches } = get();
        set({ savedSearches: savedSearches.filter(item => item.id !== id) });
      },

      updateFilters: (newFilters: Partial<SearchFilters>) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      setAdvancedSearchOpen: (open: boolean) => {
        set({ isAdvancedSearchOpen: open });
      },

      getRecentSearches: (limit: number = 10) => {
        const { recentSearches } = get();
        return recentSearches.slice(0, limit);
      },

      getPopularSearches: () => {
        const { searchHistory } = get();
        
        // Count frequency of searches
        const frequency: { [key: string]: number } = {};
        searchHistory.forEach(item => {
          frequency[item.query] = (frequency[item.query] || 0) + 1;
        });

        // Sort by frequency and return top searches
        return Object.entries(frequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([query]) => query);
      },
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({ 
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
        savedSearches: state.savedSearches,
      }),
    }
  )
);
