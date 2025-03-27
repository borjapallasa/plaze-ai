
import { supabase } from '@/integrations/supabase/client';
import { CartTransaction } from '@/types/cart';

/**
 * Fetch cart data by user or guest session ID
 */
export async function fetchCartData(userId?: string, sessionId?: string): Promise<CartTransaction | null> {
  try {
    if (!userId && !sessionId) {
      // No way to identify the cart
      return null;
    }

    // Apply the correct filter based on available ID
    if (userId) {
      const { data: transactionData, error: transactionError } = await supabase
        .from('products_transactions')
        .select('product_transaction_uuid, item_count, total_amount, status, payment_link, user_uuid')
        .eq('user_uuid', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }) // Sort by latest
        .limit(1);

      // Check for errors or no data
      if (transactionError) {
        console.error('Error fetching cart transaction:', transactionError);
        return null;
      }

      if (!transactionData || transactionData.length === 0) {
        return null;
      }

      // Get the items for this transaction
      const { data: itemsData, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select('product_transaction_item_uuid, product_uuid, variant_uuid, price, quantity, total_price')
        .eq('product_transaction_uuid', transactionData[0].product_transaction_uuid);

      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        return null;
      }

      if (!itemsData || !Array.isArray(itemsData)) {
        console.error('No items data or invalid format');
        return null;
      }

      const enrichedItems = await enrichCartItems(itemsData);

      return {
        transaction_uuid: transactionData[0].product_transaction_uuid,
        item_count: transactionData[0].item_count,
        total_amount: transactionData[0].total_amount,
        items: enrichedItems
      };
    } else if (sessionId) {
      // Handle guest cart (this would be implemented in a similar way)
      console.log('Guest cart not fully implemented yet');
      return null;
    } else {
      console.error('No user ID or session ID found')
      throw new Error('No user ID')
    }
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return null;
  }
}

/**
 * Enrich cart items with product and variant details
 */
async function enrichCartItems(itemsData: any[]): Promise<any[]> {
  // Extract product UUIDs and variant UUIDs
  const productUuids = itemsData
    .filter(item => item.product_uuid)
    .map(item => item.product_uuid);

  const variantUuids = itemsData
    .filter(item => item.variant_uuid)
    .map(item => item.variant_uuid);

  // Prepare result maps
  let productNames: Record<string, string> = {};
  let variantNames: Record<string, string> = {};

  // Only fetch product names if we have product UUIDs
  if (productUuids.length > 0) {
    const { data: productsData } = await supabase
      .from('products')
      .select('product_uuid, name')
      .in('product_uuid', productUuids);

    if (productsData) {
      productsData.forEach((product: any) => {
        productNames[product.product_uuid] = product.name;
      });
    }
  }

  // Only fetch variant names if we have variant UUIDs
  if (variantUuids.length > 0) {
    const { data: variantsData } = await supabase
      .from('variants')
      .select('variant_uuid, name')
      .in('variant_uuid', variantUuids);

    if (variantsData) {
      variantsData.forEach((variant: any) => {
        variantNames[variant.variant_uuid] = variant.name;
      });
    }
  }

  // Map the items with their names
  return itemsData.map((item: any) => ({
    product_uuid: item.product_uuid,
    variant_uuid: item.variant_uuid,
    price: item.price,
    quantity: item.quantity,
    product_name: productNames[item.product_uuid] || 'Unknown Product',
    variant_name: variantNames[item.variant_uuid] || 'Unknown Variant'
  }));
}
