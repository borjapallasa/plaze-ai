import { supabase } from '@/integrations/supabase/client';
import { CartItem, CartTransaction } from '@/types/cart';

// Fetch cart data by user or guest session ID
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
      const items: CartItem[] = itemsData.map((item: any) => ({
        product_uuid: item.product_uuid,
        variant_uuid: item.variant_uuid,
        price: item.price,
        quantity: item.quantity,
        product_name: productNames[item.product_uuid] || 'Unknown Product',
        variant_name: variantNames[item.variant_uuid] || 'Unknown Variant'
      }));

      return {
        transaction_uuid: transactionData[0].product_transaction_uuid,
        item_count: transactionData[0].item_count,
        total_amount: transactionData[0].total_amount,
        items
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

// Find existing item in cart
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
  guestSessionId?: string,
  existingTransactionId?: string
): Promise<{ success: boolean; message?: string; updatedCart?: CartTransaction; cartItem?: CartItem }> {
  try {
    console.log('Adding to cart', cart, selectedVariant, 'using transaction:', existingTransactionId);
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
    let transactionId = existingTransactionId || cart?.transaction_uuid;

    if (!transactionId) {
      console.log('Creating NEW transaction for variant: ', selectedVariant);
      // Create a new transaction
      const newTransaction = {
        user_uuid: userId,
        item_count: 0,
        total_amount: variantData.price,
        type: userId ? 'user' as const : 'guest' as const, // Ensure it's one of the allowed values
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('products_transactions')
        .insert(newTransaction)
        .select('product_transaction_uuid')
        .single();

      console.log('Create TX: ', newTransaction, error);

      if (error || !data) {
        return {
          success: false,
          message: "Could not create shopping cart"
        };
      }

      transactionId = data.product_transaction_uuid;
    }

    // Check if this item is already in the cart
    const existingItem = findItemInCart(cart, product.product_uuid, selectedVariant);

    // Prepare the new or updated cart item
    let cartItem: CartItem;

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

      cartItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1
      };

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

      cartItem = {
        product_uuid: product.product_uuid,
        variant_uuid: selectedVariant,
        price: variantData.price,
        quantity: 1,
        product_name: product.name || 'Unknown Product',
        variant_name: variantData.name || 'Unknown Variant'
      };
    }

    // Get the current values of the transaction
    const { data: currentTransaction, error: fetchError } = await supabase
      .from('products_transactions')
      .select('item_count, total_amount')
      .eq('product_transaction_uuid', transactionId)
      .single();

    if (fetchError || !currentTransaction) {
      console.error('Error fetching current transaction:', fetchError);
      return {
        success: true,
        message: "Item added but couldn't update totals",
        cartItem
      };
    }

    // Update the transaction totals
    const newItemCount = (currentTransaction.item_count || 0) + 1;
    const newTotalAmount = (currentTransaction.total_amount || 0) + variantData.price;

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

    // Fetch the updated cart items
    const { data: updatedItems, error: itemsError } = await supabase
      .from('products_transaction_items')
      .select('product_uuid, variant_uuid, price, quantity')
      .eq('product_transaction_uuid', transactionId);

    if (itemsError || !updatedItems) {
      console.error('Error fetching updated items:', itemsError);
    }

    // Construct updated cart object
    const updatedCart: CartTransaction = {
      transaction_uuid: transactionId,
      item_count: newItemCount,
      total_amount: newTotalAmount,
      items: cart ? [...cart.items] : []
    };

    // Add or update the current item in the items array
    if (existingItem) {
      const itemIndex = updatedCart.items.findIndex(item =>
        item.product_uuid === product.product_uuid && item.variant_uuid === selectedVariant
      );
      if (itemIndex !== -1) {
        updatedCart.items[itemIndex] = cartItem;
      }
    } else {
      updatedCart.items.push(cartItem);
    }

    console.log('UPDATED CART:', updatedCart);

    return {
      success: true,
      message: "Item added to cart successfully",
      updatedCart,
      cartItem
    };
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return {
      success: false,
      message: "Failed to add item to cart. Please try again."
    };
  }
}

// Remove item from cart
export async function removeItemFromCart(
  transactionId: string,
  variantUuid: string
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('Removing item from cart:', 'transaction:', transactionId, 'variant:', variantUuid);
    
    // First get the item to calculate the price
    const { data: itemData, error: itemError } = await supabase
      .from('products_transaction_items')
      .select('price, quantity, total_price')
      .eq('product_transaction_uuid', transactionId)
      .eq('variant_uuid', variantUuid)
      .single();
    
    if (itemError || !itemData) {
      console.error('Error fetching item for removal:', itemError);
      return {
        success: false,
        message: "Could not find the item to remove"
      };
    }

    // Delete the item
    const { error: deleteError } = await supabase
      .from('products_transaction_items')
      .delete()
      .eq('product_transaction_uuid', transactionId)
      .eq('variant_uuid', variantUuid);

    if (deleteError) {
      console.error('Error deleting item:', deleteError);
      return {
        success: false,
        message: "Failed to remove item from cart"
      };
    }

    // Update the transaction totals
    const { data: transactionData, error: transactionError } = await supabase
      .from('products_transactions')
      .select('item_count, total_amount')
      .eq('product_transaction_uuid', transactionId)
      .single();

    if (transactionError || !transactionData) {
      console.error('Error fetching transaction for update:', transactionError);
      return {
        success: true,
        message: "Item removed but couldn't update cart totals"
      };
    }

    // Calculate new totals
    const newItemCount = Math.max(0, (transactionData.item_count || 0) - itemData.quantity);
    const newTotalAmount = Math.max(0, (transactionData.total_amount || 0) - itemData.total_price);

    // Update the transaction
    const { error: updateError } = await supabase
      .from('products_transactions')
      .update({
        item_count: newItemCount,
        total_amount: newTotalAmount
      })
      .eq('product_transaction_uuid', transactionId);

    if (updateError) {
      console.error('Error updating transaction totals:', updateError);
      return {
        success: false,
        message: "Item removed but failed to update cart totals"
      };
    }

    return {
      success: true,
      message: "Item removed from cart"
    };
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    return {
      success: false,
      message: "Failed to remove item from cart. Please try again."
    };
  }
}
