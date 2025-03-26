
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
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
      // @ts-ignore
      const { data: transactionData, error: transactionError } = await supabase
        .from('products_transactions')
        .select('product_transaction_uuid, item_count, total_amount, status, payment_link, user_uuid')
        .eq('user_uuid', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }) // Sort by latest
        .limit(1) as any;

      // Check for errors or no data
      if (transactionError) {
        return null;
      }

      if (!transactionData || transactionData.length == 0) {
        return null;
      }

      // @ts-ignore
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
        transaction_uuid: transactionData.product_transaction_uuid,
        item_count: transactionData.item_count,
        total_amount: transactionData.total_amount,
        items
      };
    } else {
      console.error('No user ID found')
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
  guestSessionId?: string
): Promise<{ success: boolean; message?: string; updatedCart?: CartTransaction; cartItem?: CartItem }> {
  try {
    console.log('Adding to cart', cart, selectedVariant)
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
      // Create a new transaction - Fix type to be "guest" or "user" explicitly
      const newTransaction = {
        user_uuid: userId,
        // user_uuid: userId || null, // null allowed if guest carts work
        item_count: 1,
        total_amount: variantData.price,
        type: userId ? 'user' as const : 'guest' as const, // Fix: Use type assertion to specify literal type
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('products_transactions')
        .insert(newTransaction)
        .select('product_transaction_uuid')
        .single();

      console.log('Create TX: ', newTransaction, error)

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
      // @ts-ignore
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
    
    // Fetch the updated cart
    const updatedCart = await fetchCartData(userId, !userId ? guestSessionId : undefined);
    
    return {
      success: true,
      message: "Item added to cart successfully",
      updatedCart: updatedCart || undefined,
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
