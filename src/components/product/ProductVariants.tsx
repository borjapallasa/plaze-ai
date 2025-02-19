
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, ShoppingCart, Star } from "lucide-react";
import React from "react";

interface Variant {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  label: string;
  highlight?: boolean;
  features: string[];
}

interface ProductVariantsProps {
  variants: Variant[];
  selectedVariant: string;
  onVariantChange: (value: string) => void;
  className?: string;
  onAddToCart?: () => void;
}

export function ProductVariants({ 
  variants, 
  selectedVariant, 
  onVariantChange,
  className,
  onAddToCart 
}: ProductVariantsProps) {
  const currentVariant = variants.find(v => v.id === selectedVariant);
  
  return (
    <div className={className}>
      <RadioGroup 
        value={selectedVariant} 
        onValueChange={onVariantChange}
        className="space-y-4"
      >
        {variants.map((variant) => (
          <div 
            key={variant.id} 
            className={`relative rounded-lg p-4 transition-all ${
              variant.id === selectedVariant
                ? 'border-2 border-primary shadow-lg' 
                : 'border border-border'
            }`}
          >
            <Badge 
              variant={variant.id === selectedVariant ? "default" : "secondary"}
              className="absolute -top-2 left-4 z-10"
            >
              {variant.label}
            </Badge>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RadioGroupItem value={variant.id} id={variant.id} />
                <h3 className="text-base font-semibold">{variant.name}</h3>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">${variant.price}</span>
                <span className="text-xs text-muted-foreground line-through">
                  ${variant.comparePrice}
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
              {variant.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="space-y-4 mt-4">
        <Button className="w-full" onClick={onAddToCart}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <Button variant="outline" className="w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Seller
        </Button>
      </div>
    </div>
  );
}
