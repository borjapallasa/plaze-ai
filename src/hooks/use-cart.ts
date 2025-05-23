
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { CartTransaction } from '@/types/cart';
import { fetchCartData, addItemToCart, removeItemFromCart, cleanupUnavailableCartItems } from '@/services/cart-service';

export function useCart() {
  const [cart, setCart] = useState<CartTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestSessionId, setGuestSessionId] = useState<string>('');
  const { toast } = useToast();
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
  }, [guestSessionId]);

  const fetchCart = useCallback(async (userId?: string) => {
    console.log('useCart: fetchCart called with', { userId });

    const now = Date.now();
    if (now - lastFetchTime < 1000) { // Less than one second, just return null
      console.log('Skipping fetch, too soon after last fetch');
      return cart;
    }

    try {
      setIsLoading(true);
      setLastFetchTime(now);

      const cartData = await fetchCartData(userId);

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
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  }, [cart, lastFetchTime, toast]);

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
    console.log('useCart: addToCart called with', { product, selectedVariant, additionalVariants, isClassroomProduct });
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const result = await addItemToCart(
        cart,
        product,
        selectedVariant,
        userId,
        !userId ? guestSessionId : undefined,
        undefined,
        isClassroomProduct
      );

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to add item to cart",
          variant: "destructive"
        });
        setIsLoading(false);
        return null;
      }

      let updatedCart = result.updatedCart;
      const cartTransactionId = updatedCart?.transaction_uuid;

      if (additionalVariants.length > 0 && updatedCart) {
        for (const variantInfo of additionalVariants) {
          console.log('Adding additional variant:', variantInfo);
          
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
            isClassroomProduct,
            true,
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
        if (updatedCart) {
          updatedCart.last_fetched = Date.now();
          if (updatedCart.items) {
            updatedCart.items.forEach(item => {
              item.last_updated = Date.now();
            });
          }
        }
        console.log('SET CART UPDATED CART', updatedCart)
        setCart(updatedCart);
      } else {
        await fetchCart(userId);
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });

      setIsLoading(false);
      return {
        ...result,
        updatedCart
      };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  };

  const removeFromCart = async (variantUuid: string) => {
    console.log('useCart: removeFromCart called for variant', variantUuid);
    console.log('THE CART', cart)
    if (!cart || !cart.transaction_uuid) {
      toast({
        title: "Error",
        description: "No active cart found",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await removeItemFromCart(cart.transaction_uuid, variantUuid);

      if (result.success) {
        if (cart) {
          const updatedItems = cart.items.filter(item => item.variant_uuid !== variantUuid);
          const updatedItemCount = cart.item_count - 1;
          const removedItem = cart.items.find(item => item.variant_uuid === variantUuid);
          const updatedTotalAmount = removedItem
            ? cart.total_amount - (removedItem.price * removedItem.quantity)
            : cart.total_amount;

          const optimisticCart = {
            ...cart,
            items: updatedItems,
            item_count: updatedItemCount,
            total_amount: updatedTotalAmount,
            last_fetched: Date.now()
          };

          setCart(optimisticCart);
        }

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        await fetchCart(userId);

        toast({
          title: "Success",
          description: "Item removed from cart"
        });

        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove item from cart",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive"
      });
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
        setLastFetchTime(Date.now());
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

  return {
    cart,
    isLoading,
    addToCart,
    fetchCart,
    removeFromCart,
    cleanupCart
  };
}
