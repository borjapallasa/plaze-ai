
import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "@/types/cart";

interface CartDrawerProps {
  cartItem: CartItem | null;
  onClose: () => void;
}

export function CartDrawer({ cartItem, onClose }: CartDrawerProps) {
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate("/cart");
    onClose();
  };

  if (!cartItem) return null;

  return (
    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader className="space-y-3 pr-6">
        <SheetTitle className="text-xl">Added to Cart</SheetTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent flex-shrink-0">
            <img
              src="/lovable-uploads/3cfa57c2-16ef-4ec7-baa5-0f454c33a1b6.png"
              alt={cartItem.product_name || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{cartItem.product_name || "Product"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{cartItem.variant_name || "Variant"}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm">Quantity: {cartItem.quantity}</p>
              <p className="font-medium">${cartItem.price * cartItem.quantity}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
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
