'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  image: string;
  images?: string;
  description?: string | null;
  rating?: number;
  reviews?: number;
  category?: {
    name: string;
    slug: string;
  };
  colors?: string;
  sizes?: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice } = useLanguage();

  // Parse images
  const images = product?.images ? JSON.parse(product.images) : [product?.image];
  const allImages = [product?.image, ...images.filter((img: string) => img !== product?.image)].filter(Boolean);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setQuantity(1);
      setSelectedImage(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice ?? undefined,
      discount: product.discount ?? undefined,
      image: product.image,
      quantity,
    });
    handleClose();
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        oldPrice: product.oldPrice ?? undefined,
        discount: product.discount ?? undefined,
        image: product.image,
        category: product.category || { name: '', slug: '' },
      });
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!isOpen || !product) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className={`
          relative w-full max-w-4xl max-h-[90vh] overflow-hidden
          bg-gradient-to-br from-primary-light via-primary to-primary-light/80
          backdrop-blur-xl rounded-3xl border border-white/10
          shadow-2xl shadow-black/50
          transition-all duration-300
          ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <FiX className="w-5 h-5 text-white" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 overflow-hidden">
            <Image
              src={allImages[selectedImage] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500"
            />

            {/* Image navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all"
                >
                  <FiChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all"
                >
                  <FiChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.slice(0, 5).map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-accent scale-110' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Image src={img} alt="" width={48} height={48} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Discount badge */}
            {product.discount && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
            {/* Category */}
            {product.category && (
              <span className="text-accent text-sm font-medium tracking-wide uppercase mb-2">
                {product.category.name}
              </span>
            )}

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating && product.reviews && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-text-secondary text-sm">
                  {product.rating.toFixed(1)} ({product.reviews} отзива)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-text-secondary/60 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-text-secondary text-sm">Количество:</span>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <FiMinus className="w-4 h-4 text-white" />
                </button>
                <span className="w-8 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <FiPlus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <FiShoppingCart className="w-5 h-5" />
                Добави в количката
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-4 rounded-2xl border transition-all ${
                  isInWishlist(product.id)
                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
