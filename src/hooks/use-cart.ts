
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { CartTransaction, CartItem } from '@/types/cart';
import { fetchCartData, addItemToCart } from '@/services/cart-service';

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
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add an item to cart
  const addToCart = async (product: any, selectedVariant: string) => {
    setIsLoading(true);
    try {
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      const result = await addItemToCart(
        cart, 
        product, 
        selectedVariant, 
        userId, 
        !userId ? guestSessionId : undefined
      );
      
      if (result.success) {
        if (result.updatedCart) {
          setCart(result.updatedCart);
        } else {
          // Refetch cart if updated cart wasn't returned
          await fetchCart(userId, !userId ? guestSessionId : undefined);
        }
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`
        });
        
        return result;
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add item to cart",
          variant: "destructive"
        });
        return null;
      }
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

  return {
    cart,
    isLoading,
    addToCart,
    fetchCart
  };
}
