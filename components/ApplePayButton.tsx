'use client';
import { useState, useEffect } from 'react';
import { loadStripe, Stripe, PaymentRequest } from '@stripe/stripe-js';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { FiSmartphone } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface ApplePayButtonProps {
  amount: number; // in EUR (e.g., 29.99)
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

function ApplePayButtonInner({ 
  amount, 
  items, 
  shippingAddress,
  discountCode,
  onSuccess, 
  onError 
}: ApplePayButtonProps) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'BG',
      currency: 'eur',
      total: {
        label: 'AuraCase - Поръчка',
        amount: Math.round(amount * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Apple Pay or Google Pay is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setCanMakePayment(true);
        setPaymentRequest(pr);
      }
    });

    // Handle payment method
    pr.on('paymentmethod', async (event) => {
      setIsProcessing(true);
      
      try {
        // Create payment intent on the server
        const intentResponse = await fetch('/api/payment/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            discountCode,
            shippingAddress,
            paymentMethodType: 'apple_pay',
          }),
        });

        const intentData = await intentResponse.json();

        if (!intentResponse.ok) {
          event.complete('fail');
          onError(intentData.message || 'Грешка при създаване на плащане');
          setIsProcessing(false);
          return;
        }

        // Confirm the payment
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          intentData.clientSecret,
          { payment_method: event.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          event.complete('fail');
          onError(confirmError.message || 'Плащането не е успешно');
          setIsProcessing(false);
          return;
        }

        event.complete('success');

        // Handle additional authentication if needed
        if (paymentIntent?.status === 'requires_action') {
          const { error: actionError } = await stripe.confirmCardPayment(intentData.clientSecret);
          if (actionError) {
            onError(actionError.message || 'Автентикацията не е успешна');
            setIsProcessing(false);
            return;
          }
        }

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
          onError(captureData.message || 'Грешка при обработка на поръчката');
          setIsProcessing(false);
          return;
        }

        onSuccess(captureData.orderId);
      } catch (err: any) {
        event.complete('fail');
        onError(err.message || 'Неизвестна грешка');
        setIsProcessing(false);
      }
    });

    return () => {
      // Cleanup
    };
  }, [stripe, amount, items, shippingAddress, discountCode, onSuccess, onError]);

  if (!canMakePayment || !paymentRequest) {
    return null;
  }

  return (
    <div className="w-full">
      {isProcessing ? (
        <div className="w-full py-3 bg-black rounded-lg flex items-center justify-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          <span className="text-white font-medium">Обработка...</span>
        </div>
      ) : (
        <PaymentRequestButtonElement
          options={{
            paymentRequest,
            style: {
              paymentRequestButton: {
                type: 'buy',
                theme: 'dark',
                height: '48px',
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default function ApplePayButton(props: ApplePayButtonProps) {
  const [stripeConfigured, setStripeConfigured] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripeConfigured(false);
    }
  }, []);

  if (!stripeConfigured) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <ApplePayButtonInner {...props} />
    </Elements>
  );
}
