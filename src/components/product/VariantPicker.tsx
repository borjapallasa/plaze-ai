
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Trophy, Tag } from "lucide-react";
import { Variant } from "./types/variants";

interface VariantPickerProps {
  variants: Variant[];
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  onAddToCart?: () => void;
  className?: string;
}

const getBadgeContent = (index: number, variant: Variant) => {
  if (index === 0) return { icon: Trophy, text: "Top Seller", color: "bg-orange-500" };
  if (variant.highlight) return { icon: Award, text: "Best Value", color: "bg-green-500" };
  if (index === 2) return { icon: Star, text: "Best Price", color: "bg-blue-500" };
  return null;
};

export function VariantPicker({
  variants,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  className = ""
}: VariantPickerProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-lg font-semibold">Choose your package</h2>
      <div className="grid gap-4">
        {variants.map((variant, index) => {
          const badge = getBadgeContent(index, variant);
          
          return (
            <Card
              key={variant.id}
              className={`p-4 cursor-pointer transition-all relative ${
                selectedVariant === variant.id
                  ? "ring-2 ring-primary"
                  : "hover:border-primary"
              }`}
              onClick={() => onVariantChange?.(variant.id)}
            >
              {badge && (
                <div className={`absolute -top-2 -left-2 ${badge.color} text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-md`}>
                  <badge.icon className="h-3 w-3" />
                  {badge.text}
                </div>
              )}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <h3 className="font-medium">{variant.name}</h3>
                  {variant.features && variant.features.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {variant.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  {variant.tags && variant.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {variant.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">€{variant.price}</div>
                  {variant.comparePrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      €{variant.comparePrice}
                    </div>
                  )}
                  {variant.highlight && (
                    <div className="text-xs text-primary font-medium mt-1">
                      Best value
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {onAddToCart && (
        <Button
          className="w-full"
          size="lg"
          onClick={onAddToCart}
          disabled={!selectedVariant}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
}
