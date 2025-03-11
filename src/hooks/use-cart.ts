
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

// Types for cart functionality
interface CartItem {
  product_uuid: string;
  variant_uuid: string;
  price: number;
  quantity: number;
  product_name?: string;
  variant_name?: string;
}

interface CartTransaction {
  transaction_uuid: string;
  item_count: number;
  total_amount: number;
  items: CartItem[];
}

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
      let query = supabase
        .from('products_transactions')
        .select(`
          product_transaction_uuid,
          item_count,
          total_amount,
          products_transaction_items(
            product_uuid,
            variant_uuid,
            price,
            quantity,
            total_price,
            products(name),
            variants(name)
          )
        `)
        .eq('status', 'pending');
      
      if (userId) {
        query = query.eq('user_uuid', userId);
      } else if (sessionId) {
        query = query.eq('guest_session_id', sessionId);
      } else {
        // No way to identify the cart
        setCart(null);
        return;
      }

      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error('Error fetching cart:', error);
        return;
      }
      
      if (data) {
        const items = data.products_transaction_items.map((item: any) => ({
          product_uuid: item.product_uuid,
          variant_uuid: item.variant_uuid,
          price: item.price,
          quantity: item.quantity,
          product_name: item.products?.name,
          variant_name: item.variants?.name
        }));

        setCart({
          transaction_uuid: data.product_transaction_uuid,
          item_count: data.item_count,
          total_amount: data.total_amount,
          items
        });
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Add an item to cart
  const addToCart = async (product: any, selectedVariant: string) => {
    try {
      setIsLoading(true);
      
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Find the variant details
      const { data: variantData, error: variantError } = await supabase
        .from('variants')
        .select('*')
        .eq('variant_uuid', selectedVariant)
        .single();
      
      if (variantError || !variantData) {
        toast({
          title: "Error",
          description: "Could not find the selected variant",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Check for existing transaction
      let transactionId;
      
      if (cart) {
        transactionId = cart.transaction_uuid;
      } else {
        // Create a new transaction
        const { data: newTransaction, error: transactionError } = await supabase
          .from('products_transactions')
          .insert({
            user_uuid: userId,
            guest_session_id: !userId ? guestSessionId : null,
            item_count: 1,
            total_amount: variantData.price,
            type: userId ? 'user' : 'guest',
            status: 'pending'
          })
          .select('product_transaction_uuid')
          .single();
        
        if (transactionError || !newTransaction) {
          toast({
            title: "Error",
            description: "Could not create shopping cart",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        transactionId = newTransaction.product_transaction_uuid;
      }
      
      // Check if this item is already in the cart
      let existingItem = null;
      if (cart) {
        existingItem = cart.items.find(item => 
          item.product_uuid === product.product_uuid && item.variant_uuid === selectedVariant
        );
      }
      
      if (existingItem) {
        // Update the quantity of existing item
        const { error: updateError } = await supabase
          .from('products_transaction_items')
          .update({
            quantity: existingItem.quantity + 1,
            total_price: (existingItem.quantity + 1) * existingItem.price
          })
          .eq('product_uuid', product.product_uuid)
          .eq('variant_uuid', selectedVariant)
          .eq('product_transaction_uuid', transactionId);
        
        if (updateError) {
          toast({
            title: "Error",
            description: "Could not update item quantity",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      } else {
        // Add new item to cart
        const { error: itemError } = await supabase
          .from('products_transaction_items')
          .insert({
            product_transaction_uuid: transactionId,
            product_uuid: product.product_uuid,
            variant_uuid: selectedVariant,
            price: variantData.price,
            quantity: 1,
            total_price: variantData.price
          });
        
        if (itemError) {
          toast({
            title: "Error",
            description: "Could not add item to cart",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Update the transaction totals
      const newTotalAmount = (cart?.total_amount || 0) + variantData.price;
      const newItemCount = (cart?.item_count || 0) + 1;
      
      const { error: updateTransactionError } = await supabase
        .from('products_transactions')
        .update({
          item_count: newItemCount,
          total_amount: newTotalAmount
        })
        .eq('product_transaction_uuid', transactionId);
      
      if (updateTransactionError) {
        toast({
          title: "Error",
          description: "Could not update cart totals",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Refetch the cart to update the state
      await fetchCart(userId, !userId ? guestSessionId : undefined);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
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
