
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VariantCard } from "./VariantCard";
import { EditVariantDialog } from "../admin/template/EditVariantDialog";
import { Variant, ProductVariantsEditorProps } from "./types/variants";

export function ProductVariants({
  variants,
  onVariantsChange,
  onAddVariant,
}: ProductVariantsEditorProps) {
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant);
    setShowEditDialog(true);
  };

  const handleSaveVariant = (variantId: string, updatedData: Partial<Variant>) => {
    const updatedVariants = variants.map(variant => 
      variant.id === variantId 
        ? { 
            ...variant, 
            ...updatedData,
            // Remove the 'hidden' property if it exists
            hidden: undefined
          } 
        : variant
    );
    onVariantsChange(updatedVariants);
    setShowEditDialog(false);
    setEditingVariant(null);
  };

  const handleDeleteVariant = (variantId: string) => {
    const updatedVariants = variants.filter(variant => variant.id !== variantId);
    onVariantsChange(updatedVariants);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Product Variants</CardTitle>
          <Button onClick={onAddVariant} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                onEdit={() => handleEditVariant(variant)}
                onDelete={() => handleDeleteVariant(variant.id)}
              />
            ))}
            {variants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No variants yet. Add your first variant to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <EditVariantDialog
        variant={editingVariant}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingVariant(null);
        }}
        onSave={handleSaveVariant}
      />
    </>
  );
}
