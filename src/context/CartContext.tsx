
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    selectedVariant: string
  ) => Promise<any>;
  fetchCart: (userId?: string) => Promise<CartTransaction | null>;
  removeFromCart: (variantUuid: string) => Promise<boolean>;
  cleanupCart: () => Promise<boolean>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      await fetchCart(session?.user?.id);
      setIsLoading(false);
    };

    initializeCart();
  }, []);

  const fetchCart = useCallback(async (userId?: string) => {
    console.log('CartContext: fetchCart called with', { userId });

    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      console.log('Skipping fetch, too soon after last fetch');
      return cart;
    }

    try {
      setIsLoading(true);
      setLastFetchTime(now);

      const cartData = await fetchCartData(userId);
      console.log('CartContext: fetchCart received data', cartData);

      if (cartData) {
        cartData.last_fetched = Date.now();
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
    selectedVariant: string
  ) => {
    console.log('CartContext: addToCart called with', { product, selectedVariant });
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        toast.error("Please sign in to add items to cart");
        setIsLoading(false);
        return null;
      }

      const result = await addItemToCart(
        cart,
        product,
        selectedVariant,
        userId
      );

      if (!result.success) {
        toast.error(result.message || "Failed to add item to cart");
        setIsLoading(false);
        return null;
      }

      if (result.updatedCart) {
        result.updatedCart.last_fetched = Date.now();
        setCart(result.updatedCart);
      } else {
        await fetchCart(userId);
      }

      toast.success(`${product.name} has been added to your cart.`);

      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error("Failed to add item to cart. Please try again.");
      setIsLoading(false);
      return null;
    }
  };

  const removeFromCart = async (variantUuid: string) => {
    console.log('CartContext: removeFromCart called for variant', variantUuid);
    
    if (!cart || !cart.transaction_uuid) {
      toast.error("No active cart found");
      return false;
    }

    setIsLoading(true);
    try {
      // Optimistically update the cart
      const updatedItems = cart.items.filter(item => item.variant_uuid !== variantUuid);
      const updatedItemCount = cart.item_count - 1;

      const optimisticCart = {
        ...cart,
        items: updatedItems,
        item_count: updatedItemCount,
        last_fetched: Date.now()
      };
      
      setCart(optimisticCart);

      const result = await removeItemFromCart(cart.transaction_uuid, variantUuid);

      if (result.success) {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        setTimeout(async () => {
          await fetchCart(userId);
        }, 500);

        toast.success("Item removed from cart");
        setIsLoading(false);
        return true;
      } else {
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
