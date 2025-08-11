import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, User, Loader2, CheckCircle } from 'lucide-react';
import { StripeElementsProvider } from '@/components/payments/StripeElementsProvider';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { useCart } from '@/context/CartContext';
import { processPayment, handlePaymentSuccess as processPaymentSuccess, handlePaymentFailure } from '@/services/payment-service';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthenticatedCheckoutProps {
  onOrderComplete?: (orderDetails: any) => void;
  onBack?: () => void;
}

export const AuthenticatedCheckout: React.FC<AuthenticatedCheckoutProps> = ({
  onOrderComplete,
  onBack
}) => {
  const { cart, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Get customer info from authenticated user
  const customerInfo = {
    email: user?.email || '',
    name: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || user?.email || 'User',
  };

  const handleProceedToPayment = async () => {
    if (!cart || !cart.transaction_uuid || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Create real payment intent using our production service
      console.log('Creating payment intent for authenticated user');
      
      const paymentResult = await processPayment({
        amount: cart.total_amount,
        transactionUuid: cart.transaction_uuid,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        currency: 'usd',
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Failed to create payment intent');
      }

      if (paymentResult.clientSecret) {
        setPaymentClientSecret(paymentResult.clientSecret);
        setShowPaymentForm(true);
      } else {
        throw new Error('No client secret received from payment service');
      }

    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentComplete = async (paymentIntent: any) => {
    try {
      console.log('Payment succeeded for authenticated user:', paymentIntent);

      if (!cart?.transaction_uuid) {
        throw new Error('Transaction UUID not found');
      }

      // Handle payment success
      const result = await processPaymentSuccess(cart.transaction_uuid, paymentIntent);
      
      if (result.success) {
        toast.success('Payment completed successfully!');
        
        // Call onOrderComplete callback with order details
        onOrderComplete?.({
          transactionId: cart.transaction_uuid,
          paymentIntentId: paymentIntent.id,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          totalAmount: cart.total_amount,
          items: cart.items
        });
      } else {
        throw new Error(result.error || 'Failed to process payment success');
      }

    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error('Payment completed but there was an error processing your order. Please contact support.');
    }
  };

  const handlePaymentError = async (error: string) => {
    try {
      console.error('Payment failed:', error);

      if (cart?.transaction_uuid) {
        await handlePaymentFailure(cart.transaction_uuid, error);
      }

      toast.error(`Payment failed: ${error}`);
      setShowPaymentForm(false);
      setPaymentClientSecret('');

    } catch (err) {
      console.error('Error handling payment failure:', err);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading checkout...</span>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-4">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button onClick={onBack} variant="outline">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Back to Cart
        </Button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information - Pre-filled for authenticated users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Account Information</p>
                  <p className="text-sm text-green-700 mt-1">
                    <strong>Name:</strong> {customerInfo.name}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Email:</strong> {customerInfo.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Streamlined Checkout</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Since you're logged in, we've pre-filled your information for a faster checkout experience.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.variant_uuid} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">{item.variant_name}</p>
                    <p className="text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${cart.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${cart.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {!showPaymentForm && (
              <Button 
                onClick={handleProceedToPayment}
                className="w-full"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Complete Purchase ($${cart.total_amount.toFixed(2)})`
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Form */}
      {showPaymentForm && paymentClientSecret && (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <StripeElementsProvider 
              clientSecret={paymentClientSecret}
              amount={cart.total_amount}
            >
              <PaymentForm
                amount={cart.total_amount}
                onPaymentSuccess={handlePaymentComplete}
                onPaymentError={handlePaymentError}
                isProcessing={isProcessingPayment}
              />
            </StripeElementsProvider>
          </CardContent>
        </Card>
      )}
    </div>
  );
};