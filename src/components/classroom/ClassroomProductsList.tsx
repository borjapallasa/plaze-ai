
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Variant } from "@/components/product/types/variants";
import { ClassroomProductSelector } from "./ClassroomProductSelector";
import { DeleteClassroomProductDialog } from "./DeleteClassroomProductDialog";

interface ClassroomProductsListProps {
  variants?: Variant[];
  className?: string;
  isOwner?: boolean;
  classroomId?: string;
  communityUuid?: string;
}

export function ClassroomProductsList({ 
  variants = [], 
  className = "",
  isOwner = false,
  classroomId,
  communityUuid
}: ClassroomProductsListProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const handleProductClick = (productId: string) => {
    window.open(`/community/product/${productId}`, '_blank');
  };

  const handleDeleteClick = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteProductId(productId);
  };

  const excludedProductIds = variants.map(variant => variant.id);

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Products in this class</h3>
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelectorOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!variants || variants.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No products available in this classroom yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => (
            <Card key={variant.id} className="hover:shadow-sm transition-shadow cursor-pointer border-l-4 border-l-primary/20" onClick={() => handleProductClick(variant.id)}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{variant.name}</h4>
                      <Badge variant={variant.price === 0 ? "secondary" : "default"} className="text-xs px-2 py-0.5 flex-shrink-0">
                        {variant.price === 0 ? "FREE" : `$${variant.price}`}
                      </Badge>
                    </div>
                    
                    {variant.features && variant.features.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        {variant.features[0]}
                        {variant.features.length > 1 && ` +${variant.features.length - 1} more`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {variant.filesLink && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(variant.filesLink, '_blank');
                        }}
                        className="h-8 w-8 p-0"
                        title="View Files"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(variant.id, e)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Remove from classroom"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(variant.id);
                      }}
                      className="h-8 w-8 p-0"
                      title="View Details"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isOwner && classroomId && communityUuid && (
        <>
          <ClassroomProductSelector
            open={isSelectorOpen}
            onOpenChange={setIsSelectorOpen}
            classroomId={classroomId}
            communityUuid={communityUuid}
            excludedProductIds={excludedProductIds}
          />
          
          <DeleteClassroomProductDialog
            open={!!deleteProductId}
            onOpenChange={(open) => !open && setDeleteProductId(null)}
            productId={deleteProductId}
            classroomId={classroomId}
            onSuccess={() => {
              setDeleteProductId(null);
              // The parent component will handle the refresh via query invalidation
            }}
          />
        </>
      )}
    </div>
  );
}
