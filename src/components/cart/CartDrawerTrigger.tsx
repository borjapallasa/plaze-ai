
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

interface CartDrawerTriggerProps {
  className?: string;
}

export function CartDrawerTrigger({ className }: CartDrawerTriggerProps) {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
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
