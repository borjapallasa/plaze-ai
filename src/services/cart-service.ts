
import { supabase } from '@/integrations/supabase/client';
import { CartItem, CartTransaction } from '@/types/cart';

// Fetch cart data by user ID
export async function fetchCartData(userId?: string): Promise<CartTransaction | null> {
  try {
    if (!userId) {
      return null;
    }

    // Get the transaction for this user
    const { data: transactionData, error: transactionError } = await supabase
      .from('products_transactions')
      .select('product_transaction_uuid, item_count, user_uuid')
      .eq('user_uuid', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

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
      .select('product_transaction_item_uuid, product_uuid, variant_uuid')
      .eq('product_transaction_uuid', transactionData[0].product_transaction_uuid);

    if (itemsError) {
      console.error('Error fetching cart items:', itemsError);
      return null;
    }

    if (!itemsData || !Array.isArray(itemsData)) {
      console.error('No items data or invalid format');
      return null;
    }

    // Get product and variant names
    const productUuids = itemsData
      .filter(item => item.product_uuid)
      .map(item => item.product_uuid);

    const variantUuids = itemsData
      .filter(item => item.variant_uuid)
      .map(item => item.variant_uuid);

    let productNames: Record<string, string> = {};
    let variantNames: Record<string, string> = {};

    // Fetch product names
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

    // Fetch variant names
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
      price: 0, // Not storing price anymore
      quantity: 1, // Default to 1 since we're not tracking quantity
      product_name: productNames[item.product_uuid] || 'Unknown Product',
      variant_name: variantNames[item.variant_uuid] || 'Unknown Variant',
      is_available: true
    }));

    const cartData = {
      transaction_uuid: transactionData[0].product_transaction_uuid,
      item_count: transactionData[0].item_count,
      total_amount: 0, // Not calculating totals anymore
      items
    };

    console.log('Returning simplified cart data:', cartData);
    return cartData;
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

// Add item to cart (simplified)
export async function addItemToCart(
  cart: CartTransaction | null,
  product: any,
  selectedVariant: string,
  userId?: string
): Promise<{ success: boolean; message?: string; updatedCart?: CartTransaction; cartItem?: CartItem }> {
  try {
    console.log('Adding to cart (simplified):', { selectedVariant, userId });

    if (!userId) {
      return {
        success: false,
        message: "User authentication required"
      };
    }

    // Check for existing transaction
    let transactionId = cart?.transaction_uuid;

    if (!transactionId) {
      console.log('Creating new transaction');
      // Create a new transaction with only required fields
      const { data, error } = await supabase
        .from('products_transactions')
        .insert({
          user_uuid: userId,
          item_count: 0,
          status: 'pending'
        })
        .select('product_transaction_uuid')
        .single();

      if (error || !data) {
        console.error('Error creating transaction:', error);
        return {
          success: false,
          message: "Could not create shopping cart"
        };
      }

      transactionId = data.product_transaction_uuid;
    }

    // Check if this item is already in the cart
    const existingItem = findItemInCart(cart, product.product_uuid, selectedVariant);

    if (existingItem) {
      return {
        success: false,
        message: "Item is already in cart"
      };
    }

    // Add new item to cart with only required fields
    const itemResponse = await supabase
      .from('products_transaction_items')
      .insert({
        product_transaction_uuid: transactionId,
        product_uuid: product.product_uuid,
        variant_uuid: selectedVariant
      });

    if (itemResponse.error) {
      console.error('Error adding item to cart:', itemResponse.error);
      return {
        success: false,
        message: "Could not add item to cart"
      };
    }

    // Update the transaction item count
    const { data: currentTransaction, error: fetchError } = await supabase
      .from('products_transactions')
      .select('item_count')
      .eq('product_transaction_uuid', transactionId)
      .single();

    if (fetchError || !currentTransaction) {
      console.error('Error fetching current transaction:', fetchError);
      return {
        success: false,
        message: "Could not update cart"
      };
    }

    const newItemCount = (currentTransaction.item_count || 0) + 1;

    const updateTransactionResponse = await supabase
      .from('products_transactions')
      .update({
        item_count: newItemCount
      })
      .eq('product_transaction_uuid', transactionId);

    if (updateTransactionResponse.error) {
      console.error('Error updating transaction:', updateTransactionResponse.error);
      return {
        success: false,
        message: "Could not update cart totals"
      };
    }

    // Create cart item for return
    const cartItem: CartItem = {
      product_uuid: product.product_uuid,
      variant_uuid: selectedVariant,
      price: 0,
      quantity: 1,
      product_name: product.name || 'Unknown Product',
      variant_name: 'Selected Variant',
      is_available: true
    };

    // Construct updated cart object
    const updatedCart: CartTransaction = {
      transaction_uuid: transactionId,
      item_count: newItemCount,
      total_amount: 0,
      items: cart ? [...cart.items, cartItem] : [cartItem]
    };

    console.log('Item added successfully:', updatedCart);

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

// Remove item from cart (simplified)
export async function removeItemFromCart(
  transactionId: string,
  variantUuid: string
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log('Removing item from cart:', { transactionId, variantUuid });

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

    // Get remaining item count
    const { data: remainingItems, error: remainingError } = await supabase
      .from('products_transaction_items')
      .select('product_transaction_item_uuid')
      .eq('product_transaction_uuid', transactionId);

    if (remainingError) {
      console.error('Error fetching remaining cart items:', remainingError);
      return { success: false, message: 'Failed to update cart' };
    }

    const newItemCount = remainingItems.length;

    // Update the item count
    await supabase
      .from('products_transactions')
      .update({ item_count: newItemCount })
      .eq('product_transaction_uuid', transactionId);

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

// Cleanup function (simplified)
export async function cleanupUnavailableCartItems(transactionId: string): Promise<boolean> {
  try {
    // This function can remain as is or be simplified further if needed
    return true;
  } catch (error) {
    console.error('Failed to clean up unavailable items:', error);
    return false;
  }
}
