
import React from "react";
import { Card } from "@/components/ui/card";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";

interface ProductMediaSectionProps {
  productUuid: string | undefined;
}

export function ProductMediaSection({ productUuid }: ProductMediaSectionProps) {
  if (!productUuid) return null;
  
  return (
    <Card className="p-3 sm:p-6">
      <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
      <ProductMediaUpload productUuid={productUuid} />
    </Card>
  );
}
