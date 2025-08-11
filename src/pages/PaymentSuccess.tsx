import { PaymentSuccess } from '@/components/checkout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Try to get order details from URL params or session storage
    const transactionId = searchParams.get('transaction_id');
    const paymentIntentId = searchParams.get('payment_intent');
    const amount = searchParams.get('amount');

    if (transactionId && paymentIntentId) {
      setOrderDetails({
        transactionId,
        paymentIntentId,
        totalAmount: amount ? parseFloat(amount) : 0,
        customerEmail: searchParams.get('email') || '',
        customerName: searchParams.get('name') || '',
        items: [] // Could be populated from session storage or API call
      });
    }
  }, [searchParams]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <PaymentSuccess
      orderDetails={orderDetails}
      onContinueShopping={handleContinueShopping}
    />
  );
}