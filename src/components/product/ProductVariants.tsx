
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VariantCard } from "./VariantCard";
import { Variant, ProductVariantsEditorProps } from "./types/variants";
import { VariantPicker } from "./VariantPicker";

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
      createdAt: new Date().toISOString(),
      filesLink: "",
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
    setVariants([
      ...variants,
      {
        id: `temp_${Date.now()}`,
        name: "",
        price: "0",
        comparePrice: "0",
        highlight: false,
        tags: [],
        createdAt: new Date().toISOString(),
        filesLink: "",
      },
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 1) {
      return;
    }
    
    // Mark the variant as hidden instead of removing it immediately
    setVariants(
      variants.map(v => 
        v.id === id 
          ? { ...v, hidden: true }
          : v
      ).filter(v => !v.hidden)
    );
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
      <div className="space-y-3">
        {variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            showRemove={variants.length > 1}
            onRemove={removeVariant}
            onUpdate={updateVariant}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        ))}
      </div>

      <Button
        onClick={addVariant}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Variant
      </Button>
    </div>
  );
}

// Export both components with appropriate types
export const ProductVariants = VariantPicker;
