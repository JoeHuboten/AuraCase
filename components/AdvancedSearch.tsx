'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useSearchStore } from '@/store/searchStore';
import { useRouter } from 'next/navigation';
import ScrollAnimation from './ScrollAnimation';

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string, filters?: any) => void;
}

export default function AdvancedSearch({ isOpen, onClose, onSearch }: AdvancedSearchProps) {
  const router = useRouter();
  const {
    searchHistory,
    recentSearches,
    savedSearches,
    filters,
    updateFilters,
    resetFilters,
    addToHistory,
    removeFromHistory,
    clearHistory,
    saveSearch,
    unsaveSearch,
    getPopularSearches,
  } = useSearchStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'saved' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(false);

  const popularSearches = getPopularSearches();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query.trim());
      onSearch(query.trim(), filters);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const applyFilters = () => {
    handleSearch(searchQuery || '');
  };

  const clearAllFilters = () => {
    resetFilters();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <ScrollAnimation animation="scaleUp" className="bg-background-secondary border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Търсене</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-700">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Търсете продукти, марки, категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:bg-primary/70 transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
            >
              <FiFilter size={16} />
              <span>Филтри</span>
            </button>
            <button
              onClick={clearAllFilters}
              className="text-text-secondary hover:text-white transition-colors text-sm"
            >
              Изчисти всичко
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-6 border-b border-gray-700 bg-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-white font-medium mb-2">Ценови диапазон</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilters({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                    className="w-full px-3 py-2 bg-primary/50 border border-gray-700/50 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent/50"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                    className="w-full px-3 py-2 bg-primary/50 border border-gray-700/50 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent/50"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-white font-medium mb-2">Минимален рейтинг</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.rating}
                    onChange={(e) => updateFilters({ rating: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-white text-sm min-w-[3rem]">
                    {filters.rating > 0 ? `${filters.rating}★` : 'Всички'}
                  </span>
                </div>
              </div>

              {/* Stock & Featured */}
              <div className="md:col-span-2">
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => updateFilters({ inStock: e.target.checked })}
                      className="w-4 h-4 text-accent bg-primary/50 border-gray-700 rounded focus:ring-accent/50"
                    />
                    <span>В наличност</span>
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => updateFilters({ featured: e.target.checked })}
                      className="w-4 h-4 text-accent bg-primary/50 border-gray-700 rounded focus:ring-accent/50"
                    />
                    <span>Препоръчани</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="w-full mt-4 bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent-light transition-colors"
            >
              Приложи филтрите
            </button>
          </div>
        )}

        {/* Search Suggestions */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-primary/30 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <FiClock size={16} className="inline mr-2" />
              Последни
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <FiStar size={16} className="inline mr-2" />
              Запазени
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'popular'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <FiTrendingUp size={16} className="inline mr-2" />
              Популярни
            </button>
          </div>

          {/* Search Results */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeTab === 'recent' && (
              <>
                {recentSearches.length > 0 ? (
                  recentSearches.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-primary/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white group-hover:text-accent transition-colors">
                          {query}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(searchHistory.find(item => item.query === query)?.id || '');
                          }}
                          className="text-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-4">Няма последни търсения</p>
                )}
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="w-full text-center text-text-secondary hover:text-white transition-colors py-2 text-sm"
                  >
                    Изчисти историята
                  </button>
                )}
              </>
            )}

            {activeTab === 'saved' && (
              <>
                {savedSearches.length > 0 ? (
                  savedSearches.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearch(item.query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-primary/50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white group-hover:text-accent transition-colors">
                          {item.query}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unsaveSearch(item.id);
                          }}
                          className="text-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-4">Няма запазени търсения</p>
                )}
              </>
            )}

            {activeTab === 'popular' && (
              <>
                {popularSearches.length > 0 ? (
                  popularSearches.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-primary/50 transition-colors"
                    >
                      <span className="text-white hover:text-accent transition-colors">
                        {query}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-4">Няма популярни търсения</p>
                )}
              </>
            )}
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
