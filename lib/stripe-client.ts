import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.warn('Stripe publishable key is not set. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env file');
    return null;
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;
