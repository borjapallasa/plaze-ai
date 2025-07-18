
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { CartTransaction, CartItem } from '@/types/cart';
import { 
  fetchCartData, 
  addItemToCart, 
  removeItemFromCart, 
  cleanupUnavailableCartItems 
} from '@/services/cart-service';

type CartContextType = {
  cart: CartTransaction | null;
  isLoading: boolean;
  addToCart: (
    product: any,
    selectedVariant: string,
    additionalVariants?: Array<{ 
      variantId: string, 
      productUuid: string | null, 
      variantName?: string,
      productName?: string,
      price?: number,
      isDefaultVariant?: boolean
    }>,
    isClassroomProduct?: boolean
  ) => Promise<any>;
  fetchCart: (userId?: string) => Promise<CartTransaction | null>;
  removeFromCart: (variantUuid: string) => Promise<boolean>;
  cleanupCart: () => Promise<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestSessionId, setGuestSessionId] = useState<string>('');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem('guest_session_id', sessionId);
        }
        setGuestSessionId(sessionId);
      }

      await fetchCart(session?.user?.id);

      setIsLoading(false);
    };

    initializeCart();
  }, []);

  const fetchCart = useCallback(async (userId?: string) => {
    console.log('CartContext: fetchCart called with', { userId });

    const now = Date.now();
    if (now - lastFetchTime < 1000) { // Less than one second, just return null
      console.log('Skipping fetch, too soon after last fetch');
      return cart;
    }

    try {
      setIsLoading(true);
      setLastFetchTime(now);

      // Only fetch regular products for the cart display (exclude classroom products)
      const cartData = await fetchCartData(userId, undefined, false);
      console.log('CartContext: fetchCart received data', cartData);

      if (cartData && cartData.transaction_uuid) {
        if (cartData) {
          cartData.last_fetched = Date.now();
        }

        setCart(cartData);
        setIsLoading(false);
        return cartData;
      }

      setCart(cartData);
      setIsLoading(false);
      return cartData;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error("Failed to load your cart. Please try again.");
      setIsLoading(false);
      return null;
    }
  }, [cart, lastFetchTime]);

  const addToCart = async (
    product: any,
    selectedVariant: string,
    additionalVariants: Array<{ 
      variantId: string, 
      productUuid: string | null, 
      variantName?: string,
      productName?: string,
      price?: number,
      isDefaultVariant?: boolean
    }> = [],
    isClassroomProduct: boolean = false
  ) => {
    console.log('CartContext: addToCart called with', { product, selectedVariant, additionalVariants, isClassroomProduct });
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // For classroom products, bypass the regular cart flow entirely
      if (isClassroomProduct) {
        // Determine if the main selectedVariant is a default variant
        const isMainDefaultVariant = selectedVariant.startsWith('default-');
        
        // Call addItemToCart with minimal parameters for classroom products
        const result = await addItemToCart(
          null, // Don't use/update the current cart for classroom products
          product,
          selectedVariant,
          userId,
          !userId ? guestSessionId : undefined,
          undefined,
          isClassroomProduct,
          false, 
          undefined,
          isMainDefaultVariant
        );

        setIsLoading(false);
        return result; // Return the result with payment_link
      }

      // Standard cart flow for regular products
      // Determine if the main selectedVariant is a default variant
      const isMainDefaultVariant = selectedVariant.startsWith('default-');

      const result = await addItemToCart(
        cart,
        product,
        selectedVariant,
        userId,
        !userId ? guestSessionId : undefined,
        undefined,
        false, // not a classroom product
        false, // not an additional variant
        undefined, // no override price for main variant
        isMainDefaultVariant // Pass whether this is a default variant
      );

      if (!result.success) {
        toast.error(result.message || "Failed to add item to cart");
        setIsLoading(false);
        return null;
      }
      
      // Continue with regular cart flow for non-classroom products
      let updatedCart = result.updatedCart;
      const cartTransactionId = updatedCart?.transaction_uuid;

      if (additionalVariants.length > 0 && updatedCart) {
        for (const variantInfo of additionalVariants) {
          console.log('Adding additional variant to cart:', variantInfo);
          
          const additionalResult = await addItemToCart(
            updatedCart,
            { 
              product_uuid: variantInfo.productUuid || null, 
              name: variantInfo.productName || product.name 
            },
            variantInfo.variantId,
            userId,
            !userId ? guestSessionId : undefined,
            cartTransactionId,
            false, // not a classroom product
            true, // is additional variant
            variantInfo.price,
            variantInfo.isDefaultVariant
          );

          if (additionalResult.success && additionalResult.updatedCart) {
            updatedCart = additionalResult.updatedCart;
          } else {
            console.error('Failed to add additional variant:', additionalResult.message);
          }
        }
      }

      if (updatedCart) {
        updatedCart.last_fetched = Date.now();
        if (updatedCart.items) {
          updatedCart.items.forEach(item => {
            item.last_updated = Date.now();
          });
        }
        // Filter out any classroom products from the cart that we show to the user
        updatedCart.items = updatedCart.items.filter(item => item.product_type !== 'community');
        
        // Recalculate totals based on filtered items
        updatedCart.item_count = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
        updatedCart.total_amount = updatedCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        console.log('CartContext: Setting updated cart', updatedCart);
        setCart(updatedCart);
      } else {
        await fetchCart(userId);
      }

      toast.success(`${product.name} has been added to your cart.`);

      setIsLoading(false);
      return {
        ...result,
        updatedCart
      };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error("Failed to add item to cart. Please try again.");
      setIsLoading(false);
      return null;
    }
  };

  const removeFromCart = async (variantUuid: string) => {
    console.log('CartContext: removeFromCart called for variant', variantUuid);
    console.log('Current cart state:', cart);
    
    if (!cart || !cart.transaction_uuid) {
      toast.error("No active cart found");
      return false;
    }

    setIsLoading(true);
    try {
      // First update the local cart state optimistically
      const updatedItems = cart.items.filter(item => item.variant_uuid !== variantUuid);
      const updatedItemCount = cart.item_count - 1;
      const removedItem = cart.items.find(item => item.variant_uuid === variantUuid);
      const updatedTotalAmount = removedItem
        ? cart.total_amount - (removedItem.price * removedItem.quantity)
        : cart.total_amount;

      // Immediately update the state optimistically for a responsive UI
      const optimisticCart = {
        ...cart,
        items: updatedItems,
        item_count: updatedItemCount,
        total_amount: updatedTotalAmount,
        last_fetched: Date.now()
      };
      
      setCart(optimisticCart);

      // Then call the API to actually remove the item
      const result = await removeItemFromCart(cart.transaction_uuid, variantUuid);

      if (result.success) {
        // If the API call succeeds, the state is already updated
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        // Refresh cart data after a short delay to ensure backend has processed the removal
        setTimeout(async () => {
          await fetchCart(userId);
        }, 500);

        toast.success("Item removed from cart");

        setIsLoading(false);
        return true;
      } else {
        // If the API call fails, revert to the previous state
        setCart(cart);
        
        toast.error(result.message || "Failed to remove item from cart");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error("Failed to remove item from cart. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  const cleanupCart = async () => {
    if (!cart || !cart.transaction_uuid) {
      return false;
    }

    setIsLoading(true);
    try {
      const success = await cleanupUnavailableCartItems(cart.transaction_uuid);

      if (success) {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        await fetchCart(userId);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Failed to clean up cart:', error);
      setIsLoading(false);
      return false;
    }
  };

  const value = {
    cart,
    isLoading,
    addToCart,
    fetchCart,
    removeFromCart,
    cleanupCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
