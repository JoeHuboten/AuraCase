'use client';

import { useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  colors?: string | null;
  sizes?: string | null;
  image: string;
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
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">
            {t('product.colors', 'Colors')}
          </h3>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedColor === color
                    ? 'border-accent bg-accent/20 text-white shadow-lg shadow-accent/20'
                    : 'border-gray-700 text-text-secondary hover:border-accent hover:text-white hover:bg-accent/10'
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
          <h3 className="text-xl font-semibold text-white mb-3">
            {t('product.sizes', 'Sizes')}
          </h3>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedSize === size
                    ? 'border-accent bg-accent/20 text-white shadow-lg shadow-accent/20'
                    : 'border-gray-700 text-text-secondary hover:border-accent hover:text-white hover:bg-accent/10'
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
          disabled={isAddingToCart}
          className="btn-primary flex-1 py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={20} />
          {isAddingToCart ? t('product.adding', 'Adding...') : t('product.addToCart', 'Add to Cart')}
        </button>
        <button 
          onClick={handleWishlist}
          className={`btn-icon px-6 py-4 border rounded-full transition-all duration-200 ${
            isWishlisted 
              ? 'border-red-500 text-red-500 bg-red-500/20 shadow-lg shadow-red-500/20' 
              : 'border-gray-700 hover:border-accent hover:text-accent hover:shadow-md'
          }`}
        >
          <FiHeart size={20} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>
    </div>
  );
}
