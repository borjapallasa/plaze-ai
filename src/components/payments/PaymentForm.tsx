import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  onPaymentSuccess?: (paymentIntent: any) => void;
  onPaymentError?: (error: string) => void;
  amount: number;
  isProcessing?: boolean;
  disabled?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onPaymentSuccess,
  onPaymentError,
  amount,
  isProcessing = false,
  disabled = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || disabled) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required', // Handle on the same page
      });

      if (error) {
        // Handle different types of errors
        let errorMessage = 'An unexpected error occurred.';
        
        switch (error.type) {
          case 'card_error':
          case 'validation_error':
            errorMessage = error.message || 'Please check your card information.';
            break;
          case 'invalid_request_error':
            errorMessage = 'Invalid payment request. Please try again.';
            break;
          case 'api_connection_error':
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 'api_error':
            errorMessage = 'Payment service error. Please try again.';
            break;
          case 'authentication_error':
            errorMessage = 'Authentication failed. Please refresh and try again.';
            break;
          case 'rate_limit_error':
            errorMessage = 'Too many requests. Please wait a moment.';
            break;
        }

        setMessage(errorMessage);
        toast.error(errorMessage);
        onPaymentError?.(errorMessage);
      } else {
        // Payment succeeded
        setMessage('Payment successful!');
        toast.success('Payment processed successfully!');
        onPaymentSuccess?.(paymentIntent);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setMessage(errorMessage);
      toast.error(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = !stripe || !elements || loading || isProcessing || disabled;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Amount: <span className="font-semibold">${amount.toFixed(2)}</span>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <PaymentElement
              options={{
                layout: 'tabs',
                defaultValues: {
                  billingDetails: {
                    name: '',
                    email: '',
                  },
                },
              }}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('successful') || message.includes('succeeded')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full"
            size="lg"
          >
            {loading || isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Powered by Stripe</p>
            <p>Your payment information is secure and encrypted</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};