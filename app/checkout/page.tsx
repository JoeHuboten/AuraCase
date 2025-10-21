'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';
import { FiLock, FiShield, FiCreditCard, FiPackage, FiCheck, FiTag } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-accent/5 to-accent-light/5 rounded-xl p-6 border-2 border-accent/20 hover:border-accent/40 transition-colors">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-500">⚠️</span>
          <p className="text-red-500 text-sm flex-1">{errorMessage}</p>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
        <FiLock size={16} />
        <span>Secure 256-bit SSL encrypted payment</span>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-gradient-to-r from-accent to-accent-light text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-accent/20 group"
      >
        <FiLock size={20} />
        <span>{isProcessing ? 'Processing Payment...' : 'Complete Secure Payment'}</span>
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getTotal, discountCode } = useCartStore();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    if (!authLoading && user) {
      createPaymentIntent();
    }
  }, [authLoading, user, items, router]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          discountCode: discountCode?.code,
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center">
        <p className="text-white">Loading payment...</p>
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
              <FiCreditCard size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Secure Checkout</h1>
              <p className="text-text-secondary">Complete your order with confidence</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FiCheck size={16} className="text-white" />
              </div>
              <span className="text-white font-medium">Cart</span>
            </div>
            <div className="w-16 h-0.5 bg-accent"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <FiCreditCard size={16} className="text-white" />
              </div>
              <span className="text-white font-medium">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <FiPackage size={16} className="text-text-secondary" />
              </div>
              <span className="text-text-secondary font-medium">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent-light/20 rounded-xl flex items-center justify-center">
                  <FiCreditCard size={24} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payment Details</h2>
                  <p className="text-text-secondary text-sm">Enter your payment information securely</p>
                </div>
              </div>
              
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <FiShield size={24} className="text-green-400" />
                    </div>
                    <span className="text-text-secondary text-xs">SSL Secured</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <FiLock size={24} className="text-blue-400" />
                    </div>
                    <span className="text-text-secondary text-xs">Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <FiCheck size={24} className="text-purple-400" />
                    </div>
                    <span className="text-text-secondary text-xs">PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 shadow-2xl sticky top-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700/50">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent-light/20 rounded-lg flex items-center justify-center">
                  <FiPackage size={20} className="text-accent" />
                </div>
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-3 p-3 bg-background/30 rounded-xl border border-gray-700/30 hover:border-accent/30 transition-colors">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700/50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-text-secondary text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>
                
                {discountCode && (
                  <div className="flex justify-between items-center bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                    <span className="text-green-400 flex items-center gap-2 text-sm">
                      <FiTag size={14} />
                      Discount ({discountCode.percentage}%)
                    </span>
                    <span className="text-green-400 font-semibold">-${getDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-text-secondary">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-400">FREE</span>
                </div>

                <div className="border-t border-gray-700/50 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-xl font-bold">Total</span>
                    <div className="text-right">
                      <div className="text-accent text-2xl font-bold">${getTotal().toFixed(2)}</div>
                      {discountCode && (
                        <div className="text-text-secondary text-sm line-through">${getSubtotal().toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs text-right">Tax included where applicable</p>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FiShield size={20} className="text-green-400" />
                </div>
                <p className="text-green-400 font-semibold text-sm mb-1">30-Day Money Back Guarantee</p>
                <p className="text-text-secondary text-xs">Shop with confidence - we've got you covered!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}