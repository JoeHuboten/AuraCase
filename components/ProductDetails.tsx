'use client';

import { useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';
import SocialShare from '@/components/SocialShare';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  colors?: string | null;
  sizes?: string | null;
  image: string;
  description?: string | null;
  inStock: boolean;
  stock: number;
  lowStockThreshold: number;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem: addToCart } = useCartStore();
  const { t } = useLanguage();

  const colors = product.colors ? product.colors.split(', ') : [];
  const sizes = product.sizes ? product.sizes.split(', ') : [];

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice ?? undefined,
        discount: product.discount ?? undefined,
        image: product.image,
        quantity: 1,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // You can implement wishlist functionality here
  };

  return (
    <div className="space-y-6">
      {/* Stock Status */}
      <div className="flex items-center gap-3">
        {product.inStock ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold font-body">
                {t('common.inStock', 'In Stock')}
              </span>
            </div>
            {product.stock <= product.lowStockThreshold && (
              <span className="text-yellow-400 text-sm font-body">
                ({t('product.onlyLeft', 'Only')} {product.stock} {t('product.left', 'left')})
              </span>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-400 font-semibold font-body">
              {t('common.outOfStock', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-xl font-heading font-semibold text-white mb-3">
            {t('product.colors', 'Colors')}
          </h3>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 cursor-pointer font-body ${
                  selectedColor === color
                    ? 'border-blue-500/50 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                    : 'border-white/10 text-white/50 hover:border-blue-500/30 hover:text-white hover:bg-blue-500/10'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-xl font-heading font-semibold text-white mb-3">
            {t('product.sizes', 'Sizes')}
          </h3>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 cursor-pointer font-body ${
                  selectedSize === size
                    ? 'border-blue-500/50 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20'
                    : 'border-white/10 text-white/50 hover:border-blue-500/30 hover:text-white hover:bg-blue-500/10'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button 
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.inStock}
          className="flex-1 py-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
        >
          <FiShoppingCart size={20} />
          {!product.inStock 
            ? t('product.outOfStock', 'Out of Stock')
            : isAddingToCart 
            ? t('product.adding', 'Adding...') 
            : t('product.addToCart', 'Add to Cart')}
        </button>
        <button 
          onClick={handleWishlist}
          className={`px-6 py-4 border rounded-xl transition-all duration-200 ${
            isWishlisted 
              ? 'border-red-500 text-red-500 bg-red-500/20 shadow-lg shadow-red-500/20' 
              : 'border-white/10 text-white/50 hover:border-blue-500/30 hover:text-blue-400 hover:shadow-md'
          }`}
        >
          <FiHeart size={20} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Social Share */}
      <div className="pt-4 border-t border-white/10">
        <SocialShare
          url={`https://auracase.bg/product/${product.slug}`}
          title={product.name}
          description={product.description || undefined}
          image={product.image}
        />
      </div>
    </div>
  );
}
