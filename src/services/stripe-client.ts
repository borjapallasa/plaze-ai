import Stripe from 'stripe';

// Get the appropriate secret key based on mode
const getStripeSecretKey = (): string => {
  const mode = process.env.STRIPE_MODE || 'test';
  
  if (mode === 'production') {
    const key = process.env.STRIPE_SECRET_KEY_PROD;
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY_PROD environment variable');
    }
    return key;
  } else {
    const key = process.env.STRIPE_SECRET_KEY_TEST;
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY_TEST environment variable');
    }
    return key;
  }
};

// Get the appropriate webhook secret
export const getWebhookSecret = (): string => {
  const mode = process.env.STRIPE_MODE || 'test';
  
  if (mode === 'production') {
    const secret = process.env.STRIPE_WEBHOOK_SECRET_PROD;
    if (!secret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET_PROD environment variable');
    }
    return secret;
  } else {
    const secret = process.env.STRIPE_WEBHOOK_SECRET_TEST;
    if (!secret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET_TEST environment variable');
    }
    return secret;
  }
};

// Initialize Stripe with the appropriate configuration
const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2024-11-20.acacia', // Use the latest API version
  typescript: true,
});

export default stripe;

// Helper functions for common Stripe operations

/**
 * Create a payment intent for one-time payments (products)
 */
export const createPaymentIntent = async ({
  amount,
  currency = 'usd',
  customerId,
  metadata = {},
  description,
}: {
  amount: number; // Amount in cents
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}): Promise<Stripe.PaymentIntent> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Create or retrieve a Stripe customer
 */
export const createOrGetCustomer = async ({
  email,
  name,
  userId,
}: {
  email: string;
  name?: string;
  userId: string;
}): Promise<Stripe.Customer> => {
  try {
    // First, try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer if none exists
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (error) {
    console.error('Error creating/getting customer:', error);
    throw error;
  }
};

/**
 * Create a subscription for recurring payments (communities)
 */
export const createSubscription = async ({
  customerId,
  priceId,
  metadata = {},
  trialPeriodDays,
}: {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}): Promise<Stripe.Subscription> => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      trial_period_days: trialPeriodDays,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Retrieve a payment intent
 */
export const retrievePaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
};

/**
 * Update a payment intent
 */
export const updatePaymentIntent = async (
  paymentIntentId: string,
  params: Stripe.PaymentIntentUpdateParams
): Promise<Stripe.PaymentIntent> => {
  try {
    return await stripe.paymentIntents.update(paymentIntentId, params);
  } catch (error) {
    console.error('Error updating payment intent:', error);
    throw error;
  }
};

/**
 * Cancel a payment intent
 */
export const cancelPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  try {
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } catch (error) {
    console.error('Error canceling payment intent:', error);
    throw error;
  }
};

/**
 * Construct webhook event from raw body and signature
 */
export const constructWebhookEvent = (
  rawBody: string | Buffer,
  signature: string
): Stripe.Event => {
  const webhookSecret = getWebhookSecret();
  
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
};

export { stripe };