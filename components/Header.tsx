'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiHeart, FiUser } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchStore } from '@/store/searchStore';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import AdvancedSearch from './AdvancedSearch';
import LanguageSwitcher from './LanguageSwitcher';

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

const Header = () => {
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToHistory } = useSearchStore();
  const { t } = useLanguage();

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistItemsCount = mounted ? wishlistItems.length : 0;

  // Fetch products for search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Response is not JSON');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

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

  const handleSearch = (query: string, filters?: any) => {
    if (query.trim()) {
      addToHistory(query.trim());
      const searchParams = new URLSearchParams();
      searchParams.set('search', query.trim());
      
      if (filters) {
        if (filters.category && filters.category !== 'all') {
          searchParams.set('category', filters.category);
        }
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
          searchParams.set('minPrice', filters.priceRange[0].toString());
          searchParams.set('maxPrice', filters.priceRange[1].toString());
        }
        if (filters.rating > 0) {
          searchParams.set('rating', filters.rating.toString());
        }
        if (filters.inStock) {
          searchParams.set('inStock', 'true');
        }
        if (filters.featured) {
          searchParams.set('featured', 'true');
        }
      }
      
      router.push(`/shop?${searchParams.toString()}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-primary border-b border-gray-800 sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white flex-shrink-0">
              AURACASE
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-12 mx-10">
              <Link href="/" className="text-text-secondary hover:text-white transition-colors duration-200 font-medium text-sm">
                {t('nav.home', 'Home')}
              </Link>
              <Link href="/shop" className="text-text-secondary hover:text-white transition-colors duration-200 font-medium text-sm">
                {t('nav.shop', 'Shop')}
              </Link>
              <Link href="/about" className="text-text-secondary hover:text-white transition-colors duration-200 font-medium text-sm">
                {t('nav.about', 'About')}
              </Link>
              <Link href="/contact" className="text-text-secondary hover:text-white transition-colors duration-200 font-medium text-sm">
                {t('nav.contact', 'Contact')}
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder={t('search.placeholder', 'Search products...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full bg-background-secondary text-white pl-10 pr-10 py-2 rounded-full border border-gray-600/70 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent/70 transition-all duration-200"
                  suppressHydrationWarning
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background-secondary/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs text-text-secondary mb-2 px-2">Suggestions:</div>
                      {searchSuggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            router.push(`/product/${product.slug}`);
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left group"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium group-hover:text-accent transition-colors truncate">
                              {product.name}
                            </div>
                            <div className="text-text-secondary text-sm">
                              ${product.price} • {product.category.name}
                            </div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-gray-600/50 mt-2 pt-2">
                        <button
                          onClick={() => handleSearch(searchQuery)}
                          className="w-full text-center text-accent hover:text-accent-light transition-colors py-2 text-sm font-medium"
                        >
                          Search for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button 
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="btn-icon text-white hover:text-accent"
                title="Търсене"
              >
                <FiSearch size={20} />
              </button>
              <Link href="/account" className="text-white hover:text-accent transition" title="Account">
                <FiUser size={20} />
              </Link>
              <Link href="/cart" className="relative text-white hover:text-accent transition">
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className="relative text-white hover:text-accent transition">
                <FiHeart size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>
              <button
                className="btn-icon md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-light border-t border-gray-800">
            <nav className="container-custom py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-text-secondary hover:text-white transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home', 'Home')}
              </Link>
              <Link
                href="/shop"
                className="text-text-secondary hover:text-white transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.shop', 'Shop')}
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-white transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about', 'About')}
              </Link>
              <Link
                href="/contact"
                className="text-text-secondary hover:text-white transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact', 'Contact')}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default Header;

