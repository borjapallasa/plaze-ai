import { supabase } from '@/integrations/supabase/client';
import { CartItem, CartTransaction } from '@/types/cart';

// Fetch cart data by user or guest session ID
export async function fetchCartData(userId?: string, sessionId?: string): Promise<CartTransaction | null> {
  try {
    if (!userId && !sessionId) {
      // No way to identify the cart
      return null;
    }

    // Create a base query for transactions
    let query = supabase
      .from('products_transactions')
      .select('product_transaction_uuid, item_count, total_amount')
      .eq('status', 'pending');
    
    // Apply the correct filter based on available ID
    if (userId) {
      query = query.eq('user_uuid', userId);
    } else if (sessionId) {
      query = query.eq('guest_session_id', sessionId);
    }
    
    const { data: transactionData, error: transactionError } = await query.maybeSingle();
    
    // Check for errors or no data
    if (transactionError) {
      console.error('Error fetching cart transaction:', transactionError);
      return null;
    }
    
    if (!transactionData) {
      return null;
    }

    // Get the items for this transaction
    const { data: itemsData, error: itemsError } = await supabase
      .from('products_transaction_items')
      .select('product_uuid, variant_uuid, price, quantity, total_price')
      .eq('product_transaction_uuid', transactionData.product_transaction_uuid);
    
    if (itemsError) {
      console.error('Error fetching cart items:', itemsError);
      return null;
    }
    
    if (!itemsData || !Array.isArray(itemsData)) {
      console.error('No items data or invalid format');
      return null;
    }

    // Extract product UUIDs and variant UUIDs
    const productUuids: string[] = [];
    const variantUuids: string[] = [];
    
    itemsData.forEach(item => {
      if (item.product_uuid) productUuids.push(item.product_uuid);
      if (item.variant_uuid) variantUuids.push(item.variant_uuid);
    });
    
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
    const items: CartItem[] = itemsData.map((item: any) => ({
      product_uuid: item.product_uuid,
      variant_uuid: item.variant_uuid,
      price: item.price,
      quantity: item.quantity,
      product_name: productNames[item.product_uuid] || 'Unknown Product',
      variant_name: variantNames[item.variant_uuid] || 'Unknown Variant'
    }));

    return {
      transaction_uuid: transactionData.product_transaction_uuid,
      item_count: transactionData.item_count,
      total_amount: transactionData.total_amount,
      items
    };
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return null;
  }
}

// Check if item exists in cart
export function findItemInCart(cart: CartTransaction | null, productUuid: string, variantUuid: string): CartItem | undefined {
  if (!cart) return undefined;
  return cart.items.find(item => 
    item.product_uuid === productUuid && item.variant_uuid === variantUuid
  );
}

// Add item to cart
export async function addItemToCart(
  cart: CartTransaction | null,
  product: any,
  selectedVariant: string,
  userId?: string, 
  guestSessionId?: string
): Promise<{ success: boolean; message?: string; updatedCart?: CartTransaction }> {
  try {
    // Get the variant details
    const variantResponse = await supabase
      .from('variants')
      .select('*')
      .eq('variant_uuid', selectedVariant)
      .single();
    
    if (variantResponse.error || !variantResponse.data) {
      return { 
        success: false,
        message: "Could not find the selected variant"
      };
    }
    
    const variantData = variantResponse.data;
    
    // Check for existing transaction
    let transactionId = cart?.transaction_uuid;
    
    if (!transactionId) {
      // Create a new transaction
      const newTransactionResponse = await supabase
        .from('products_transactions')
        .insert({
          user_uuid: userId,
          guest_session_id: !userId ? guestSessionId : null,
          item_count: 1,
          total_amount: variantData.price,
          type: userId ? 'user' : 'guest',
          status: 'pending'
        })
        .select('product_transaction_uuid')
        .single();
      
      if (newTransactionResponse.error || !newTransactionResponse.data) {
        return {
          success: false,
          message: "Could not create shopping cart"
        };
      }
      
      transactionId = newTransactionResponse.data.product_transaction_uuid;
    }
    
    // Check if this item is already in the cart
    const existingItem = findItemInCart(cart, product.product_uuid, selectedVariant);
    
    if (existingItem) {
      // Update the quantity of existing item
      const updateResponse = await supabase
        .from('products_transaction_items')
        .update({
          quantity: existingItem.quantity + 1,
          total_price: (existingItem.quantity + 1) * existingItem.price
        })
        .eq('product_uuid', product.product_uuid)
        .eq('variant_uuid', selectedVariant)
        .eq('product_transaction_uuid', transactionId);
      
      if (updateResponse.error) {
        return {
          success: false,
          message: "Could not update item quantity"
        };
      }
    } else {
      // Add new item to cart
      const itemResponse = await supabase
        .from('products_transaction_items')
        .insert({
          product_transaction_uuid: transactionId,
          product_uuid: product.product_uuid,
          variant_uuid: selectedVariant,
          price: variantData.price,
          quantity: 1,
          total_price: variantData.price
        });
      
      if (itemResponse.error) {
        return {
          success: false,
          message: "Could not add item to cart"
        };
      }
    }
    
    // Update the transaction totals
    const newTotalAmount = (cart?.total_amount || 0) + variantData.price;
    const newItemCount = (cart?.item_count || 0) + 1;
    
    const updateTransactionResponse = await supabase
      .from('products_transactions')
      .update({
        item_count: newItemCount,
        total_amount: newTotalAmount
      })
      .eq('product_transaction_uuid', transactionId);
    
    if (updateTransactionResponse.error) {
      return {
        success: false,
        message: "Could not update cart totals"
      };
    }
    
    // Fetch the updated cart
    const updatedCart = await fetchCartData(userId, !userId ? guestSessionId : undefined);
    
    return {
      success: true,
      message: "Item added to cart successfully",
      updatedCart: updatedCart || undefined
    };
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return {
      success: false,
      message: "Failed to add item to cart. Please try again."
    };
  }
}
