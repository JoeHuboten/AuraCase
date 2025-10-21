'use client';

import ProductCard from '@/components/ProductCard';
import { FiChevronRight, FiFilter, FiX, FiSearch, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  image: string;
  images: string;
  categoryId: string;
  colors: string;
  sizes: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  specifications: any;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Магазин - AURACASE",
    "description": "Разгледайте нашия пълен асортимент от премиум мобилни аксесоари. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече.",
    "url": "https://auracase.bg/shop",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Мобилни аксесоари",
      "description": "Премиум мобилни аксесоари за всички устройства"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Начало",
          "item": "https://auracase.bg"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Магазин",
          "item": "https://auracase.bg/shop"
        }
      ]
    }
  };
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        
        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync tempPriceRange with priceRange when priceRange changes
  useEffect(() => {
    setTempPriceRange(priceRange);
  }, [priceRange]);

  // Handle search query from URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Search suggestions effect
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const suggestions = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.colors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sizes?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.slug === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // popular
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Магазин - AURACASE | Премиум мобилни аксесоари за всички устройства</title>
        <meta name="description" content="Разгледайте нашия пълен асортимент от премиум мобилни аксесоари. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече. Безплатна доставка над 50 лв." />
        <meta name="keywords" content="магазин, мобилни аксесоари, защитни калъфи, безжично зареждане, слушалки, power bank, iPhone, Samsung, онлайн пазаруване" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://auracase.bg/shop" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Магазин - AURACASE | Премиум мобилни аксесоари" />
        <meta property="og:description" content="Разгледайте нашия пълен асортимент от премиум мобилни аксесоари. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече." />
        <meta property="og:url" content="https://auracase.bg/shop" />
        <meta property="og:image" content="https://auracase.bg/og-shop.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:title" content="Магазин - AURACASE | Премиум мобилни аксесоари" />
        <meta property="twitter:description" content="Разгледайте нашия пълен асортимент от премиум мобилни аксесоари. Защитни калъфи, безжично зареждане, слушалки, power bank-ове и много повече." />
        <meta property="twitter:image" content="https://auracase.bg/og-shop.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
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
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:bg-primary/70 transition-all"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="btn-icon bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20"
          >
            <FiFilter size={20} />
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
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:bg-primary/70 transition-all"
                  />
                </div>
              </div>

              {/* Product Type Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Product Type</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                      selectedCategory === 'all'
                        ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-lg shadow-accent/10'
                        : 'border-gray-700 hover:border-gray-600 text-text-secondary hover:text-white hover:bg-gray-800/30'
                    }`}
                  >
                    <span className="font-medium">All Products</span>
                    <FiChevronRight className={`transition-all duration-200 ${selectedCategory === 'all' ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                        selectedCategory === category.slug
                          ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-lg shadow-accent/10'
                          : 'border-gray-700 hover:border-gray-600 text-text-secondary hover:text-white hover:bg-gray-800/30'
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <FiChevronRight className={`transition-all duration-200 ${selectedCategory === category.slug ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
                <div className="space-y-4">
                  {/* Price Input Fields */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-text-secondary text-sm mb-1">Min Price</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={tempPriceRange[0] === 0 ? '' : tempPriceRange[0]}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Math.max(0, Math.min(200, parseInt(e.target.value) || 0));
                          if (value <= tempPriceRange[1]) {
                            setTempPriceRange([value, tempPriceRange[1]]);
                          }
                        }}
                        onFocus={(e) => {
                          if (e.target.value === '0') {
                            e.target.value = '';
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            e.target.value = '0';
                            setTempPriceRange([0, tempPriceRange[1]]);
                          }
                        }}
                        className="w-full bg-background-secondary text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-text-secondary text-sm mb-1">Max Price</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={tempPriceRange[1] === 200 ? '' : tempPriceRange[1]}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 200 : Math.max(0, Math.min(200, parseInt(e.target.value) || 200));
                          if (value >= tempPriceRange[0]) {
                            setTempPriceRange([tempPriceRange[0], value]);
                          }
                        }}
                        onFocus={(e) => {
                          if (e.target.value === '200') {
                            e.target.value = '';
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            e.target.value = '200';
                            setTempPriceRange([tempPriceRange[0], 200]);
                          }
                        }}
                        className="w-full bg-background-secondary text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="200"
                      />
                    </div>
                  </div>
                  

                  {/* Apply Filter Button */}
                  <button
                    onClick={() => {
                      setPriceRange(tempPriceRange);
                      console.log('Price filter applied:', tempPriceRange);
                    }}
                    className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-light transition-colors font-medium"
                  >
                    Apply Price Filter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.slug === selectedCategory)?.name}
                </h1>
                <p className="text-text-secondary">
                  Showing <span className="text-accent font-semibold">{filteredProducts.length}</span> products
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-primary/50 border border-gray-700/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-accent text-white shadow-lg' 
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-primary/50 border border-gray-700/50 rounded-xl px-4 py-2 text-white focus:border-accent/50 focus:outline-none focus:bg-primary/70 transition-all"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  oldPrice={product.oldPrice || undefined}
                  discount={product.discount || undefined}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-text-secondary mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, 200]);
                    setSearchQuery('');
                  }}
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-primary/95 to-primary backdrop-blur-xl border-r border-gray-800/50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiSliders className="text-accent" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-icon lg:hidden text-text-secondary hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="text"
                  placeholder="Search products, brands, colors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-10 pr-10 py-3 bg-primary/50 border border-gray-700/50 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-accent/50 focus:bg-primary/70 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>

              {/* Mobile Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-primary/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs text-text-secondary mb-2 px-2">Suggestions:</div>
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          router.push(`/product/${product.slug}`);
                          setSearchQuery('');
                          setShowSuggestions(false);
                          setMobileFiltersOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left group"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium group-hover:text-accent transition-colors truncate text-sm">
                            {product.name}
                          </div>
                          <div className="text-text-secondary text-xs">
                            ${product.price} • {product.category.name}
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-gray-600/50 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleSearch(searchQuery);
                          setMobileFiltersOpen(false);
                        }}
                        className="w-full text-center text-accent hover:text-accent-light transition-colors py-2 text-sm font-medium"
                      >
                        Search for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Type Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Product Type</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                    selectedCategory === 'all'
                      ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-lg shadow-accent/10'
                      : 'border-gray-700 hover:border-gray-600 text-text-secondary hover:text-white hover:bg-gray-800/30'
                  }`}
                >
                  <span className="font-medium">All Products</span>
                  <FiChevronRight className={`transition-all duration-200 ${selectedCategory === 'all' ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                      selectedCategory === category.slug
                        ? 'border-accent bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-lg shadow-accent/10'
                        : 'border-gray-700 hover:border-gray-600 text-text-secondary hover:text-white hover:bg-gray-800/30'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <FiChevronRight className={`transition-all duration-200 ${selectedCategory === category.slug ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent font-semibold">${priceRange[0]}</span>
                  <span className="text-accent font-semibold">${priceRange[1]}</span>
                </div>
                
                {/* Custom Range Slider */}
                <div className="relative">
                  {/* Track Background */}
                  <div className="h-2 bg-gray-700/50 rounded-full"></div>
                  
                  {/* Active Range */}
                  <div 
                    className="absolute top-0 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full pointer-events-none"
                    style={{
                      left: `${(priceRange[0] / 200) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 200) * 100}%`
                    }}
                  ></div>
                  
                  {/* Min Range Input */}
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value <= priceRange[1]) {
                        setPriceRange([value, priceRange[1]]);
                      }
                    }}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer range-input"
                  />
                  
                  {/* Max Range Input */}
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= priceRange[0]) {
                        setPriceRange([priceRange[0], value]);
                      }
                    }}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer range-input"
                  />
                </div>
              </div>
            </div>

            {/* Clear All Filters Button */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, 200]);
                setSearchQuery('');
                setMobileFiltersOpen(false);
              }}
              className="btn-secondary w-full"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
    </>
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
