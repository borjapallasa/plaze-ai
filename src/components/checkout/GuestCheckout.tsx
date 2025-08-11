import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, User, Mail, Loader2, AlertCircle } from 'lucide-react';
import { StripeElementsProvider } from '@/components/payments/StripeElementsProvider';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { useCart } from '@/context/CartContext';
import { processPayment, handlePaymentSuccess as processPaymentSuccess, handlePaymentFailure } from '@/services/payment-service';
import { toast } from 'sonner';

interface GuestCheckoutProps {
  onOrderComplete?: (orderDetails: any) => void;
  onBack?: () => void;
}

export const GuestCheckout: React.FC<GuestCheckoutProps> = ({
  onOrderComplete,
  onBack
}) => {
  const { cart, isLoading: cartLoading } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateCustomerInfo = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProceedToPayment = async () => {
    if (!validateCustomerInfo()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (!cart || !cart.transaction_uuid || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Create real payment intent using our production service
      console.log('Creating payment intent for guest user');
      
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
      console.log('Payment succeeded:', paymentIntent);

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
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={customerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Mail className="h-4 w-4 inline mr-1" />
                You'll receive order confirmation and download links at this email address.
              </p>
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
                    Initializing Payment...
                  </>
                ) : (
                  `Proceed to Payment ($${cart.total_amount.toFixed(2)})`
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