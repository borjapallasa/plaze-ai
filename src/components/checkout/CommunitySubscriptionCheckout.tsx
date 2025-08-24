import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { StripeElementsProvider } from '@/components/payments/StripeElementsProvider';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { toast } from 'sonner';
import { handleSubscriptionPaymentSuccess, handleSubscriptionPaymentFailure } from '@/services/payment-service';
import { createPaymentIntent } from '@/services/payment-service';
import { supabase } from '@/integrations/supabase/client';

interface CommunitySubscriptionCheckoutProps {
  community: {
    community_uuid: string;
    name: string;
    description?: string;
    thumbnail?: string;
  };
  pricing: {
    community_price_uuid: string;
    amount: number;
    currency: string;
    billing_period: 'monthly' | 'yearly';
    stripe_price_id?: string;
  };
  onSuccess?: (data: {
    subscriptionId: string;
    communityId: string;
    customerEmail: string;
  }) => void;
  onCancel?: () => void;
}

export const CommunitySubscriptionCheckout: React.FC<CommunitySubscriptionCheckoutProps> = ({
  community,
  pricing,
  onSuccess,
  onCancel
}) => {
  const { user, session } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentClientSecret, setPaymentClientSecret] = useState('');
  const [currentTransactionId, setCurrentTransactionId] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    email: user?.email || '',
    name: user?.user_metadata?.full_name || `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || '',
  });

  // For guest users, allow form editing
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
  });

  const isAuthenticated = !!session?.user;

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const createSubscriptionTransaction = async () => {
    try {
      console.log('Creating community subscription transaction');
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Create community subscription transaction in the database
      const transactionData = {
        user_uuid: user.id,
        community_uuid: community.community_uuid,
        amount: pricing.amount,
        // Set community_price_uuid to null - not being used and causes FK constraint issues
        community_price_uuid: null,
      };

      console.log('Creating community subscription transaction:', transactionData);

      const { data, error } = await supabase
        .from('community_subscriptions_transactions')
        .insert(transactionData)
        .select('community_subscription_transaction_uuid')
        .single();

      if (error) {
        console.error('Error creating subscription transaction:', error);
        throw error;
      }

      console.log('Created subscription transaction:', data);
      return data.community_subscription_transaction_uuid;
      
    } catch (error) {
      console.error('Error creating subscription transaction:', error);
      throw error;
    }
  };

  const handleProceedToPayment = async () => {
    // Validate form data for guest users
    if (!isAuthenticated) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Update customer info for guest checkout
      setCustomerInfo({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
    }

    try {
      setIsProcessingPayment(true);

      // Create subscription transaction first
      const transactionId = await createSubscriptionTransaction();
      
      // Store the transaction ID for later use
      setCurrentTransactionId(transactionId);

      // Create Stripe subscription payment intent
      console.log('Creating subscription payment intent');
      
      const paymentResult = await createPaymentIntent({
        transactionUuid: transactionId,
        amount: pricing.amount,
        currency: pricing.currency,
        customerEmail: isAuthenticated ? customerInfo.email : formData.email,
        customerName: isAuthenticated ? customerInfo.name : `${formData.firstName} ${formData.lastName}`.trim(),
        isSubscription: true,
        subscriptionPriceId: pricing.stripe_price_id,
        communityUuid: community.community_uuid,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Failed to create payment intent');
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

  // Auto-trigger payment creation when component mounts
  useEffect(() => {
    // Auto-trigger for both authenticated and non-authenticated users
    if (!paymentClientSecret) {
      handleProceedToPayment();
    }
  }, []); // Run only once on mount

  const handlePaymentComplete = async (paymentIntent: any) => {
    try {
      console.log('🔄 Processing subscription payment success:', paymentIntent);
      console.log('🆔 Current transaction ID:', currentTransactionId);
      console.log('💳 Payment Intent ID:', paymentIntent.id);

      if (!currentTransactionId) {
        throw new Error('No transaction ID available for payment success processing');
      }

      // Handle subscription payment success (this will update database via webhooks)
      const result = await handleSubscriptionPaymentSuccess(currentTransactionId, paymentIntent);
      
      console.log('🎯 Payment success result:', result);
      
      if (result.success) {
        console.log('✅ Subscription payment processed successfully');
        toast.success('Subscription activated successfully!');
        
        // Call success callback
        onSuccess?.({
          subscriptionId: paymentIntent.id,
          communityId: community.community_uuid,
          customerEmail: isAuthenticated ? customerInfo.email : formData.email,
        });
      } else {
        console.error('❌ Payment success processing failed:', result.error);
        throw new Error(result.error || 'Failed to process subscription success');
      }

    } catch (error) {
      console.error('💥 Error handling subscription success:', error);
      toast.error('Subscription completed but there was an error processing. Please contact support.');
    }
  };

  const handlePaymentError = async (error: string) => {
    try {
      console.error('Subscription payment failed:', error);
      
      await handleSubscriptionPaymentFailure(currentTransactionId, error);
      toast.error(`Subscription payment failed: ${error}`);
      
      // Reset payment form
      setShowPaymentForm(false);
      setPaymentClientSecret('');

    } catch (err) {
      console.error('Error handling subscription payment failure:', err);
    }
  };

  // Show loading state while payment intent is being created
  if (showPaymentForm && !paymentClientSecret) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Complete Your Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Preparing payment form...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPaymentForm && paymentClientSecret) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Complete Your Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted/50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{community.name}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatPrice(pricing.amount, pricing.currency)} / {pricing.billing_period}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <StripeElementsProvider clientSecret={paymentClientSecret}>
                  <PaymentForm
                    onPaymentSuccess={handlePaymentComplete}
                    onPaymentError={handlePaymentError}
                    isProcessing={isProcessingPayment}
                    amount={pricing.amount}
                    currency={pricing.currency}
                  />
                </StripeElementsProvider>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback error state (should never be reached since showPaymentForm is always true)
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Loading payment form...</p>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="mt-4">
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};