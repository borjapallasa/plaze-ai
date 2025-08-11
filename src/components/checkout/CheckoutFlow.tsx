import React, { useState } from 'react';
import { GuestCheckout } from './GuestCheckout';
import { AuthenticatedCheckout } from './AuthenticatedCheckout';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentFailure } from './PaymentFailure';
import { useAuth } from '@/lib/auth';

type CheckoutStep = 'checkout' | 'success' | 'failure';

interface OrderDetails {
  transactionId: string;
  paymentIntentId: string;
  customerEmail: string;
  customerName: string;
  totalAmount: number;
  items: Array<{
    product_name?: string;
    variant_name?: string;
    quantity: number;
    price: number;
  }>;
}

interface CheckoutFlowProps {
  onClose?: () => void;
  onContinueShopping?: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  onClose,
  onContinueShopping
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('checkout');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentError, setPaymentError] = useState<string>('');
  const { session } = useAuth();

  const handleOrderComplete = (details: OrderDetails) => {
    setOrderDetails(details);
    setCurrentStep('success');
    setPaymentError('');
  };

  const handlePaymentError = (error: string, details?: Partial<OrderDetails>) => {
    setPaymentError(error);
    if (details) {
      setOrderDetails(details as OrderDetails);
    }
    setCurrentStep('failure');
  };

  const handleRetryPayment = () => {
    setCurrentStep('checkout');
    setPaymentError('');
  };

  const handleBackToCheckout = () => {
    setCurrentStep('checkout');
    setPaymentError('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'success':
        return (
          <PaymentSuccess
            orderDetails={orderDetails || undefined}
            onContinueShopping={onContinueShopping}
          />
        );
      
      case 'failure':
        return (
          <PaymentFailure
            error={paymentError}
            orderDetails={orderDetails ? {
              transactionId: orderDetails.transactionId,
              totalAmount: orderDetails.totalAmount,
              customerEmail: orderDetails.customerEmail
            } : undefined}
            onRetryPayment={handleRetryPayment}
            onBackToCart={onClose}
          />
        );
      
      case 'checkout':
      default:
        // Route to appropriate checkout component based on authentication status
        if (session?.user) {
          return (
            <AuthenticatedCheckout
              onOrderComplete={handleOrderComplete}
              onBack={onClose}
            />
          );
        } else {
          return (
            <GuestCheckout
              onOrderComplete={handleOrderComplete}
              onBack={onClose}
            />
          );
        }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};