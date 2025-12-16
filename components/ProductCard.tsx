'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { useToast } from '@/components/Toast';

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

interface ProductCardProps extends Product {
  onQuickView?: (product: Product) => void;
}

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
  onQuickView,
}: ProductCardProps) => {
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice, t } = useLanguage();
  const { showToast } = useToast();
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
      showToast(`${name} добавен в количката`, 'cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Грешка при добавяне', 'error');
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
        showToast('Премахнат от любими', 'wishlist');
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
        showToast('Добавен в любими', 'wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative bg-gradient-to-br from-primary/90 via-primary to-primary-light/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 transform hover:-translate-y-2">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-800/80 to-gray-900/80 overflow-hidden">
          <Image
            src={image || '/placeholder.svg'}
            alt={`${name} - Премиум мобилен аксесоар от AURACASE`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={false}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/30 z-10 flex items-center gap-1">
              <span className="text-white/80">-</span>{discount}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-50 z-20 cursor-pointer transition-all duration-500 ease-out hover:scale-110 backdrop-blur-md transform hover:-translate-y-1 ${
              isInWishlist(id)
                ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FiHeart size={16} className={isInWishlist(id) ? 'fill-current' : ''} />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView({ id, name, slug, price, oldPrice, discount, image, rating, reviews, category });
              }}
              className="absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white opacity-0 group-hover:opacity-100 z-20 cursor-pointer transition-all duration-500 ease-out hover:scale-110 backdrop-blur-md hover:bg-white/20 transform hover:-translate-y-1"
            >
              <FiEye size={16} />
            </button>
          )}
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-accent to-accent-dark text-white opacity-0 group-hover:opacity-100 disabled:opacity-50 z-20 cursor-pointer transition-all duration-500 ease-out hover:scale-110 shadow-lg shadow-accent/30 backdrop-blur-md transform hover:-translate-y-1"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 relative">
          {/* Category badge */}
          {category && (
            <span className="inline-block text-xs text-accent/80 font-medium mb-2 tracking-wide uppercase">
              {category.name}
            </span>
          )}
          
          <h3 className="text-white font-semibold mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
            {name}
          </h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`transition-colors duration-300 ${
                      i < Math.floor(rating) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-gray-600/50'
                    }`}
                    size={14}
                  />
                ))}
              </div>
              <span className="text-text-secondary/70 text-xs font-medium">
                {rating.toFixed(1)} <span className="text-text-secondary/40">({reviews})</span>
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-white group-hover:text-accent transition-colors duration-300">
              {formatPrice(price)}
            </span>
            {oldPrice && (
              <span className="text-text-secondary/50 line-through text-sm">
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

