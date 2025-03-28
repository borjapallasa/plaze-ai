import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, ArrowRight, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface CartDrawerProps {
  cartItem: CartItem | null;
  additionalItems?: CartItem[];
  onClose: () => void;
}

export function CartDrawer({ cartItem, additionalItems = [], onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { cart, isLoading, removeFromCart, fetchCart, cleanupCart } = useCart();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const refreshCartData = async () => {
      if (!isRefreshing) {
        console.log('CartDrawer: Refreshing cart data');
        setIsRefreshing(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id;

          await fetchCart(userId);
          await cleanupCart();
        } catch (error) {
          console.error('Error refreshing cart:', error);
          toast({
            title: "Error",
            description: "Could not refresh cart data. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    refreshCartData();
  }, []);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleRemoveItem = async (variantId: string) => {
    try {
      const success = await removeFromCart(variantId);

      if (success) {
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const allAddedItems = cartItem ? [cartItem, ...additionalItems] : additionalItems;

  const defaultEmptyCart = {
    transaction_uuid: '',
    item_count: 0,
    total_amount: 0,
    items: []
  };

  const effectiveCart = cart || (allAddedItems.length > 0 ? {
    transaction_uuid: '',
    item_count: allAddedItems.length,
    total_amount: allAddedItems.reduce((sum, item) => sum + item.price, 0),
    items: allAddedItems
  } : defaultEmptyCart);

  const isCartEmpty = !effectiveCart || effectiveCart.items.length === 0;

  if (isLoading || isRefreshing) {
    return (
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full mt-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </SheetContent>
    );
  }

  if (isCartEmpty) {
    return (
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-3 pr-6">
          <SheetTitle className="text-xl">Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center justify-center h-[70vh]">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="font-medium mb-2">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </div>
      </SheetContent>
    );
  }

  const displayItems = (() => {
    const displayedItems = [...effectiveCart.items];

    if (cartItem && !displayedItems.some(item => item.variant_uuid === cartItem.variant_uuid)) {
      displayedItems.unshift(cartItem);
    }

    if (additionalItems && additionalItems.length > 0) {
      additionalItems.forEach(additionalItem => {
        if (!displayedItems.some(item => item.variant_uuid === additionalItem.variant_uuid)) {
          displayedItems.push(additionalItem);
        }
      });
    }

    return displayedItems;
  })();

  const subtotal = displayItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader className="space-y-3 pr-6">
        <SheetTitle className="text-xl">Shopping Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        {(cartItem || additionalItems.length > 0) && (
          <div className="bg-primary/5 p-3 rounded-lg mb-4">
            <p className="text-sm font-medium text-primary flex items-center">
              <span className="mr-2">✓</span> Item{additionalItems.length > 0 ? 's' : ''} added to cart
            </p>
          </div>
        )}

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {effectiveCart.items.map((item) => (
            <div
              key={item.variant_uuid}
              className="flex items-start gap-3 pb-3 border-b"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                <img
                  src="/lovable-uploads/3cfa57c2-16ef-4ec7-baa5-0f454c33a1b6.png"
                  alt={item.product_name || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">
                  {item.product_name || "Product"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{item.variant_name || "Variant"}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs">Qty: {item.quantity}</p>
                  <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveItem(item.variant_uuid)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium">${effectiveCart.total_amount.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center font-medium">
            <span>Total</span>
            <span>${effectiveCart.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleViewCart}
            className="w-full"
          >
            View Cart
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
