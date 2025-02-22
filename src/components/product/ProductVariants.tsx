
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductPricing } from "@/components/product/ProductPricing";

interface Variant {
  id: string;
  name?: string;
  price: string | number;
  comparePrice: string | number;
  highlight?: boolean;
  tags?: string[];
  label?: string;
  features?: string[];
}

interface ProductVariantsProps {
  variants?: Variant[];
  onVariantsChange?: (variants: Variant[]) => void;
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  onAddToCart?: () => void;
  className?: string;
}

export function ProductVariants({ 
  variants: externalVariants,
  onVariantsChange,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  className = ""
}: ProductVariantsProps) {
  const [internalVariants, setInternalVariants] = React.useState<Variant[]>([
    {
      id: "1",
      name: "",
      price: "",
      comparePrice: "",
      highlight: false,
      tags: [],
    },
  ]);

  // Use either external variants (if provided) or internal state
  const variants = externalVariants || internalVariants;
  const setVariants = (newVariants: Variant[]) => {
    if (onVariantsChange) {
      onVariantsChange(newVariants);
    } else {
      setInternalVariants(newVariants);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Math.random().toString(),
        name: "",
        price: "",
        comparePrice: "",
        highlight: false,
        tags: [],
      },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    setVariants(
      variants.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const addTag = (variantId: string, tag: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, tags: [...(v.tags || []), tag].slice(0, 2) }
          : v
      )
    );
  };

  const removeTag = (variantId: string, tagToRemove: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, tags: (v.tags || []).filter((tag) => tag !== tagToRemove) }
          : v
      )
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {variants.length === 1 && <ProductPricing />}
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Variants</h2>
        <Button onClick={addVariant} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add variant
        </Button>
      </div>

      {variants.map((variant) => (
        <Card key={variant.id} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-end">
              {variants.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(variant.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor={`name-${variant.id}`}>Variant Name</Label>
              <Input
                id={`name-${variant.id}`}
                placeholder="Enter variant name"
                value={variant.name}
                onChange={(e) =>
                  updateVariant(variant.id, "name", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`price-${variant.id}`}>Price</Label>
                <Input
                  id={`price-${variant.id}`}
                  type="number"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(variant.id, "price", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`compare-price-${variant.id}`}>Compare Price</Label>
                <Input
                  id={`compare-price-${variant.id}`}
                  type="number"
                  placeholder="0.00"
                  value={variant.comparePrice}
                  onChange={(e) =>
                    updateVariant(variant.id, "comparePrice", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`highlight-${variant.id}`}
                checked={variant.highlight || false}
                onCheckedChange={(checked) =>
                  updateVariant(variant.id, "highlight", checked)
                }
              />
              <Label htmlFor={`highlight-${variant.id}`}>Highlight this variant</Label>
            </div>

            <div>
              <Label>Tags (max 2)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(variant.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(variant.id, tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                ))}
                {(!variant.tags || variant.tags.length < 2) && (
                  <Input
                    className="w-32"
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        if (input.value) {
                          addTag(variant.id, input.value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
