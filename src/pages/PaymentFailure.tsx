import { PaymentFailure } from '@/components/checkout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState({ error: '', orderDetails: null });

  useEffect(() => {
    // Get error details from URL params
    const error = searchParams.get('error') || 'Payment failed';
    const transactionId = searchParams.get('transaction_id');
    const amount = searchParams.get('amount');
    const email = searchParams.get('email');

    setErrorDetails({
      error,
      orderDetails: transactionId ? {
        transactionId,
        totalAmount: amount ? parseFloat(amount) : 0,
        customerEmail: email || ''
      } : null
    });
  }, [searchParams]);

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <PaymentFailure
      error={errorDetails.error}
      orderDetails={errorDetails.orderDetails}
      onRetryPayment={handleRetryPayment}
      onBackToCart={handleBackToCart}
    />
  );
}