
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface CartData {
  items: any[];
  totalItems: number;
  transaction?: any;
}

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartData = { items: [], totalItems: 0 }, isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: async (): Promise<CartData> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { items: [], totalItems: 0 };
      }

      // Get the user's active cart (products_transactions)
      const { data: transactions, error: transactionError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('user_uuid', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (transactionError) {
        console.error('Error fetching cart:', transactionError);
        throw transactionError;
      }

      if (!transactions || transactions.length === 0) {
        return { items: [], totalItems: 0 };
      }

      const transaction = transactions[0];

      // Get cart items
      const { data: items, error: itemsError } = await supabase
        .from('products_transaction_items')
        .select(`
          *,
          products:product_uuid (
            name,
            thumbnail
          ),
          variants:variant_uuid (
            name,
            price,
            compare_price
          )
        `)
        .eq('product_transaction_uuid', transaction.product_transaction_uuid);

      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        throw itemsError;
      }

      return {
        items: items || [],
        totalItems: transaction.item_count || 0,
        transaction
      };
    },
    enabled: true
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productUuid, variantUuid }: { productUuid: string, variantUuid: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get or create cart transaction
      let { data: transactions, error: transactionError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('user_uuid', user.id)
        .eq('status', 'pending')
        .limit(1);

      if (transactionError) {
        throw transactionError;
      }

      let transaction = transactions?.[0];

      if (!transaction) {
        // Create new cart transaction
        const { data: newTransaction, error: createError } = await supabase
          .from('products_transactions')
          .insert({
            user_uuid: user.id,
            item_count: 0,
            status: 'pending'
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        transaction = newTransaction;
      }

      // Add item to cart
      const { error: itemError } = await supabase
        .from('products_transaction_items')
        .insert({
          product_transaction_uuid: transaction.product_transaction_uuid,
          product_uuid: productUuid,
          variant_uuid: variantUuid
        });

      if (itemError) {
        throw itemError;
      }

      // Update item count
      const { error: updateError } = await supabase
        .from('products_transactions')
        .update({
          item_count: (transaction.item_count || 0) + 1
        })
        .eq('product_transaction_uuid', transaction.product_transaction_uuid);

      if (updateError) {
        throw updateError;
      }

      return transaction;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item added to cart successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Remove the item
      const { error: removeError } = await supabase
        .from('products_transaction_items')
        .delete()
        .eq('product_transaction_item_uuid', itemId);

      if (removeError) {
        throw removeError;
      }

      // Update item count in transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('products_transactions')
        .select('*')
        .eq('user_uuid', user.id)
        .eq('status', 'pending')
        .single();

      if (transactionError) {
        throw transactionError;
      }

      const { error: updateError } = await supabase
        .from('products_transactions')
        .update({
          item_count: Math.max(0, (transaction.item_count || 0) - 1)
        })
        .eq('product_transaction_uuid', transaction.product_transaction_uuid);

      if (updateError) {
        throw updateError;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item removed from cart"
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  });

  const addToCart = async (productUuid: string, variantUuid: string) => {
    await addToCartMutation.mutateAsync({ productUuid, variantUuid });
  };

  const removeFromCart = async (itemId: string) => {
    await removeFromCartMutation.mutateAsync(itemId);
  };

  return {
    cartData,
    isLoading,
    addToCart,
    removeFromCart,
    refetch
  };
}
