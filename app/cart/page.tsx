"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiArrowRight,
  FiTag,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscount,
    getTotal,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
  } = useCartStore();
  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("Cart mounted, items:", items);
  }, [items]);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setApplyingDiscount(true);
    setDiscountError("");
    const success = await applyDiscountCode(discountInput.toUpperCase());
    if (!success) {
      setDiscountError("Invalid or expired discount code");
    } else {
      setDiscountInput("");
    }
    setApplyingDiscount(false);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background">
        <div className="container-custom py-16">
          <div className="text-center max-w-lg mx-auto">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-light/20 rounded-full animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center border border-gray-800/50">
                <FiShoppingCart size={48} className="text-accent" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your cart is empty
            </h1>
            <p className="text-text-secondary mb-8 text-lg">
              Discover amazing products and start shopping today!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-accent/20"
            >
              <FiShoppingCart size={20} />
              <span>Start Shopping</span>
              <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center">
              <FiShoppingCart size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Shopping Cart</h1>
              <p className="text-text-secondary">
                {items.length} {items.length === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.color || "default"}-${item.size || "default"}`}
                className="group bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700/50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {item.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{item.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-accent transition-colors truncate">
                      {item.name}
                    </h3>

                    {/* Variants */}
                    {(item.color || item.size) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.color && (
                          <span className="inline-flex items-center gap-1 bg-background/50 text-text-secondary text-xs px-3 py-1 rounded-full border border-gray-700/50">
                            <div
                              className="w-3 h-3 rounded-full border border-gray-600"
                              style={{
                                backgroundColor: item.color.toLowerCase(),
                              }}
                            ></div>
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-background/50 text-text-secondary text-xs px-3 py-1 rounded-full border border-gray-700/50">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <p className="text-accent font-bold text-2xl">
                        {(item.price * item.quantity).toFixed(2)} лв
                      </p>
                      <span className="text-text-secondary text-sm">
                        {item.price.toFixed(2)} лв each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-1 bg-background/50 rounded-xl p-1 border border-gray-700/50">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.color,
                            item.size,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-accent hover:text-white rounded-lg transition-all"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={18} />
                      </button>
                      <span className="text-white font-medium w-12 text-center text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.color,
                            item.size,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-accent hover:text-white rounded-lg transition-all"
                      >
                        <FiPlus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.color, item.size)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors group/btn"
                    >
                      <FiTrash2
                        size={18}
                        className="group-hover/btn:scale-110 transition-transform"
                      />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button */}
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-primary/60 to-primary/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 text-text-secondary hover:text-white hover:border-accent/50 transition-all group"
            >
              <FiShoppingCart size={20} />
              <span>Continue Shopping</span>
              <FiArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 sticky top-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700/50">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent-light/20 rounded-lg flex items-center justify-center">
                  <FiPackage size={20} className="text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-white">Order Summary</h2>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-secondary text-sm">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="text-white font-semibold text-lg">
                    {getSubtotal().toFixed(2)} лв
                  </span>
                </div>

                {discountCode && (
                  <div className="flex justify-between items-center bg-green-500/10 rounded-lg p-3 border border-green-500/30 my-2">
                    <span className="text-green-400 flex items-center gap-2 text-sm">
                      <FiTag size={14} />
                      Discount ({discountCode.percentage}%)
                    </span>
                    <span className="text-green-400 font-semibold">
                      -{getDiscount().toFixed(2)} лв
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-text-secondary text-sm">Shipping</span>
                  <span className="font-semibold text-green-400 text-sm">
                    FREE
                  </span>
                </div>

                <div className="border-t border-gray-700/50 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-white text-lg font-bold">Total</span>
                  <div className="text-right">
                    <div className="text-accent text-3xl font-bold">
                      {getTotal().toFixed(2)} лв
                    </div>
                    {discountCode && (
                      <div className="text-text-secondary text-xs line-through mt-1">
                        {getSubtotal().toFixed(2)} лв
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Discount Code Section */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white font-medium mb-3">
                  <FiTag size={18} />
                  Discount Code
                </label>
                {discountCode ? (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FiTag size={20} className="text-green-400" />
                        </div>
                        <div>
                          <div className="text-green-400 font-bold text-lg">
                            {discountCode.code}
                          </div>
                          <div className="text-green-400/70 text-sm">
                            -{discountCode.percentage}% discount applied
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={removeDiscountCode}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={discountInput}
                        onChange={(e) =>
                          setDiscountInput(e.target.value.toUpperCase())
                        }
                        placeholder="SUMMER20"
                        className="flex-1 bg-background/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent focus:bg-background/70 transition-all"
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={applyingDiscount || !discountInput.trim()}
                        className="bg-gradient-to-r from-accent to-accent-light text-white px-10 py-3 rounded-xl hover:scale-105 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold shadow-lg shadow-accent/20 flex items-center justify-center"
                      >
                        {applyingDiscount ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {discountError && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                        <span>⚠️</span>
                        <span>{discountError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-accent to-accent-light text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all transform active:scale-95 shadow-lg shadow-accent/20 group"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-700/50 space-y-3">
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">✓</span>
                  </div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <FiTruck size={16} className="text-blue-400" />
                  </div>
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400">↺</span>
                  </div>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
