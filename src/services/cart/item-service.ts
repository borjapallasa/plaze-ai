
import { supabase } from '@/integrations/supabase/client';
import { CartItem, CartTransaction } from '@/types/cart';
import { CartOperationResult } from './types';

/**
 * Find existing item in cart
 */
export function findItemInCart(cart: CartTransaction | null, productUuid: string, variantUuid: string): CartItem | undefined {
  if (!cart) return undefined;
  return cart.items.find(item =>
    item.product_uuid === productUuid && item.variant_uuid === variantUuid
  );
}

/**
 * Add item to cart
 */
export async function addItemToCart(
  cart: CartTransaction | null,
  product: any,
  selectedVariant: string,
  userId?: string,
  guestSessionId?: string
): Promise<CartOperationResult> {
  try {
    console.log('Adding to cart', cart, selectedVariant);
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
      const newTransaction = {
        user_uuid: userId,
        item_count: 1,
        total_amount: variantData.price,
        type: userId ? 'user' : 'guest' as 'user' | 'guest', // Cast to union type to fix type error
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
    
    // Construct updated cart object instead of refetching
    const updatedCart: CartTransaction = {
      transaction_uuid: transactionId,
      item_count: newItemCount,
      total_amount: newTotalAmount,
      items: cart ? [...cart.items] : []
    };
    
    // Update or add item in the items array
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
