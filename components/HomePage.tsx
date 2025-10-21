'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import MagicBentoCategory from '@/components/MagicBentoCategory';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomePageProps {
  categories: any[];
  featuredProducts: any[];
  topSelling: any[];
}

export default function HomePage({ categories, featuredProducts, topSelling }: HomePageProps) {
  const { t } = useLanguage();

  // Add safety checks for undefined data
  const safeCategories = categories || [];
  const safeFeaturedProducts = featuredProducts || [];
  const safeTopSelling = topSelling || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-800">
        <div className="container-custom py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight" className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('home.hero.find', 'НАМЕРЕТЕ')} <span className="liquid-glass-text font-bold">{t('home.hero.perfect', 'ПЕРФЕКТНИТЕ АКСЕСОАРИ')}</span>
                <br />
                {t('home.hero.forDevice', 'ЗА ВАШЕТО УСТРОЙСТВО')}
              </h1>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                {t('home.hero.description', 'Разгледайте нашия разнообразен асортимент от внимателно изработени аксесоари, предназначени да подчертаят личността на вашето устройство.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/shop"
                  className="btn-primary inline-block"
                >
                  {t('home.hero.shopNow', 'Пазарувай сега')}
                </Link>
                <Link
                  href="/about"
                  className="btn-ghost inline-block"
                >
                  {t('home.hero.learnMore', 'Научи повече')}
                </Link>
              </div>

              <StaggerAnimation animation="fadeIn" stagger={0.2} className="grid grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">200+</h3>
                  <p className="text-text-secondary text-sm">{t('home.stats.brands', 'Марки')}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">2,000+</h3>
                  <p className="text-text-secondary text-sm">{t('home.stats.products', 'Продукти')}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">30,000+</h3>
                  <p className="text-text-secondary text-sm">{t('home.stats.customers', 'Клиенти')}</p>
                </div>
              </StaggerAnimation>
            </ScrollAnimation>

            {/* Hero Image */}
            <ScrollAnimation animation="slideLeft" className="relative order-1 lg:order-2">
              <div className="absolute top-8 right-8 w-16 h-16 bg-accent rounded-xl rotate-12 opacity-70"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-accent rounded-lg -rotate-12 opacity-60"></div>
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 aspect-square flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="text-8xl mb-4">📱</div>
                  <p className="text-white text-xl font-semibold">{t('home.hero.premium', 'Премиум аксесоари')}</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-background py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.categories.title', 'Разгледайте нашите категории')}
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                {t('home.categories.description', 'Открийте широка гама от премиум аксесоари за всички ваши устройства')}
              </p>
            </div>
          </ScrollAnimation>

          <MagicBentoCategory categories={safeCategories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-800 py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.featured.title', 'Препоръчани продукти')}
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                {t('home.featured.description', 'Открийте нашите най-популярни продукти, които клиентите обичат')}
              </p>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeFeaturedProducts.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="bg-background py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.topSelling.title', 'Най-продавани')}
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                {t('home.topSelling.description', 'Най-търсените продукти от нашите клиенти')}
              </p>
            </div>
          </ScrollAnimation>

          <StaggerAnimation animation="slideUp" stagger={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeTopSelling.map((product: any) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </StaggerAnimation>

          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary inline-block">
              {t('home.viewAll', 'Виж всички продукти')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

