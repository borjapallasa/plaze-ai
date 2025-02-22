
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductPricing } from "@/components/product/ProductPricing";
import { VariantCard } from "./VariantCard";
import { Variant, ProductVariantsEditorProps } from "./types/variants";

export function ProductVariantsEditor({ 
  variants: externalVariants,
  onVariantsChange,
  className = ""
}: ProductVariantsEditorProps) {
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

  const variants = externalVariants || internalVariants;
  const setVariants = (newVariants: Variant[]) => {
    if (onVariantsChange) {
      onVariantsChange(newVariants);
    } else {
      setInternalVariants(newVariants);
    }
  };

  const addVariant = () => {
    if (variants.length === 1) {
      const priceInput = document.getElementById('price') as HTMLInputElement;
      const comparePriceInput = document.getElementById('compare-price') as HTMLInputElement;
      
      const price = priceInput?.value || '';
      const comparePrice = comparePriceInput?.value || '';
      
      const updatedFirstVariant = {
        ...variants[0],
        price,
        comparePrice,
      };
      
      setVariants([
        updatedFirstVariant,
        {
          id: Math.random().toString(),
          name: "",
          price: "0",
          comparePrice: "0",
          highlight: false,
          tags: [],
        },
      ]);
    } else {
      setVariants([
        ...variants,
        {
          id: Math.random().toString(),
          name: "",
          price: "0",
          comparePrice: "0",
          highlight: false,
          tags: [],
        },
      ]);
    }
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof Variant, value: any) => {
    if (field === 'highlight' && value === true) {
      setVariants(
        variants.map((v) =>
          v.id === id ? { ...v, highlight: true } : { ...v, highlight: false }
        )
      );
    } else {
      setVariants(
        variants.map((v) =>
          v.id === id ? { ...v, [field]: value } : v
        )
      );
    }
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
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Variants</h2>
        <Button onClick={addVariant} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add variant
        </Button>
      </div>

      <div className="space-y-4">
        {variants.map((variant) => (
          <div key={variant.id}>
            {(variants.length > 1 || variant.name || variant.highlight || (variant.tags && variant.tags.length > 0)) && (
              <VariantCard
                variant={variant}
                showRemove={variants.length > 1}
                onRemove={removeVariant}
                onUpdate={updateVariant}
                onAddTag={addTag}
                onRemoveTag={removeTag}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Export both components with appropriate types
export const ProductVariants = VariantPicker;
