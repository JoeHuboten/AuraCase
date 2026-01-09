'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollAnimationLazy as ScrollAnimation } from '@/components/ScrollAnimationLazy';

interface RecentlyViewedProps {
  excludeProductId?: string;
  maxItems?: number;
}

export default function RecentlyViewed({ excludeProductId, maxItems = 4 }: RecentlyViewedProps) {
  const { formatPrice, t } = useLanguage();
  const getRecent = useRecentlyViewedStore((state) => state.getRecent);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<ReturnType<typeof getRecent>>([]);

  useEffect(() => {
    setMounted(true);
    setProducts(getRecent(maxItems, excludeProductId));
  }, [getRecent, maxItems, excludeProductId]);

  if (!mounted || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container-custom">
        <ScrollAnimation animation="fadeIn">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-eyebrow">Скорошни</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white heading-display">
                {t('recentlyViewed.title', 'Наскоро разглеждани')}
              </h2>
            </div>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group card-interactive p-3 md:p-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800/50">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm md:text-base font-medium text-white line-clamp-2 group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-accent font-semibold mt-1">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
