import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe, stripeOptions } from '@/lib/stripe';
import type { StripeElementsOptions } from '@stripe/stripe-js';

interface StripeElementsProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
  amount?: number;
}

export const StripeElementsProvider: React.FC<StripeElementsProviderProps> = ({
  children,
  clientSecret,
  amount
}) => {
  const stripePromise = getStripe();

  // Configure Elements options
  const options: StripeElementsOptions = {
    ...stripeOptions,
    clientSecret,
    // Don't include amount when clientSecret is provided - it's already in the payment intent
    appearance: {
      ...stripeOptions.appearance,
      variables: {
        ...stripeOptions.appearance.variables,
        // Match your app's design
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
    loader: 'auto',
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};