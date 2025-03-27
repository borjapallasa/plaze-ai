import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { CartTransaction } from '@/types/cart';
import { fetchCartData, addItemToCart, removeItemFromCart } from '@/services/cart-service';

export function useCart() {
  const [cart, setCart] = useState<CartTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestSessionId, setGuestSessionId] = useState<string>('');
  const { toast } = useToast();

  // Initialize cart on component mount
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);

      // Check for user session
      const { data: { session } } = await supabase.auth.getSession();

      // Check for existing guest session in localStorage if not logged in
      if (!session) {
        let sessionId = localStorage.getItem('guest_session_id');
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem('guest_session_id', sessionId);
        }
        setGuestSessionId(sessionId);
      }

      // Try to fetch existing cart
      await fetchCart(session?.user?.id, !session ? guestSessionId : undefined);

      setIsLoading(false);
    };

    initializeCart();
  }, [guestSessionId]);

  // Fetch the cart from the database
  const fetchCart = async (userId?: string, sessionId?: string) => {
    try {
      const cartData = await fetchCartData(userId, sessionId);
      setCart(cartData);
      return cartData;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Add an item to cart
  const addToCart = async (product: any, selectedVariant: string, additionalVariants: string[] = []) => {
    setIsLoading(true);
    try {
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // First add the primary product
      const result = await addItemToCart(
        cart,
        product,
        selectedVariant,
        userId,
        !userId ? guestSessionId : undefined
      );

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to add item to cart",
          variant: "destructive"
        });
        return null;
      }

      let updatedCart = result.updatedCart;
      const cartTransactionId = updatedCart?.transaction_uuid;

      // If there are additional variants, add them to the same transaction
      if (additionalVariants.length > 0 && updatedCart) {
        for (const variantId of additionalVariants) {
          const additionalResult = await addItemToCart(
            updatedCart,
            product,
            variantId,
            userId,
            !userId ? guestSessionId : undefined,
            cartTransactionId // Pass the transaction ID to ensure items are added to the same cart
          );
          
          if (additionalResult.success && additionalResult.updatedCart) {
            updatedCart = additionalResult.updatedCart;
          }
        }
      }

      // Set the updated cart
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        // Refetch cart if updated cart wasn't returned
        await fetchCart(userId, !userId ? guestSessionId : undefined);
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });

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
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove an item from cart
  const removeFromCart = async (variantUuid: string) => {
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
        // Refetch the cart to update the UI
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        const guestId = !userId ? localStorage.getItem('guest_session_id') : undefined;
        
        await fetchCart(userId, !userId ? guestId || undefined : undefined);
        
        toast({
          title: "Success",
          description: "Item removed from cart"
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove item from cart",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cart,
    isLoading,
    addToCart,
    fetchCart,
    removeFromCart
  };
}
