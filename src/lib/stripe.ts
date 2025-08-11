import { loadStripe, Stripe } from '@stripe/stripe-js';

// Get Stripe publishable key - Lovable compatible
const getStripePublishableKey = (): string => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!key) {
    // For development, show a helpful error
    if (import.meta.env.DEV) {
      console.error('Add VITE_STRIPE_PUBLISHABLE_KEY to your Lovable environment variables');
    }
    throw new Error('Stripe publishable key not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
  }
  
  return key;
};

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = getStripePublishableKey();
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Helper function to format currency amounts for display
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Stripe amounts are in cents
};

// Helper function to convert dollars to cents for Stripe
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

// Helper function to convert cents to dollars
export const centsToDollars = (cents: number): number => {
  return cents / 100;
};

// Stripe configuration options
export const stripeOptions = {
  // Customize the appearance of Elements
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  },
};

export default getStripe;