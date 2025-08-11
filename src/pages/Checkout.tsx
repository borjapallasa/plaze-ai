import { CheckoutFlow } from '@/components/checkout';
import { CartProvider } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const navigate = useNavigate();

  const handleCheckoutClose = () => {
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <CartProvider>
      <CheckoutFlow
        onClose={handleCheckoutClose}
        onContinueShopping={handleContinueShopping}
      />
    </CartProvider>
  );
}