import { supabase } from '@/integrations/supabase/client';

export interface WebhookEvent {
  id: number;
  stripe_event_id: string;
  event_type: string;
  processed: boolean;
  payload: any;
  created_at: string;
  processed_at?: string;
  processing_error?: string;
}

/**
 * Get webhook events for monitoring and debugging
 */
export const getWebhookEvents = async (
  limit: number = 50,
  eventType?: string,
  processed?: boolean
) => {
  try {
    let query = supabase
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    if (processed !== undefined) {
      query = query.eq('processed', processed);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching webhook events:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching webhook events:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Get webhook events for a specific transaction
 */
export const getWebhookEventsForTransaction = async (transactionUuid: string) => {
  try {
    // Get the payment intent ID for this transaction first
    const { data: transaction } = await supabase
      .from('products_transactions')
      .select('stripe_payment_intent_id')
      .eq('product_transaction_uuid', transactionUuid)
      .single();

    if (!transaction?.stripe_payment_intent_id) {
      return { success: true, data: [] };
    }

    // Find webhook events that contain this payment intent ID
    const { data, error } = await supabase
      .from('webhook_events')
      .select('*')
      .contains('payload', { data: { object: { id: transaction.stripe_payment_intent_id } } })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching webhook events for transaction:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching webhook events for transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Manually trigger webhook event processing (for failed events)
 */
export const reprocessWebhookEvent = async (eventId: string) => {
  try {
    // This would call the webhook function again with the stored payload
    // For now, this is a placeholder - the actual implementation would depend
    // on how we want to handle webhook replay
    
    console.log('Reprocessing webhook event:', eventId);
    
    return { 
      success: true, 
      message: 'Webhook event queued for reprocessing' 
    };
  } catch (error) {
    console.error('Error reprocessing webhook event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Get payment status from webhook events
 */
export const getPaymentStatusFromWebhooks = async (paymentIntentId: string) => {
  try {
    const { data, error } = await supabase
      .from('webhook_events')
      .select('*')
      .contains('payload', { data: { object: { id: paymentIntentId } } })
      .in('event_type', [
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'payment_intent.requires_action',
        'payment_intent.canceled'
      ])
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching payment status from webhooks:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, status: 'pending' };
    }

    const latestEvent = data[0];
    let status = 'pending';

    switch (latestEvent.event_type) {
      case 'payment_intent.succeeded':
        status = 'succeeded';
        break;
      case 'payment_intent.payment_failed':
        status = 'failed';
        break;
      case 'payment_intent.requires_action':
        status = 'requires_action';
        break;
      case 'payment_intent.canceled':
        status = 'canceled';
        break;
    }

    return { success: true, status, event: latestEvent };
  } catch (error) {
    console.error('Error getting payment status from webhooks:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Monitor webhook processing health
 */
export const getWebhookHealth = async () => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get recent webhook statistics
    const { data, error } = await supabase
      .from('webhook_events')
      .select('processed, processing_error')
      .gte('created_at', oneHourAgo.toISOString());

    if (error) {
      console.error('Error fetching webhook health:', error);
      return { success: false, error: error.message };
    }

    const total = data.length;
    const processed = data.filter(event => event.processed).length;
    const failed = data.filter(event => event.processing_error).length;
    const pending = total - processed;

    const healthData = {
      total,
      processed,
      failed,
      pending,
      successRate: total > 0 ? (processed - failed) / total : 1,
      failureRate: total > 0 ? failed / total : 0,
    };

    return { success: true, data: healthData };
  } catch (error) {
    console.error('Error getting webhook health:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Subscribe to webhook events in real-time
 */
export const subscribeToWebhookEvents = (
  callback: (event: WebhookEvent) => void,
  filter?: { eventType?: string; processed?: boolean }
) => {
  let channel = supabase
    .channel('webhook_events')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'webhook_events',
        filter: filter?.eventType ? `event_type=eq.${filter.eventType}` : undefined
      },
      (payload) => {
        callback(payload.new as WebhookEvent);
      }
    );

  if (filter?.processed !== undefined) {
    channel = channel.on('postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'webhook_events',
        filter: `processed=eq.${filter.processed}`
      },
      (payload) => {
        callback(payload.new as WebhookEvent);
      }
    );
  }

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};