
import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface CartDrawerTriggerProps {
  className?: string;
}

export function CartDrawerTrigger({ className }: CartDrawerTriggerProps) {
  const { cart, isLoading, fetchCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState(null);

  // Ensure cart is updated when the icon is clicked
  const handleOpenDrawer = async () => {
    if (!isOpen) {
      // Refresh cart data when opening the drawer
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        const guestId = !userId ? localStorage.getItem('guest_session_id') : undefined;
        
        await fetchCart(userId, !userId ? guestId || undefined : undefined);
      } catch (error) {
        console.error('Failed to refresh cart on drawer open:', error);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      handleOpenDrawer();
    } else {
      // Reset the current cart item when closing
      setCurrentCartItem(null);
    }
  };

  const itemCount = cart?.item_count || 0;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={className}
          aria-label="Shopping cart"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold rounded-full"
              >
                {itemCount}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>
      <CartDrawer 
        cartItem={currentCartItem} 
        onClose={() => setIsOpen(false)} 
      />
    </Sheet>
  );
}
