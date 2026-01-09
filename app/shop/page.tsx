'use client';

import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ProductGridSkeleton, ShopSidebarSkeleton } from '@/components/SkeletonLoaders';
import { FiChevronRight, FiFilter, FiX, FiSearch, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect, Suspense, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Product, Category } from '@/types';

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Get current filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = parseFloat(searchParams.get('minPrice') || '0');
  const currentMaxPrice = parseFloat(searchParams.get('maxPrice') || '200');
  
  // Local state
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([currentMinPrice, currentMaxPrice]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build URL with updated params
  const buildUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || (key === 'minPrice' && value === '0') || (key === 'maxPrice' && value === '200')) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset page when filters change (except when changing page)
    if (!('page' in updates)) {
      params.delete('page');
    }
    
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, searchParams]);

  // Update URL with transition
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(buildUrl(updates), { scroll: false });
    });
  }, [router, buildUrl]);

  // Fetch products when URL params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', '12');
        if (currentCategory !== 'all') params.set('category', currentCategory);
        if (currentSort) params.set('sort', currentSort);
        if (currentSearch) params.set('search', currentSearch);
        if (currentMinPrice > 0) params.set('minPrice', currentMinPrice.toString());
        if (currentMaxPrice < 200) params.set('maxPrice', currentMaxPrice.toString());
        
        const response = await fetch(`/api/products?${params.toString()}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, currentCategory, currentSort, currentSearch, currentMinPrice, currentMaxPrice]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Sync temp price range with URL
  useEffect(() => {
    setTempPriceRange([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const handlePriceApply = () => {
    updateFilters({
      minPrice: tempPriceRange[0].toString(),
      maxPrice: tempPriceRange[1].toString()
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setTempPriceRange([0, 200]);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Build search params for pagination
  const paginationParams: Record<string, string> = {};
  if (currentCategory !== 'all') paginationParams.category = currentCategory;
  if (currentSort !== 'popular') paginationParams.sort = currentSort;
  if (currentSearch) paginationParams.search = currentSearch;
  if (currentMinPrice > 0) paginationParams.minPrice = currentMinPrice.toString();
  if (currentMaxPrice < 200) paginationParams.maxPrice = currentMaxPrice.toString();

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const hasActiveFilters = currentCategory !== 'all' || currentSearch || currentMinPrice > 0 || currentMaxPrice < 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background">
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-text-secondary hover:text-accent transition-colors">Home</Link>
          <FiChevronRight className="text-text-secondary" />
          <span className="text-white font-medium">Shop</span>
        </div>
      </div>

      {/* Mobile Search & Filter Bar */}
      <div className="lg:hidden container-custom mb-6">
        <div className="flex gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:bg-primary/70 transition-all"
            />
          </form>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="btn-icon bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 relative"
          >
            <FiFilter size={20} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="container-custom pb-16">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 sticky top-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FiSliders className="text-accent" />
                Filters
              </h2>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:bg-primary/70 transition-all"
                  />
                </div>
              </form>

              {/* Product Type Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Product Type</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilters({ category: null })}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                      currentCategory === 'all'
                        ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-lg shadow-accent/10'
                        : 'border-gray-700 hover:border-gray-600 text-text-secondary hover:text-white hover:bg-gray-800/30'
                    }`}
                  >
                    <span className="font-medium">All Products</span>
                    <FiChevronRight className={`transition-all duration-200 ${currentCategory === 'all' ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => updateFilters({ category: category.slug })}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                        currentCategory === category.slug
                          ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-lg shadow-accent/10'
                          : 'border-gray-700 hover:border-gray-600 text-text-secondary hover:text-white hover:bg-gray-800/30'
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <FiChevronRight className={`transition-all duration-200 ${currentCategory === category.slug ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-text-secondary text-sm mb-1">Min</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={tempPriceRange[0]}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(200, parseInt(e.target.value) || 0));
                          setTempPriceRange([value, tempPriceRange[1]]);
                        }}
                        className="w-full bg-background-secondary text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <span className="text-text-secondary mt-6">-</span>
                    <div className="flex-1">
                      <label className="block text-text-secondary text-sm mb-1">Max</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={tempPriceRange[1]}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(200, parseInt(e.target.value) || 0));
                          setTempPriceRange([tempPriceRange[0], value]);
                        }}
                        className="w-full bg-background-secondary text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handlePriceApply}
                    disabled={tempPriceRange[0] === currentMinPrice && tempPriceRange[1] === currentMaxPrice}
                    className="w-full py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Price
                  </button>
                </div>
              </div>

              {/* Clear All Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <FiX size={18} />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-text-secondary">
                  {loading ? 'Loading...' : `${total} products found`}
                </p>
                {isPending && (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-accent" />
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value === 'popular' ? null : e.target.value })}
                  className="bg-primary/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-primary/50 border border-gray-700/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'}`}
                    aria-label="Grid view"
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'}`}
                    aria-label="List view"
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      {...product} 
                      oldPrice={product.oldPrice || undefined}
                      discount={product.discount || undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/shop"
                  searchParams={paginationParams}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-text-secondary mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary px-8 py-3"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-primary/95 to-primary backdrop-blur-xl border-r border-gray-800/50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiSliders className="text-accent" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-icon text-text-secondary hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Mobile Category Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Product Type</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    updateFilters({ category: null });
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    currentCategory === 'all'
                      ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent'
                      : 'border-gray-700 text-text-secondary hover:text-white'
                  }`}
                >
                  <span className="font-medium">All Products</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      updateFilters({ category: category.slug });
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      currentCategory === category.slug
                        ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent'
                        : 'border-gray-700 text-text-secondary hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-accent font-semibold">${tempPriceRange[0]}</span>
                <span className="text-accent font-semibold">${tempPriceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={tempPriceRange[1]}
                onChange={(e) => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <button
                onClick={() => {
                  handlePriceApply();
                  setMobileFiltersOpen(false);
                }}
                className="w-full mt-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all"
              >
                Apply Price
              </button>
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="btn-secondary w-full"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="mt-4 text-text-secondary">Loading products...</p>
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
