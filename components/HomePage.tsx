'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import MagicBentoCategory from '@/components/MagicBentoCategory';
import { ScrollAnimationLazy as ScrollAnimation, StaggerAnimationLazy as StaggerAnimation } from '@/components/ScrollAnimationLazy';
import { useLanguage } from '@/contexts/LanguageContext';
import { CountUp } from '@/components/InteractiveElements';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product, Category } from '@/types';

interface HomePageProps {
  categories: Category[];
  featuredProducts: Product[];
  topSelling: Product[];
}

export default function HomePage({ categories, featuredProducts, topSelling }: HomePageProps) {
  const { t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Add safety checks for undefined data
  const safeCategories = categories || [];
  const safeFeaturedProducts = featuredProducts || [];
  const safeTopSelling = topSelling || [];

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* Hero Section - Completely Redesigned */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated background mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-accent/30 via-blue-600/20 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-purple-600/20 via-accent/10 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        
        <div className="relative container-custom py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollAnimation animation="slideRight" className="order-2 lg:order-1">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/30 mb-8 backdrop-blur-sm shadow-lg shadow-accent/5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                <span className="text-accent text-sm font-semibold tracking-wide">Нови продукти всяка седмица</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight">
                <span className="block">{t('home.hero.find', 'НАМЕРЕТЕ')}</span>
                <span className="block bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {t('home.hero.perfect', 'ПЕРФЕКТНИТЕ АКСЕСОАРИ')}
                </span>
                <span className="block text-white/90">{t('home.hero.forDevice', 'ЗА ВАШЕТО УСТРОЙСТВО')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl leading-relaxed">
                {t('home.hero.description', 'Разгледайте нашия разнообразен асортимент от внимателно изработени аксесоари, предназначени да подчертаят личността на вашето устройство.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-blue-600 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">{t('home.hero.shopNow', 'Пазарувай сега')}</span>
                  <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg border-2 border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                >
                  {t('home.hero.learnMore', 'Научи повече')}
                </Link>
              </div>

              {/* Stats with modern cards */}
              <StaggerAnimation animation="fadeIn" stagger={0.15} className="grid grid-cols-3 gap-4 md:gap-6">
                {[
                  { value: 200, label: t('home.stats.brands', 'Марки'), icon: '🏷️' },
                  { value: 2000, label: t('home.stats.products', 'Продукти'), icon: '📦' },
                  { value: 30000, label: t('home.stats.customers', 'Клиенти'), icon: '👥' },
                ].map((stat, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative bg-gradient-to-br from-primary-light/60 to-primary/80 backdrop-blur-xl rounded-xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="text-2xl mb-2 opacity-80">{stat.icon}</div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        <CountUp end={stat.value} duration={2000} suffix="+" />
                      </h3>
                      <p className="text-text-secondary text-sm">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </StaggerAnimation>
            </ScrollAnimation>

            {/* Hero Visual - 3D-like floating elements */}
            <ScrollAnimation animation="slideLeft" className="relative order-1 lg:order-2">
              <div className="relative aspect-square max-w-[500px] mx-auto">
                {/* Floating decorative elements */}
                <div className="absolute top-[5%] right-[10%] w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-accent to-blue-600 rounded-2xl rotate-12 opacity-80 animate-float shadow-xl shadow-accent/30" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-[15%] left-[5%] w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl -rotate-12 opacity-70 animate-float shadow-lg" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[40%] right-[5%] w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg rotate-45 opacity-60 animate-float" style={{ animationDelay: '2s' }} />
                
                {/* Main card */}
                <div className="absolute inset-[10%] bg-gradient-to-br from-primary-light/90 via-primary/80 to-primary-light/70 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-black/30 border border-white/10 backdrop-blur-xl overflow-hidden">
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10" />
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center p-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                      <div className="relative text-7xl md:text-8xl lg:text-9xl animate-float filter drop-shadow-2xl" style={{ animationDuration: '3s' }}>📱</div>
                    </div>
                    <div className="mt-6 md:mt-8 text-center">
                      <p className="text-white text-xl md:text-2xl font-bold mb-2">{t('home.hero.premium', 'Премиум аксесоари')}</p>
                      <p className="text-text-secondary text-sm md:text-base">За всички устройства</p>
                    </div>
                    
                    {/* Floating mini cards */}
                    <div className="absolute -bottom-2 -right-2 md:bottom-4 md:right-4 bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/20 animate-float shadow-xl" style={{ animationDelay: '0.5s' }}>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">✓</div>
                        <div>
                          <p className="text-white text-xs md:text-sm font-semibold">Бърза доставка</p>
                          <p className="text-text-secondary text-[10px] md:text-xs">1-3 работни дни</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute -top-2 -left-2 md:top-4 md:left-4 bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/20 animate-float shadow-xl" style={{ animationDelay: '1.5s' }}>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">⭐</div>
                        <div>
                          <p className="text-white text-xs md:text-sm font-semibold">4.9 рейтинг</p>
                          <p className="text-text-secondary text-[10px] md:text-xs">2000+ отзива</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Categories - Enhanced */}
      <section className="relative py-24 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide mb-6">
                Категории
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
                {t('home.categories.title', 'Разгледайте нашите категории')}
              </h2>
              <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
                {t('home.categories.description', 'Открийте широка гама от премиум аксесоари за всички ваши устройства')}
              </p>
            </div>
          </ScrollAnimation>

          <MagicBentoCategory categories={safeCategories} />
        </div>
      </section>

      {/* Section Divider - Enhanced */}
      <div className="container-custom py-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Featured Products - Enhanced */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-transparent to-primary-light/20 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2" />
        
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-blue-600/20 border border-accent/20 text-accent text-sm font-semibold tracking-wide mb-6">
                  ⭐ Избрани
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
                  {t('home.featured.title', 'Препоръчани продукти')}
                </h2>
                <p className="text-text-secondary text-lg md:text-xl">
                  {t('home.featured.description', 'Открийте нашите най-популярни продукти, които клиентите обичат')}
                </p>
              </div>
              <Link 
                href="/shop" 
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white font-medium self-start lg:self-auto"
              >
                Виж всички
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {safeFeaturedProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} onQuickView={handleQuickView} />
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* Trust Badges Section - NEW */}
      <section className="relative py-16 md:py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: '🚚', title: 'Безплатна доставка', desc: 'За поръчки над 50 лв' },
                { icon: '🔒', title: 'Сигурно плащане', desc: 'PayPal & карти' },
                { icon: '↩️', title: '30 дни за връщане', desc: 'Без въпроси' },
                { icon: '💬', title: '24/7 Поддръжка', desc: 'Винаги на линия' },
              ].map((badge, i) => (
                <div key={i} className="group text-center p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-accent/20 transition-all duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{badge.title}</h3>
                  <p className="text-text-secondary text-sm">{badge.desc}</p>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container-custom py-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Top Selling Products - Enhanced */}
      <section className="relative py-24 md:py-32">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide mb-6">
                  🔥 Топ продажби
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
                  {t('home.topSelling.title', 'Най-продавани')}
                </h2>
                <p className="text-text-secondary text-lg md:text-xl">
                  {t('home.topSelling.description', 'Най-търсените продукти от нашите клиенти')}
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {safeTopSelling.map((product: any) => (
              <ProductCard key={product.id} {...product} onQuickView={handleQuickView} />
            ))}
          </StaggerAnimation>

          <div className="text-center mt-16">
            <Link 
              href="/shop" 
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-accent to-blue-600 rounded-2xl text-white font-semibold text-lg shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">{t('home.viewAll', 'Виж всички продукти')}</span>
              <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

