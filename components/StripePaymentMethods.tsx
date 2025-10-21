'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiCreditCard, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  isDefault: boolean;
}

interface StripePaymentMethodsProps {
  onPaymentMethodAdded?: () => void;
  onPaymentMethodDeleted?: () => void;
}

function AddPaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        setError(stripeError.message || 'Failed to add payment method');
      } else if (paymentMethod) {
        // Save payment method to our database
        const response = await fetch('/api/account/payment-methods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'CARD',
            cardNumber: `**** **** **** ${paymentMethod.card?.last4}`,
            cardBrand: paymentMethod.card?.brand?.toUpperCase(),
            expiryMonth: paymentMethod.card?.exp_month,
            expiryYear: paymentMethod.card?.exp_year,
            holderName: 'Card Holder', // You might want to collect this
            isDefault: false,
            stripePaymentMethodId: paymentMethod.id,
          }),
        });

        if (response.ok) {
          onSuccess();
        } else {
          setError('Failed to save payment method');
        }
      }
    } catch (err) {
      setError('An error occurred while adding payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-background-secondary p-4 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                  color: '#a3a3a3',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${loading ? 'btn-loading' : ''}`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Adding...
          </>
        ) : (
          <>
            <FiPlus className="w-4 h-4" />
            Add Payment Method
          </>
        )}
      </button>
    </form>
  );
}

export default function StripePaymentMethods({ onPaymentMethodAdded, onPaymentMethodDeleted }: StripePaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/account/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const response = await fetch(`/api/account/payment-methods/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
        onPaymentMethodDeleted?.();
      } else {
        alert('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      alert('Failed to delete payment method');
    }
  };

  const handlePaymentMethodAdded = () => {
    setShowAddForm(false);
    fetchPaymentMethods();
    onPaymentMethodAdded?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Existing Payment Methods */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-primary p-4 rounded-lg border border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-accent" size={24} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">
                    {method.card.brand.toUpperCase()} •••• {method.card.last4}
                  </span>
                  {method.isDefault && (
                    <span className="bg-accent text-white px-2 py-1 rounded text-xs">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-sm">
                  Expires {method.card.exp_month.toString().padStart(2, '0')}/{method.card.exp_year}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeletePaymentMethod(method.id)}
              className="btn-icon text-red-400 hover:text-red-300"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Payment Method */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add New Payment Method
        </button>
      ) : (
        <div className="bg-primary p-6 rounded-lg border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Add New Payment Method</h3>
          <Elements stripe={stripePromise}>
            <AddPaymentMethodForm onSuccess={handlePaymentMethodAdded} />
          </Elements>
          <button
            onClick={() => setShowAddForm(false)}
            className="btn-ghost w-full mt-2"
          >
            Cancel
          </button>
        </div>
      )}

      {paymentMethods.length === 0 && !showAddForm && (
        <div className="text-center py-8">
          <FiCreditCard className="text-text-secondary mx-auto mb-4" size={48} />
          <p className="text-text-secondary mb-4">No payment methods added yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Payment Method
          </button>
        </div>
      )}
    </div>
  );
}
