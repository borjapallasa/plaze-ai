
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CartItem {
  id: string;
  product_uuid: string;
  variant_uuid: string;
  product_name: string;
  variant_name: string;
}

export interface CartData {
  transaction_uuid: string;
  items: CartItem[];
  item_count: number;
}

export function useCart() {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCartData(null);
        return;
      }

      const { data: transaction, error: transactionError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('user_uuid', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (transactionError) throw transactionError;

      if (!transaction) {
        setCartData(null);
        return;
      }

      const { data: items, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products!inner(name),
          variants!inner(name)
        `)
        .eq('transaction_uuid', transaction.transaction_uuid);

      if (itemsError) throw itemsError;

      const cartItems: CartItem[] = items?.map(item => ({
        id: item.id.toString(),
        product_uuid: item.product_uuid,
        variant_uuid: item.variant_uuid,
        product_name: item.products?.name || 'Unknown Product',
        variant_name: item.variants?.name || 'Unknown Variant'
      })) || [];

      setCartData({
        transaction_uuid: transaction.transaction_uuid,
        items: cartItems,
        item_count: cartItems.length
      });

    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cart data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addToCart = useCallback(async (productUuid: string, variantUuid: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to add items to cart",
          variant: "destructive"
        });
        return;
      }

      // Get or create pending transaction
      let { data: transaction, error: transactionError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('user_uuid', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (transactionError) throw transactionError;

      if (!transaction) {
        const { data: newTransaction, error: createError } = await supabase
          .from('products_transactions')
          .insert({
            user_uuid: user.id,
            item_count: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        transaction = newTransaction;
      }

      // Add item to cart
      const { error: insertError } = await supabase
        .from('products_transaction_items')
        .insert({
          transaction_uuid: transaction.transaction_uuid,
          product_uuid: productUuid,
          variant_uuid: variantUuid
        });

      if (insertError) throw insertError;

      // Update item count
      const { data: items } = await supabase
        .from('products_transaction_items')
        .select('id')
        .eq('transaction_uuid', transaction.transaction_uuid);

      const itemCount = items?.length || 0;

      await supabase
        .from('products_transactions')
        .update({ item_count: itemCount })
        .eq('transaction_uuid', transaction.transaction_uuid);

      toast({
        title: "Success",
        description: "Item added to cart",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      // Refresh cart data
      fetchCart();

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  }, [toast, fetchCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('products_transaction_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item removed from cart",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      // Refresh cart data
      fetchCart();

    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  }, [toast, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartData,
    isLoading,
    addToCart,
    removeFromCart,
    refetch: fetchCart
  };
}
