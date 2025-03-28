import { CartItem, CartTransaction } from "@/types/cart";
import { supabase } from "@/integrations/supabase/client";

// Fetch cart data from the database or local storage
export const fetchCartData = async (userId?: string, sessionId?: string): Promise<CartTransaction | null> => {
  console.log('Fetching cart data for', { userId, sessionId });
  
  if (!userId && !sessionId) {
    console.log('No user ID or session ID provided, returning null');
    return null;
  }
  
  try {
    // In a real implementation, this would fetch from a database
    // For now, we'll simulate by checking localStorage
    
    // For logged-in users, we would fetch from the database
    if (userId) {
      // This is where you would query your database
      // For example: const { data, error } = await supabase.from('carts').select('*').eq('user_id', userId).single();
      
      // For now, we'll use localStorage as a simulation
      const storedCart = localStorage.getItem(`cart_${userId}`);
      if (storedCart) {
        return JSON.parse(storedCart);
      }
    }
    
    // For guest users, we use the session ID to retrieve from localStorage
    if (sessionId) {
      const storedCart = localStorage.getItem(`cart_guest_${sessionId}`);
      if (storedCart) {
        return JSON.parse(storedCart);
      }
    }
    
    // If no cart exists yet, return null
    return null;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    return null;
  }
};

export const addItemToCart = async (
  existingCart: CartTransaction | null,
  product: any,
  variantId: string,
  userId?: string,
  guestSessionId?: string,
  transactionId?: string,
  isClassroomProduct: boolean = false
) => {
  console.log('Starting addItemToCart for variant', variantId);
  // Validate input
  if (!variantId || (!userId && !guestSessionId)) {
    console.error('Missing required parameters for addItemToCart');
    return {
      success: false,
      message: 'Missing required parameters for adding to cart',
      updatedCart: existingCart
    };
  }

  try {
    // Find the correct variant from the product
    const selectedVariant = product.variants?.find((v: any) => v.id === variantId);
    
    if (!selectedVariant) {
      console.error('Variant not found in product:', variantId);
      return {
        success: false,
        message: 'Selected variant not found',
        updatedCart: existingCart
      };
    }

    // Determine which cart to use (create new one if none exists)
    let cartTransaction = existingCart;
    let isNewCart = false;

    if (!cartTransaction || !cartTransaction.transaction_uuid) {
      console.log('Creating new cart transaction');
      // Create a new cart transaction
      if (userId) {
        // For logged-in users, create a cart in DB
        // This is simplified for now, in production we'd create a DB entry
        cartTransaction = {
          transaction_uuid: transactionId || crypto.randomUUID(),
          item_count: 0,
          total_amount: 0,
          items: []
        };
      } else {
        // For guests, only store in memory/localStorage
        cartTransaction = {
          transaction_uuid: transactionId || crypto.randomUUID(),
          item_count: 0,
          total_amount: 0,
          items: []
        };
      }
      isNewCart = true;
    }

    // Check if the item is already in the cart
    const existingItemIndex = cartTransaction.items.findIndex(
      item => item.variant_uuid === variantId
    );

    // If item exists, increment quantity
    if (existingItemIndex !== -1) {
      console.log('Item already in cart, incrementing quantity');
      const updatedItems = [...cartTransaction.items];
      updatedItems[existingItemIndex].quantity += 1;
      
      // Update total values
      cartTransaction = {
        ...cartTransaction,
        items: updatedItems,
        item_count: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    } else {
      // Otherwise, add as new item
      console.log('Adding new item to cart');
      
      // Get the appropriate name for the product
      const productName = product.name;
      const variantName = selectedVariant.name;
      
      // Create the new cart item
      const newItem: CartItem = {
        product_uuid: product.id || null,
        variant_uuid: variantId,
        price: parseFloat(selectedVariant.price) || 0,
        quantity: 1,
        product_name: productName,
        variant_name: variantName,
        is_available: true // Assume the item is available
      };
      
      const updatedItems = [...cartTransaction.items, newItem];
      
      // Update total values
      cartTransaction = {
        ...cartTransaction,
        items: updatedItems,
        item_count: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    }

    // For this example implementation, we're just returning the updated cart
    // In a real app, you would save it to a database or local storage
    console.log('Updated cart:', cartTransaction);

    // Get the newly added/updated item to return to caller
    const cartItem = cartTransaction.items.find(item => item.variant_uuid === variantId);

    return {
      success: true,
      message: 'Item added to cart',
      updatedCart: cartTransaction,
      cartItem
    };
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return {
      success: false,
      message: 'Error adding item to cart',
      updatedCart: existingCart
    };
  }
};

export const removeItemFromCart = async (transactionId: string, variantId: string) => {
  console.log('Removing item from cart:', { transactionId, variantId });
  
  if (!transactionId || !variantId) {
    return {
      success: false,
      message: 'Missing transaction ID or variant ID'
    };
  }
  
  try {
    // In a real implementation, this would update the database
    // For now, we'll simulate by updating localStorage
    
    // First, find the cart in localStorage (this is just a simulation)
    let foundCart: CartTransaction | null = null;
    let storageKey: string | null = null;
    
    // Check for user carts
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (userId) {
      const key = `cart_${userId}`;
      const storedCart = localStorage.getItem(key);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (parsedCart.transaction_uuid === transactionId) {
          foundCart = parsedCart;
          storageKey = key;
        }
      }
    }
    
    // Check for guest carts if no user cart was found
    if (!foundCart) {
      const guestId = localStorage.getItem('guest_session_id');
      if (guestId) {
        const key = `cart_guest_${guestId}`;
        const storedCart = localStorage.getItem(key);
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (parsedCart.transaction_uuid === transactionId) {
            foundCart = parsedCart;
            storageKey = key;
          }
        }
      }
    }
    
    if (!foundCart || !storageKey) {
      return {
        success: false,
        message: 'Cart not found'
      };
    }
    
    // Remove the item from the cart
    const itemIndex = foundCart.items.findIndex(item => item.variant_uuid === variantId);
    if (itemIndex === -1) {
      return {
        success: false,
        message: 'Item not found in cart'
      };
    }
    
    // Get the item to calculate price reduction
    const removedItem = foundCart.items[itemIndex];
    const priceReduction = removedItem.price * removedItem.quantity;
    
    // Remove the item
    foundCart.items.splice(itemIndex, 1);
    
    // Update totals
    foundCart.item_count = foundCart.items.reduce((sum, item) => sum + item.quantity, 0);
    foundCart.total_amount = foundCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Save the updated cart
    localStorage.setItem(storageKey, JSON.stringify(foundCart));
    
    return {
      success: true,
      message: 'Item removed from cart'
    };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return {
      success: false,
      message: 'Error removing item from cart'
    };
  }
};

export const cleanupUnavailableCartItems = async (transactionId: string) => {
  console.log('Cleaning up unavailable items in cart:', transactionId);
  
  if (!transactionId) {
    return false;
  }
  
  try {
    // In a real implementation, this would check product availability in the database
    // and remove unavailable items from the cart
    
    // For now, we'll simulate by assuming all items are available
    // In a real app, you would check each item against your inventory
    
    return true;
  } catch (error) {
    console.error('Error cleaning up cart:', error);
    return false;
  }
};
