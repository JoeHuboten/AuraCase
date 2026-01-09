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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20" />
        
        <div className="relative container-custom py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation animation="slideRight" className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-accent text-sm font-medium">Нови продукти всяка седмица</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight heading-display heading-glow">
                {t('home.hero.find', 'НАМЕРЕТЕ')} <span className="liquid-glass-text font-bold">{t('home.hero.perfect', 'ПЕРФЕКТНИТЕ АКСЕСОАРИ')}</span>
                <br />
                {t('home.hero.forDevice', 'ЗА ВАШЕТО УСТРОЙСТВО')}
              </h1>
              <p className="text-lead mb-10 max-w-xl">
                {t('home.hero.description', 'Разгледайте нашия разнообразен асортимент от внимателно изработени аксесоари, предназначени да подчертаят личността на вашето устройство.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/shop"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  {t('home.hero.shopNow', 'Пазарувай сега')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="btn-ghost inline-flex items-center justify-center"
                >
                  {t('home.hero.learnMore', 'Научи повече')}
                </Link>
              </div>

              <StaggerAnimation animation="fadeIn" stagger={0.2} className="grid grid-cols-3 gap-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-xl blur-sm"></div>
                  <div className="relative bg-primary-light/30 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      <CountUp end={200} duration={2000} suffix="+" />
                    </h3>
                    <p className="text-text-secondary text-sm">{t('home.stats.brands', 'Марки')}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-xl blur-sm"></div>
                  <div className="relative bg-primary-light/30 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      <CountUp end={2000} duration={2000} suffix="+" />
                    </h3>
                    <p className="text-text-secondary text-sm">{t('home.stats.products', 'Продукти')}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-xl blur-sm"></div>
                  <div className="relative bg-primary-light/30 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      <CountUp end={30000} duration={2500} suffix="+" />
                    </h3>
                    <p className="text-text-secondary text-sm">{t('home.stats.customers', 'Клиенти')}</p>
                  </div>
                </div>
              </StaggerAnimation>
            </ScrollAnimation>

            {/* Hero Image */}
            <ScrollAnimation animation="slideLeft" className="relative order-1 lg:order-2">
              <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-accent to-accent-dark rounded-2xl rotate-12 opacity-60 blur-sm"></div>
              <div className="absolute bottom-8 left-8 w-14 h-14 bg-gradient-to-br from-accent-light to-accent rounded-xl -rotate-12 opacity-40"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/20 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-primary-light/80 via-primary to-primary-light/50 rounded-3xl p-10 aspect-square flex items-center justify-center shadow-2xl shadow-accent/10 border border-white/5 backdrop-blur-xl">
                <div className="text-center">
                  <div className="text-9xl mb-6 filter drop-shadow-2xl">📱</div>
                  <p className="text-white text-xl font-semibold">{t('home.hero.premium', 'Премиум аксесоари')}</p>
                  <p className="text-text-secondary text-sm mt-2">За всички устройства</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="relative py-20 section-fade-top">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-14">
              <span className="text-eyebrow">Категории</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">
                {t('home.categories.title', 'Разгледайте нашите категории')}
              </h2>
              <p className="text-lead max-w-2xl mx-auto">
                {t('home.categories.description', 'Открийте широка гама от премиум аксесоари за всички ваши устройства')}
              </p>
            </div>
          </ScrollAnimation>

          <MagicBentoCategory categories={safeCategories} />
        </div>
      </section>

      {/* Section Divider */}
      <div className="container-custom">
        <div className="divider-glow" />
      </div>

      {/* Featured Products */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-light/30 via-primary-light/50 to-primary-light/30 pointer-events-none" />
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
              <div>
                <span className="text-eyebrow">Избрани</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">
                  {t('home.featured.title', 'Препоръчани продукти')}
                </h2>
                <p className="text-lead max-w-xl">
                  {t('home.featured.description', 'Открийте нашите най-популярни продукти, които клиентите обичат')}
                </p>
              </div>
              <Link href="/shop" className="btn-ghost inline-flex items-center gap-2 self-start md:self-auto">
                Виж всички
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeFeaturedProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} onQuickView={handleQuickView} />
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container-custom">
        <div className="divider-gradient" />
      </div>

      {/* Top Selling Products */}
      <section className="relative py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
              <div>
                <span className="text-eyebrow">Топ продажби</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">
                  {t('home.topSelling.title', 'Най-продавани')}
                </h2>
                <p className="text-lead max-w-xl">
                  {t('home.topSelling.description', 'Най-търсените продукти от нашите клиенти')}
                </p>
              </div>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeTopSelling.map((product: any) => (
              <ProductCard key={product.id} {...product} onQuickView={handleQuickView} />
            ))}
          </StaggerAnimation>

          <div className="text-center mt-14">
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
              {t('home.viewAll', 'Виж всички продукти')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

