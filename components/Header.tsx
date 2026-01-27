'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiShoppingBag, FiX, FiHeart, FiUser, FiArrowRight, FiZap, FiStar, FiMenu } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchStore } from '@/store/searchStore';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedSearch from './AdvancedSearch';
import type { Product } from '@/types';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠', color: 'from-violet-500 to-purple-600' },
  { href: '/shop', label: 'Shop', icon: '🛍️', color: 'from-cyan-500 to-blue-600' },
  { href: '/about', label: 'About', icon: '✨', color: 'from-pink-500 to-rose-600' },
  { href: '/contact', label: 'Contact', icon: '💬', color: 'from-green-500 to-emerald-600' },
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
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
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
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) { const data = await res.json(); setSuggestions(data.products || []); }
      } catch {}
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cartCount = mounted ? cartItems.reduce((s, i) => s + i.quantity, 0) : 0;
  const wishCount = mounted ? wishlistItems.length : 0;
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleSearch = (q: string) => {
    if (q.trim()) {
      addToHistory(q.trim());
      router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Create particle effect on nav hover
  const createParticles = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1000);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
        
        <div className="relative mx-auto max-w-7xl px-4 py-3">
          <nav className="relative flex items-center justify-between p-2 rounded-3xl bg-gradient-to-r from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
            
            {/* Animated background gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-600/0 via-cyan-600/5 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />

            {/* Logo with hover effect */}
            <Link href="/" className="group relative flex items-center gap-2 pl-2 pr-4 py-2 rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 opacity-75 blur group-hover:opacity-100 transition duration-300" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-cyan-500 to-pink-500 flex items-center justify-center animate-gradient-x">
                  <FiZap className="text-white" size={20} />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-base tracking-tight">Just Cases</div>
                <div className="text-cyan-400 text-[10px] font-medium -mt-0.5">Premium Quality</div>
              </div>
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <FiStar key={i} className="w-2 h-2 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </Link>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-1 relative">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
                const isHovered = hoveredNav === i;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={(e) => { setHoveredNav(i); createParticles(e); }}
                    onMouseLeave={() => setHoveredNav(null)}
                    className="relative group px-4 py-2.5 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110"
                  >
                    {/* Particle effects */}
                    {particles.map((particle) => (
                      <div
                        key={particle.id}
                        className="absolute w-1 h-1 rounded-full bg-cyan-400 animate-ping pointer-events-none"
                        style={{ left: particle.x, top: particle.y }}
                      />
                    ))}
                    
                    {/* Background glow */}
                    {(active || isHovered) && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl transition-opacity duration-300`} />
                    )}
                    
                    {/* Active indicator */}
                    {active && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10 rounded-2xl`} />
                    )}
                    
                    <div className="relative flex items-center gap-2">
                      <span className="text-xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                      <span className={`text-sm font-semibold transition-all duration-300 ${active ? 'text-white' : isHovered ? 'text-white' : 'text-white/50'}`}>
                        {t(`nav.${item.label.toLowerCase()}`, item.label)}
                      </span>
                    </div>
                    
                    {/* Bottom indicator */}
                    {active && (
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r ${item.color}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search with animation */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 w-48 animate-in slide-in-from-right duration-300">
                    <FiSearch size={16} className="text-cyan-400 animate-pulse" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      placeholder="Search magic..."
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white hover:rotate-90 transition-all duration-300">
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="group relative p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                    <FiSearch size={18} className="relative text-white/60 group-hover:text-cyan-400 transition-colors duration-300" />
                  </button>
                )}
              </div>

              {/* Wishlist with bounce */}
              <Link href="/wishlist" className="group relative p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-pink-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <FiHeart size={18} className="relative text-white/60 group-hover:text-pink-400 group-hover:fill-pink-400 transition-all duration-300" />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart with pulse */}
              <Link href="/cart" className="group relative p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-violet-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <FiShoppingBag size={18} className="relative text-white/60 group-hover:text-violet-400 transition-colors duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link href="/account" className="hidden sm:block group relative p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-green-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <FiUser size={18} className="relative text-white/60 group-hover:text-green-400 transition-colors duration-300" />
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden group relative p-2.5 rounded-2xl hover:bg-white/5 transition-all duration-300"
              >
                <FiMenu size={20} className={`text-white/60 group-hover:text-white transition-all duration-300 ${mobileOpen ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </nav>

          {/* Search Results with animation */}
          {searchOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-4 right-4 mt-2 p-3 rounded-3xl bg-[#0f0f23]/95 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold px-2 py-1 mb-1">✨ Found {suggestions.length} items</div>
              <div className="space-y-1">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { router.push(`/product/${p.slug}`); setSearchOpen(false); setSearchQuery(''); }}
                    className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all duration-200 text-left group hover:scale-[1.02]"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex-shrink-0">
                      <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate group-hover:text-cyan-400 transition-colors">{p.name}</div>
                      <div className="text-cyan-400 text-xs font-bold">{(p.price ?? 0).toFixed(2)} €</div>
                    </div>
                    <FiArrowRight className="text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200" size={16} />
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setIsAdvancedSearchOpen(true); setSearchOpen(false); }}
                className="w-full mt-2 py-2 text-xs text-white/50 hover:text-white rounded-2xl hover:bg-white/5 transition-all duration-200 font-medium"
              >
                🔍 Advanced Search
              </button>
            </div>
          )}

          {/* Mobile Menu with slide animation */}
          {mobileOpen && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-3xl bg-[#0f0f23]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(searchQuery); setMobileOpen(false); }}}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${active ? 'bg-gradient-to-r ' + item.color + ' text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="flex-1">{t(`nav.${item.label.toLowerCase()}`, item.label)}</span>
                      {active && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </Link>
                  );
                })}
                <div className="my-2 border-t border-white/10" />
                <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white transition-all">
                  <FiUser size={18} />
                  Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="h-20" />

      {(searchOpen || mobileOpen) && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { setSearchOpen(false); setMobileOpen(false); }} />}

      <AdvancedSearch isOpen={isAdvancedSearchOpen} onClose={() => setIsAdvancedSearchOpen(false)} onSearch={(q) => handleSearch(q)} />
      
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default Header;

