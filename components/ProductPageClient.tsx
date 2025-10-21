'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import ProductDetails from '@/components/ProductDetails';
import ProductReviews from '@/components/ProductReviews';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  rating: number;
  reviews: number;
  image: string;
  description: string | null;
  specifications?: any;
  category: {
    name: string;
    slug: string;
  };
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  slug: string;
}

interface ProductPageClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const { t, formatPrice } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-text-secondary hover:text-white">
            {t('product.breadcrumb.home', 'Home')}
          </Link>
          <span className="text-text-secondary">/</span>
          <Link href="/shop" className="text-text-secondary hover:text-white">
            {t('product.breadcrumb.shop', 'Shop')}
          </Link>
          <span className="text-text-secondary">/</span>
          <Link href={`/shop/${product.category.slug}`} className="text-text-secondary hover:text-white">
            {product.category.name}
          </Link>
          <span className="text-text-secondary">/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-background-secondary rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={`${product.name} - ${t('product.premiumAccessory', 'Premium mobile accessory from AURACASE')}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                className="object-cover"
                priority={true}
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                        }`}
                        size={20}
                      />
                    ))}
                  </div>
                  <span className="text-text-secondary">
                    {product.rating} ({product.reviews} {t('product.reviews', 'reviews')})
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <>
                  <span className="text-2xl text-text-secondary line-through">{formatPrice(product.oldPrice)}</span>
                  {product.discount && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('product.description', 'Description')}
              </h3>
              <p className="text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            {/* Interactive Product Details */}
            <ProductDetails product={product} />

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('product.specifications', 'Specifications')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-text-secondary capitalize">{key}:</span>
                      <span className="text-white">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              {t('product.relatedProducts', 'Related Products')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group bg-background-secondary rounded-2xl overflow-hidden hover:ring-2 hover:ring-accent transition"
                >
                  <div className="relative aspect-square bg-gray-800">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 group-hover:text-accent transition">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{formatPrice(relatedProduct.price)}</span>
                      {relatedProduct.oldPrice && (
                        <span className="text-text-secondary line-through">{formatPrice(relatedProduct.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
