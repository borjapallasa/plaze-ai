import { supabase } from '@/integrations/supabase/client';
import { CartItem, CartTransaction } from '@/types/cart';

// Fetch cart data by user or guest session ID
export async function fetchCartData(userId?: string, sessionId?: string): Promise<CartTransaction | null> {
  try {
    if (!userId) {
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
        .select('product_transaction_item_uuid, product_uuid, variant_uuid, price, quantity, total_price, product_type')
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
      let availableProducts = new Set<string>();
      let availableVariants = new Set<string>();

      // Only fetch product names if we have product UUIDs
      if (productUuids.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('product_uuid, name')
          .in('product_uuid', productUuids);

        if (productsData) {
          productsData.forEach((product: any) => {
            productNames[product.product_uuid] = product.name;
            availableProducts.add(product.product_uuid);
          });
        }
      }

      // Check if variants exist in standard variants table
      if (variantUuids.length > 0) {
        const { data: variantsData } = await supabase
          .from('variants')
          .select('variant_uuid, name')
          .in('variant_uuid', variantUuids);

        if (variantsData) {
          variantsData.forEach((variant: any) => {
            variantNames[variant.variant_uuid] = variant.name;
            availableVariants.add(variant.variant_uuid);
          });
        }
      }

      // Check if any variants are community products
      if (variantUuids.length > 0) {
        const { data: communityProductsData } = await supabase
          .from('community_products')
          .select('community_product_uuid, name')
          .in('community_product_uuid', variantUuids);

        if (communityProductsData) {
          communityProductsData.forEach((product: any) => {
            variantNames[product.community_product_uuid] = product.name;
            availableVariants.add(product.community_product_uuid);
          });
        }
      }

      // Map the items with their names and availability status
      const items: CartItem[] = itemsData.map((item: any) => {
        // Check if this is a community product (where variant_uuid matches community_product_uuid)
        const isClassroomProduct = item.product_type === 'community';
        const isDefaultVariant = item.product_type === 'default';

        // For default variants, we use the product name as variant name
        let productName = item.product_uuid ? (productNames[item.product_uuid] || 'Unknown Product') : 'Classroom Product';
        let variantName = isDefaultVariant
          ? 'Default Option'
          : (variantNames[item.variant_uuid] || 'Unknown Variant');

        // Always assume the item is available if it's in the cart
        // Only mark it unavailable if specifically needed
        const isAvailable = true;

        return {
          product_uuid: item.product_uuid,
          variant_uuid: item.variant_uuid,
          price: item.price,
          quantity: item.quantity,
          product_name: isClassroomProduct ? 'Classroom Product' : productName,
          variant_name: variantName,
          is_available: isAvailable
        };
      });

      const cartData = {
        transaction_uuid: transactionData[0].product_transaction_uuid,
        item_count: transactionData[0].item_count,
        total_amount: transactionData[0].total_amount,
        items
      }
      console.log('Returning cart data: ', cartData)
      return cartData;
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
  existingTransactionId?: string,
  isClassroomProduct: boolean = false,
  isAdditionalVariant: boolean = false,
  overridePrice?: number,
  isDefaultVariant: boolean = false
): Promise<{ success: boolean; message?: string; updatedCart?: CartTransaction; cartItem?: CartItem; payment_link?: string }> {
  try {
    console.log('Adding to cart', {
      cart,
      selectedVariant,
      transaction: existingTransactionId,
      isClassroomProduct,
      isAdditionalVariant,
      overridePrice,
      isDefaultVariant
    });

    let variantData;
    let productUuid;
    let productName;
    let price;
    let paymentLink;
    console.log('isClassroomProduct:', isClassroomProduct);
    if (isClassroomProduct) {
      // For classroom products, we need to fetch from community_products
      const { data, error } = await supabase
        .from('community_products')
        .select('*')
        .eq('community_product_uuid', selectedVariant)
        .single();

      if (error || !data) {
        console.error('Error fetching classroom product:', error);
        return {
          success: false,
          message: "Could not find the selected classroom product"
        };
      }

      variantData = data;
      productUuid = data.community_product_uuid; // Use the community product UUID as the product UUID
      productName = data.name;
      price = data.price;
      paymentLink = data.payment_link || null;
    } else if (isDefaultVariant) {
      // For default variants (products with no variants)
      const productId = selectedVariant.replace('default-', '');

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', productId)
        .single();

      if (error || !data) {
        console.error('Error fetching product for default variant:', error);
        return {
          success: false,
          message: "Could not find the selected product"
        };
      }

      variantData = {
        name: 'Default Option',
        price: overridePrice || data.price_from || 0
      };
      productUuid = data.product_uuid;
      productName = data.name;
      price = overridePrice || data.price_from || 0;

      console.log('Default variant data:', { variantData, productUuid, productName, price });
    } else {
      // Regular product variants
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

      variantData = variantResponse.data;
      price = overridePrice !== undefined ? overridePrice : variantData.price;

      // For additional variants, use the product UUID that was passed
      if (isAdditionalVariant && product.product_uuid) {
        productUuid = product.product_uuid;

        // Fetch the actual product name for this product UUID
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('name')
          .eq('product_uuid', productUuid)
          .single();

        if (!productError && productData) {
          productName = productData.name;
        } else {
          productName = product.name || 'Unknown Product';
        }
      } else {
        productUuid = product.product_uuid;
        productName = product.name || 'Unknown Product';
      }
    }

    // Check for existing transaction
    let transactionId = existingTransactionId || cart?.transaction_uuid;
    let payment_link;

    if (!transactionId) {
      console.log('Creating NEW transaction for variant: ', selectedVariant);
      // Create a new transaction
      const newTransaction = {
        payment_link: isClassroomProduct ? paymentLink : null,
        user_uuid: userId,
        item_count: 0,
        total_amount: price,
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

    // For classroom products, get payment_link immediately after inserting transaction
    if (isClassroomProduct) {
      const { data: transactionData, error: transactionError } = await supabase
        .from('products_transactions')
        .select('payment_link')
        .eq('product_transaction_uuid', transactionId)
        .single();

      if (!transactionError && transactionData && transactionData.payment_link) {
        payment_link = transactionData.payment_link;
      }
    }

    // Check if this item is already in the cart
    const existingItem = isClassroomProduct
      ? (cart?.items || []).find(item =>
        item.variant_uuid === selectedVariant &&
        (item.product_uuid === productUuid || item.product_uuid === selectedVariant)
      )
      : (cart?.items || []).find(item =>
        item.product_uuid === productUuid &&
        item.variant_uuid === selectedVariant
      );

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
        .eq(isClassroomProduct ? 'variant_uuid' : 'product_uuid', isClassroomProduct ? selectedVariant : productUuid)
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
        quantity: existingItem.quantity + 1,
        product_name: productName || existingItem.product_name
      };

    } else {
      // Add new item to cart
      console.log('Inserting new cart item:', {
        transaction_uuid: transactionId,
        product_uuid: isClassroomProduct ? null : productUuid,
        variant_uuid: selectedVariant,
        price: price,
        quantity: 1,
        total_price: price,
        product_type: isClassroomProduct ? 'community' : (isDefaultVariant ? 'default' : 'regular')
      });

      const itemResponse = await supabase
        .from('products_transaction_items')
        .insert({
          product_transaction_uuid: transactionId,
          product_uuid: isClassroomProduct ? null : productUuid,
          variant_uuid: selectedVariant,
          price: price,
          quantity: 1,
          total_price: price,
          product_type: isClassroomProduct ? 'community' : (isDefaultVariant ? 'default' : 'regular')
        });

      if (itemResponse.error) {
        console.error('Error adding item to cart:', itemResponse.error);
        return {
          success: false,
          message: "Could not add item to cart"
        };
      }

      cartItem = {
        product_uuid: isClassroomProduct ? null : productUuid,
        variant_uuid: selectedVariant,
        price: price,
        quantity: 1,
        product_name: productName || (isClassroomProduct ? variantData.name : (product.name || 'Unknown Product')),
        variant_name: variantData.name || 'Unknown Variant',
        is_available: true
      };
    }

    // Get the current values of the transaction
    const { data: currentTransaction, error: fetchError } = await supabase
      .from('products_transactions')
      .select('item_count, total_amount, payment_link')
      .eq('product_transaction_uuid', transactionId)
      .single();

    if (fetchError || !currentTransaction) {
      console.error('Error fetching current transaction:', fetchError);
      return {
        success: true,
        message: "Item added but couldn't update totals",
        cartItem,
        payment_link
      };
    }

    // If we didn't get the payment link earlier, get it now
    if (!payment_link && currentTransaction.payment_link) {
      payment_link = currentTransaction.payment_link;
      console.log('Payment link:', payment_link);
      console.log('currentTransaction:', currentTransaction);
    }

    // Update the transaction totals
    const newItemCount = (currentTransaction.item_count || 0) + 1;
    const newTotalAmount = (currentTransaction.total_amount || 0) + price;

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
      .select('product_uuid, variant_uuid, price, quantity, product_type')
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
        item.product_uuid === productUuid && item.variant_uuid === selectedVariant
      );
      if (itemIndex !== -1) {
        updatedCart.items[itemIndex] = cartItem;
      }
    } else {
      updatedCart.items.push(cartItem);
    }

    console.log('UPDATED CART:', updatedCart);
    console.log('PAYMENT LINK (if classroom product):', payment_link);

    return {
      success: true,
      message: "Item added to cart successfully",
      updatedCart,
      cartItem,
      payment_link
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

    const { data: remainingItems, error: remainingError } = await supabase
      .from('products_transaction_items')
      .select('total_price')
      .eq('product_transaction_uuid', transactionId);

    if (remainingError) {
      console.error('Error fetching remaining cart items:', remainingError);
      return { success: false, message: 'Failed to update cart total' };
    }

    // Sum up the remaining total price
    const newTotalAmount = remainingItems.reduce((sum, item) => sum + item.total_price, 0);
    const newItemCount = remainingItems.length;

    // Update the total amount
    await supabase
      .from('products_transactions')
      .update({ total_amount: newTotalAmount, item_count: newItemCount })
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

// New function to clean up unavailable items from cart
export async function cleanupUnavailableCartItems(transactionId: string): Promise<boolean> {
  try {
    // Get all cart items that have either null product_uuid or variant_uuid
    const { data: unavailableItems, error: queryError } = await supabase
      .from('products_transaction_items')
      .select('product_transaction_item_uuid, variant_uuid, quantity, total_price')
      .eq('product_transaction_uuid', transactionId)
      .or('product_uuid.is.null,variant_uuid.is.null');

    if (queryError) {
      console.error('Error finding unavailable items:', queryError);
      return false;
    }

    if (!unavailableItems || unavailableItems.length === 0) {
      // No unavailable items to clean up
      return true;
    }

    // Calculate totals to adjust
    const itemCount = unavailableItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = unavailableItems.reduce((sum, item) => sum + item.total_price, 0);

    // Delete unavailable items
    const { error: deleteError } = await supabase
      .from('products_transaction_items')
      .delete()
      .in('product_transaction_item_uuid', unavailableItems.map(item => item.product_transaction_item_uuid));

    if (deleteError) {
      console.error('Error deleting unavailable items:', deleteError);
      return false;
    }

    // Update transaction totals
    const { data: transaction, error: transactionError } = await supabase
      .from('products_transactions')
      .select('item_count, total_amount')
      .eq('product_transaction_uuid', transactionId)
      .single();

    if (transactionError) {
      console.error('Error fetching transaction:', transactionError);
      return false;
    }

    const newItemCount = Math.max(0, (transaction.item_count || 0) - itemCount);
    const newTotalAmount = Math.max(0, (transaction.total_amount || 0) - totalPrice);

    const { error: updateError } = await supabase
      .from('products_transactions')
      .update({
        item_count: newItemCount,
        total_amount: newTotalAmount
      })
      .eq('product_transaction_uuid', transactionId);

    if (updateError) {
      console.error('Error updating transaction totals:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to clean up unavailable items:', error);
    return false;
  }
}
