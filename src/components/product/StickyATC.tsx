import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShoppingCart } from "lucide-react";
import { PurchaseProtection } from "./PurchaseProtection";

interface Variant {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  label: string;
  highlight?: boolean;
  features: string[];
}

interface StickyATCProps {
  variants: Variant[];
  selectedVariant: string;
  onVariantChange: (value: string) => void;
  visible: boolean;
  onAddToCart?: () => void;
  isLoading?: boolean;
}

export function StickyATC({ 
  variants, 
  selectedVariant, 
  onVariantChange, 
  visible,
  onAddToCart,
  isLoading = false
}: StickyATCProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsExiting(false);
      setShouldRender(true);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  const currentVariant = variants.find(v => v.id === selectedVariant);

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg py-3 px-4 z-50 ${isExiting ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-4">
            <Select value={selectedVariant} onValueChange={onVariantChange} disabled={isLoading}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-lg font-bold">
              ${currentVariant?.price}
            </div>
          </div>
          
          <Button 
            onClick={onAddToCart} 
            className="flex-none" 
            size="lg" 
            disabled={isLoading || !selectedVariant}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Purchase Protection overlay when sticky ATC is visible */}
      <div className={`fixed bottom-20 left-0 right-0 px-4 z-40 ${isExiting ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <div className="container mx-auto">
          <PurchaseProtection />
        </div>
      </div>
    </>
  );
}
