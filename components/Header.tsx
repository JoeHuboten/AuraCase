'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiShoppingBag, FiX, FiHeart, FiUser, FiArrowRight } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchStore } from '@/store/searchStore';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedSearch from './AdvancedSearch';
import type { Product } from '@/types';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { addToHistory } = useSearchStore();
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=4`);
        if (res.ok) { const data = await res.json(); setSuggestions(data.products || []); }
      } catch {}
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cartCount = mounted ? cartItems.reduce((s, i) => s + i.quantity, 0) : 0;
  const wishCount = mounted ? wishlistItems.length : 0;
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  const activeIndex = navItems.findIndex(item => isActive(item.href));

  const handleSearch = (q: string) => {
    if (q.trim()) {
      addToHistory(q.trim());
      router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl transition-all duration-300 ${hidden ? '-top-20 opacity-0' : 'top-4 opacity-100'}`}>
        <nav className="relative flex items-center justify-between px-1.5 py-1.5 rounded-2xl bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors duration-300">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center overflow-hidden">
              <span className="relative z-10 text-white font-bold text-sm">A</span>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="hidden sm:block text-white font-semibold text-sm">AuraCase</span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center bg-white/[0.03] rounded-xl p-1 relative">
            {/* Sliding Pill Indicator - only show when hovering or has active item */}
            {(hoveredIndex !== null || activeIndex >= 0) && (
              <div 
                className="absolute top-1 bottom-1 rounded-lg bg-white/[0.08] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  left: `calc(${(hoveredIndex !== null ? hoveredIndex : activeIndex) * 25}% + 4px)`,
                  width: 'calc(25% - 8px)',
                  boxShadow: hoveredIndex !== null ? '0 0 20px rgba(6,182,212,0.15)' : 'none',
                }}
              />
            )}
            
            {navItems.map((item, i) => {
              const active = isActive(item.href);
              const isHovered = hoveredIndex === i;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 text-xs font-medium transition-colors duration-200"
                >
                  <span className={`transition-colors duration-200 ${active ? 'text-white' : isHovered ? 'text-white/90' : 'text-white/40'}`}>
                    {t(`nav.${item.label.toLowerCase()}`, item.label)}
                  </span>
                  {active && hoveredIndex === null && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center justify-center rounded-xl transition-all duration-300 w-44 h-9 bg-white/[0.06] px-3 gap-2">
                  <FiSearch size={15} className="flex-shrink-0 text-cyan-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    placeholder="Search..."
                    className="flex-1 min-w-0 bg-transparent text-white text-xs placeholder:text-white/30 focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white flex-shrink-0">
                      <FiX size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center rounded-xl transition-all duration-300 w-9 h-9 hover:bg-white/[0.04]"
                >
                  <FiSearch size={15} className="flex-shrink-0 text-white/40 hover:text-white transition-colors duration-200" />
                </button>
              )}
            </div>

            <div className="hidden sm:block w-px h-5 bg-white/[0.08] mx-1" />

            {/* Wishlist */}
            <Link href="/wishlist" className="group relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/[0.04] transition-colors duration-200">
              <FiHeart size={15} className="text-white/40 group-hover:text-rose-400 transition-colors duration-200" />
              {wishCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="group relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/[0.04] transition-colors duration-200">
              <FiShoppingBag size={15} className="text-white/40 group-hover:text-cyan-400 transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {/* Account */}
            <Link href="/account" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/[0.04] transition-colors duration-200">
              <FiUser size={15} className="text-white/40 hover:text-white transition-colors duration-200" />
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/[0.04] transition-colors duration-200"
            >
              <div className="relative w-4 h-3.5 flex flex-col justify-between">
                <span className={`block h-0.5 bg-white/60 rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                <span className={`block h-0.5 bg-white/60 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`block h-0.5 bg-white/60 rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Search Results Dropdown */}
        {searchOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-2 p-2 rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-[9px] text-white/30 uppercase tracking-wider px-3 py-2">Results</div>
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => { router.push(`/product/${p.slug}`); setSearchOpen(false); setSearchQuery(''); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors duration-200 text-left group"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate group-hover:text-cyan-400 transition-colors duration-200">{p.name}</div>
                  <div className="text-cyan-400 text-xs font-medium">${p.price.toFixed(2)}</div>
                </div>
                <FiArrowRight className="text-white/20 group-hover:text-cyan-400 transition-colors duration-200" size={14} />
              </button>
            ))}
            <button
              onClick={() => { setIsAdvancedSearchOpen(true); setSearchOpen(false); }}
              className="w-full mt-2 py-2 text-xs text-white/40 hover:text-white rounded-xl hover:bg-white/[0.03] transition-colors duration-200"
            >
              Advanced Search
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-2 rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-white/[0.05]">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-3 text-white/30" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(searchQuery); setMobileOpen(false); }}}
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-500/30 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="p-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${active ? 'bg-white/[0.06] text-white' : 'text-white/50 hover:bg-white/[0.03] hover:text-white'}`}
                  >
                    <span>{t(`nav.${item.label.toLowerCase()}`, item.label)}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-white/[0.05]" />
              <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/[0.03] hover:text-white transition-colors duration-200">
                <FiUser size={16} />
                Account
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="h-20" />

      {(searchOpen || mobileOpen) && <div className="fixed inset-0 z-40" onClick={() => { setSearchOpen(false); setMobileOpen(false); }} />}

      <AdvancedSearch isOpen={isAdvancedSearchOpen} onClose={() => setIsAdvancedSearchOpen(false)} onSearch={(q) => handleSearch(q)} />
    </>
  );
};

export default Header;

