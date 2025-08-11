import { supabase } from '@/integrations/supabase/client';
import { getStripe } from '@/lib/stripe';

export interface PaymentRequest {
  amount: number; // In dollars
  transactionUuid: string;
  customerEmail?: string;
  customerName?: string;
  currency?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: any;
  error?: string;
  clientSecret?: string;
}

/**
 * Production payment processing using Stripe Edge Functions
 * Creates real payment intents via Supabase Edge Functions
 */
export const processPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
  try {
    console.log('Processing payment with real Stripe API:', request);

    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // Call our Edge Function to create a payment intent
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        transactionUuid: request.transactionUuid,
        amount: request.amount,
        currency: request.currency || 'usd',
        customerEmail: request.customerEmail,
        customerName: request.customerName,
      },
    });

    if (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.message || 'Failed to create payment intent');
    }

    if (!data || !data.success) {
      throw new Error(data?.message || 'Payment intent creation failed');
    }

    console.log('Real payment intent created:', data);

    return {
      success: true,
      clientSecret: data.clientSecret,
      paymentIntent: {
        id: data.paymentIntentId,
        client_secret: data.clientSecret,
        amount: data.amount,
        currency: data.currency,
        status: 'requires_payment_method',
      },
    };

  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed',
    };
  }
};

/**
 * Update transaction status after successful payment
 */
export const updateTransactionStatus = async (
  transactionUuid: string,
  paymentIntentId: string,
  status: 'paid' | 'failed' | 'pending' = 'paid'
) => {
  try {
    console.log('Updating transaction status:', { transactionUuid, paymentIntentId, status });

    const { error } = await supabase
      .from('products_transactions')
      .update({
        payment_reference_id: paymentIntentId,
        payment_provider: 'stripe',
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('product_transaction_uuid', transactionUuid);

    if (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error: error.message };
    }

    console.log('Transaction updated successfully');
    return { success: true };

  } catch (error) {
    console.error('Error updating transaction status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update transaction',
    };
  }
};

/**
 * Handle payment success
 */
export const handlePaymentSuccess = async (
  transactionUuid: string,
  paymentIntent: any
) => {
  try {
    console.log('Handling payment success:', { transactionUuid, paymentIntentId: paymentIntent.id });

    // Update transaction status
    const updateResult = await updateTransactionStatus(
      transactionUuid,
      paymentIntent.id,
      'paid'
    );

    if (!updateResult.success) {
      throw new Error(updateResult.error || 'Failed to update transaction');
    }

    // Additional success handling can be added here
    // - Send confirmation email
    // - Update user points/credits
    // - Clear cart
    // - Grant product access

    return {
      success: true,
      message: 'Payment processed successfully',
    };

  } catch (error) {
    console.error('Error handling payment success:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process payment success',
    };
  }
};

/**
 * Handle payment failure
 */
export const handlePaymentFailure = async (
  transactionUuid: string,
  error: string
) => {
  try {
    console.log('Handling payment failure:', { transactionUuid, error });

    // Update transaction status to failed
    const updateResult = await updateTransactionStatus(
      transactionUuid,
      `failed_${Date.now()}`,
      'failed'
    );

    if (!updateResult.success) {
      console.error('Failed to update transaction status:', updateResult.error);
    }

    // Log the failure for debugging
    console.error('Payment failed for transaction:', transactionUuid, error);

    return {
      success: true,
      message: 'Payment failure recorded',
    };

  } catch (err) {
    console.error('Error handling payment failure:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to handle payment failure',
    };
  }
};

/**
 * Get transaction details for payment processing
 */
export const getTransactionForPayment = async (transactionUuid: string) => {
  try {
    const { data, error } = await supabase
      .from('products_transactions')
      .select(`
        *,
        products_transaction_items (
          product_uuid,
          variant_uuid,
          price,
          quantity,
          total_price
        )
      `)
      .eq('product_transaction_uuid', transactionUuid)
      .eq('status', 'pending')
      .single();

    if (error) {
      console.error('Error fetching transaction:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Transaction not found' };
    }

    return { success: true, data };

  } catch (error) {
    console.error('Error getting transaction for payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction',
    };
  }
};

// Legacy functions for compatibility (deprecated, use new functions above)

export interface CreatePaymentIntentRequest {
  transactionUuid: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  isSubscription?: boolean;
  subscriptionPriceId?: string;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  customerId?: string;
  subscriptionId?: string;
  amount?: number;
  currency?: string;
  error?: boolean;
  message?: string;
}

/**
 * @deprecated Use processPayment instead
 * Legacy function for backward compatibility
 */
export const createPaymentIntent = async (
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  console.warn('createPaymentIntent is deprecated, use processPayment instead');
  
  try {
    // Call our Edge Function directly for backward compatibility
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        transactionUuid: request.transactionUuid,
        amount: request.amount,
        currency: request.currency || 'usd',
        customerEmail: request.customerEmail,
        customerName: request.customerName,
        isSubscription: request.isSubscription || false,
        subscriptionPriceId: request.subscriptionPriceId,
      },
    });

    if (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: true,
        message: error.message || 'Failed to create payment intent',
      };
    }

    if (!data || !data.success) {
      return {
        success: false,
        error: true,
        message: data?.message || 'Payment intent creation failed',
      };
    }

    return {
      success: true,
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
      customerId: data.customerId,
      subscriptionId: data.subscriptionId,
      amount: data.amount,
      currency: data.currency,
      error: false,
    };

  } catch (err) {
    console.error('Error in createPaymentIntent:', err);
    return {
      success: false,
      error: true,
      message: err instanceof Error ? err.message : 'Failed to create payment intent',
    };
  }
};