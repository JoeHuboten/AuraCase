'use client';
import { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe-client';
import { FiCreditCard, FiLock } from 'react-icons/fi';

interface StripeCardPaymentProps {
  amount: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    size?: string;
    productId: string;
    variantId?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes: string;
  };
  discountCode?: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.4)',
      },
      iconColor: '#60a5fa',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

function StripeCardPaymentInner({
  amount,
  items,
  shippingAddress,
  discountCode,
  onSuccess,
  onError,
}: StripeCardPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Create payment intent on the server
      const intentResponse = await fetch('/api/payment/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          discountCode,
          shippingAddress,
          paymentMethodType: 'card',
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok) {
        throw new Error(intentData.message || 'Грешка при създаване на плащане');
      }

      // Confirm the payment with the card element
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
              email: shippingAddress.email,
              phone: shippingAddress.phone,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                postal_code: shippingAddress.postalCode,
                country: 'BG',
              },
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message || 'Плащането не е успешно');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Capture the payment and create order
        const captureResponse = await fetch('/api/payment/stripe/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: intentData.paymentIntentId,
            items,
            discountCode,
            shippingAddress,
          }),
        });

        const captureData = await captureResponse.json();

        if (!captureResponse.ok) {
          throw new Error(captureData.message || 'Грешка при обработка на поръчката');
        }

        onSuccess(captureData.orderId);
      } else {
        throw new Error('Плащането не е завършено');
      }
    } catch (err: any) {
      setCardError(err.message || 'Неизвестна грешка');
      onError(err.message || 'Неизвестна грешка');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <FiCreditCard className="text-blue-400" size={18} />
          <span className="text-white/70 text-sm font-medium">Данни на картата</span>
        </div>
        <CardElement options={cardElementOptions} />
      </div>

      {cardError && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          {cardError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            <span>Обработка...</span>
          </>
        ) : (
          <>
            <FiLock size={18} />
            <span>Плати {amount.toFixed(2)} лв</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
        <FiLock size={12} />
        <span>Сигурно плащане с SSL криптиране чрез Stripe</span>
      </div>
    </form>
  );
}

export default function StripeCardPayment(props: StripeCardPaymentProps) {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      return;
    }
    const s = getStripe();
    if (s) {
      setStripePromise(s);
      setIsReady(true);
    }
  }, []);

  if (!isReady || !stripePromise) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardPaymentInner {...props} />
    </Elements>
  );
}
