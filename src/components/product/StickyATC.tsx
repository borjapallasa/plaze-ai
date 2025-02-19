
import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart } from "lucide-react";

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
}

export function StickyATC({ 
  variants, 
  selectedVariant, 
  onVariantChange, 
  visible,
  onAddToCart 
}: StickyATCProps) {
  if (!visible) return null;

  const currentVariant = variants.find(v => v.id === selectedVariant);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 transition-transform transform z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Desktop variant selector */}
        <div className="flex-1 hidden sm:block">
          <RadioGroup 
            value={selectedVariant} 
            onValueChange={onVariantChange}
            className="flex gap-4"
          >
            {variants.map((variant) => (
              <div 
                key={variant.id} 
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                  variant.id === selectedVariant ? 'bg-accent' : ''
                }`}
                onClick={() => onVariantChange(variant.id)}
              >
                <RadioGroupItem value={variant.id} id={`sticky-${variant.id}`} />
                <label 
                  htmlFor={`sticky-${variant.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {variant.name} - ${variant.price}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Mobile and desktop layout for price and button */}
        <div className="flex-1 sm:flex-initial flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial">
            <div className="text-sm font-semibold">{currentVariant?.name}</div>
            <div className="text-lg font-bold">${currentVariant?.price}</div>
          </div>
          <Button onClick={onAddToCart} className="flex-1 sm:flex-initial">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
