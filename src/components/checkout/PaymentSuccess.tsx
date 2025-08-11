import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentSuccessProps {
  orderDetails?: {
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
  };
  onContinueShopping?: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  orderDetails,
  onContinueShopping
}) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/');
    }
  };

  const handleViewTransactions = () => {
    navigate('/transactions');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {orderDetails && (
            <>
              {/* Order Details */}
              <div className="bg-muted p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono">{orderDetails.transactionId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <span className="font-mono">{orderDetails.paymentIntentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span>{orderDetails.customerName}</span>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="bg-muted p-4 rounded-lg text-left">
                <h3 className="font-semibold mb-3">Items Purchased</h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        {item.variant_name && (
                          <p className="text-muted-foreground">{item.variant_name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p>Qty: {item.quantity}</p>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-semibold mb-2 text-blue-800">What's Next?</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  A confirmation email with download links has been sent to{' '}
                  {orderDetails?.customerEmail ? (
                    <strong>{orderDetails.customerEmail}</strong>
                  ) : (
                    'your email address'
                  )}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Download className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>You can download your purchased items immediately</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Your transaction is secure and protected</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleViewTransactions} variant="outline" className="flex-1">
              View My Orders
            </Button>
            <Button onClick={handleContinueShopping} className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>

          {/* Support Information */}
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>
              Need help? Contact our support team with your order ID:{' '}
              {orderDetails?.transactionId ? (
                <span className="font-mono">{orderDetails.transactionId.slice(0, 8)}...</span>
              ) : (
                'included in your confirmation email'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};