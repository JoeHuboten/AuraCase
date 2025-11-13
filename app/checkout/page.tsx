'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Image from 'next/image';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getTotal, discountCode, clearCart } = useCartStore();
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
    if (items.length === 0 && !paymentComplete) router.push('/cart');
  }, [authLoading, user, items, paymentComplete, router]);

  const createOrder = async () => {
    const res = await fetch('/api/payment/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, discountCode: discountCode?.code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.orderId;
  };

  const onApprove = async (data: any) => {
    try {
      console.log('PayPal approved, capturing order:', data.orderID);
      const res = await fetch('/api/payment/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderID, items, discountCode: discountCode?.code }),
      });
      const result = await res.json();
      console.log('Capture response:', result);
      if (!res.ok) throw new Error(result.message);
      setPaymentComplete(true);
      clearCart();
      router.push(`/payment/success?orderId=${result.orderId}`);
    } catch (err: any) {
      console.error('Capture failed:', err);
      setError('Payment capture failed: ' + (err.message || 'Unknown error'));
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" /></div>;
  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'your_paypal_client_id') return <div className="min-h-screen flex items-center justify-center px-4"><div className="bg-primary border border-gray-800 rounded-xl p-8 max-w-md text-center"><h2 className="text-2xl font-bold text-white mb-4">PayPal Not Configured</h2><button onClick={() => router.push('/cart')} className="btn-primary">Back to Cart</button></div></div>;

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
          {error && <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-red-500">{error}</div>}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-primary border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment</h2>
              <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={(err) => setError('PayPal error: ' + err)} />
            </div>
            <div className="bg-primary border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 relative"><Image src={item.image} alt={item.name} fill className="object-cover rounded" /></div>
                    <div className="flex-1"><p className="text-white text-sm">{item.name}</p><p className="text-gray-400 text-xs">Qty: {item.quantity}</p></div>
                    <p className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                {discountCode && <div className="flex justify-between text-green-400"><span>Discount</span><span>-${getDiscount().toFixed(2)}</span></div>}
                <div className="flex justify-between text-white font-bold text-lg"><span>Total</span><span>${getTotal().toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}