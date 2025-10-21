'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  image: string;
  rating?: number;
  reviews?: number;
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps extends Product {}

const ProductCard = ({
  id,
  name,
  slug,
  price,
  oldPrice,
  discount,
  image,
  rating = 0,
  reviews = 0,
  category,
}: ProductCardProps) => {
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice, t } = useLanguage();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        id,
        name,
        price,
        oldPrice: oldPrice ?? undefined,
        discount: discount ?? undefined,
        image,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    try {
      if (isInWishlist(id)) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist({
          id,
          name,
          slug,
          price,
          oldPrice: oldPrice ?? undefined,
          discount: discount ?? undefined,
          image,
          category: category || { name: '', slug: '' }
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          <Image
            src={image || '/placeholder.svg'}
            alt={`${name} - Премиум мобилен аксесоар от AURACASE`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            priority={false}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              -{discount}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-4 left-4 w-11 h-11 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-50 z-20 cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl border-2 transform hover:-translate-y-1 ${
              isInWishlist(id)
                ? 'bg-red-500 text-white border-red-400 hover:shadow-red-500/40'
                : 'bg-white/20 text-white border-white/20 hover:bg-white/30 hover:border-white/40 hover:shadow-white/20'
            }`}
          >
            <FiHeart size={16} className={isInWishlist(id) ? 'fill-current' : ''} />
          </button>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center bg-accent text-white opacity-0 group-hover:opacity-100 disabled:opacity-50 z-20 cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-accent/40 border-2 border-accent-light transform hover:-translate-y-1"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-white font-semibold mb-3 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`transition-colors duration-200 ${
                      i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-600 group-hover:text-gray-500'
                    }`}
                    size={16}
                  />
                ))}
              </div>
              <span className="text-text-secondary text-sm font-medium">
                {rating.toFixed(1)} ({reviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {formatPrice(price)}
            </span>
            {oldPrice && (
              <span className="text-text-secondary line-through text-sm">
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

