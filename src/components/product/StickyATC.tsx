
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <div className="flex-1 flex items-center gap-4">
          <Select value={selectedVariant} onValueChange={onVariantChange}>
            <SelectTrigger className="w-[200px]">
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
        
        <Button onClick={onAddToCart} className="flex-none">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
