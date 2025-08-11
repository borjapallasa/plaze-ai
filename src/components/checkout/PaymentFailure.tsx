import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ShoppingCart, AlertTriangle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentFailureProps {
  error?: string;
  orderDetails?: {
    transactionId: string;
    totalAmount: number;
    customerEmail: string;
  };
  onRetryPayment?: () => void;
  onBackToCart?: () => void;
}

export const PaymentFailure: React.FC<PaymentFailureProps> = ({
  error,
  orderDetails,
  onRetryPayment,
  onBackToCart
}) => {
  const navigate = useNavigate();

  const handleBackToCart = () => {
    if (onBackToCart) {
      onBackToCart();
    } else {
      navigate('/cart');
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const getErrorMessage = (error?: string): string => {
    if (!error) return 'An unexpected error occurred during payment processing.';
    
    // Common Stripe error messages and their user-friendly versions
    if (error.toLowerCase().includes('declined')) {
      return 'Your payment was declined. Please check your card details or try a different payment method.';
    }
    
    if (error.toLowerCase().includes('insufficient')) {
      return 'Insufficient funds. Please check your account balance or try a different payment method.';
    }
    
    if (error.toLowerCase().includes('expired')) {
      return 'Your card has expired. Please update your payment information.';
    }
    
    if (error.toLowerCase().includes('cvc') || error.toLowerCase().includes('security code')) {
      return 'Invalid security code. Please check the CVC/CVV on your card.';
    }
    
    if (error.toLowerCase().includes('number')) {
      return 'Invalid card number. Please check and re-enter your card information.';
    }
    
    if (error.toLowerCase().includes('network') || error.toLowerCase().includes('connection')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    return error;
  };

  const getRetryRecommendation = (error?: string): string => {
    if (!error) return 'Please try again or contact support if the problem persists.';
    
    if (error.toLowerCase().includes('declined')) {
      return 'Try using a different payment method or contact your bank.';
    }
    
    if (error.toLowerCase().includes('network') || error.toLowerCase().includes('connection')) {
      return 'Check your internet connection and try again.';
    }
    
    if (error.toLowerCase().includes('expired') || error.toLowerCase().includes('cvc') || error.toLowerCase().includes('number')) {
      return 'Update your payment information and try again.';
    }
    
    return 'Please try again or contact support if the problem continues.';
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
          <p className="text-muted-foreground">
            We couldn't process your payment. Please try again.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="bg-red-50 p-4 rounded-lg text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">What went wrong?</h3>
                <p className="text-sm text-red-700 mb-3">{getErrorMessage(error)}</p>
                <p className="text-sm text-red-600">{getRetryRecommendation(error)}</p>
              </div>
            </div>
          </div>

          {orderDetails && (
            <div className="bg-muted p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono">{orderDetails.transactionId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">${orderDetails.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-red-600 font-medium">Payment Failed</span>
                </div>
              </div>
            </div>
          )}

          {/* Common Solutions */}
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-semibold mb-2 text-blue-800">Common Solutions</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Double-check your card information (number, expiry, CVC)</span>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Try a different payment method</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Contact your bank if payments are being blocked</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onRetryPayment && (
              <Button onClick={onRetryPayment} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Payment
              </Button>
            )}
            <Button onClick={handleBackToCart} variant="outline" className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <Button onClick={handleContinueShopping} variant="outline" className="flex-1">
              Continue Shopping
            </Button>
          </div>

          {/* Support Information */}
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>
              Still having trouble? Contact our support team for assistance.
              {orderDetails && (
                <span>
                  {' '}Reference order ID: <span className="font-mono">{orderDetails.transactionId.slice(0, 8)}...</span>
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};