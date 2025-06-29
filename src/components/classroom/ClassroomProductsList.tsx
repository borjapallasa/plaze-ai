
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ExternalLink, Plus, Trash2, ShoppingBag } from "lucide-react";
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
  const [deleteRelationshipUuid, setDeleteRelationshipUuid] = useState<string | null>(null);

  const handleProductClick = (productId: string) => {
    window.open(`/community/product/${productId}`, '_blank');
  };

  const handleDeleteClick = (variant: Variant, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete clicked for variant:", variant);
    console.log("Relationship UUID from variant:", variant.relationshipUuid);
    
    if (!variant.relationshipUuid) {
      console.error("No relationship UUID found for variant:", variant);
      console.error("Full variant object:", JSON.stringify(variant, null, 2));
      return;
    }
    
    setDeleteRelationshipUuid(variant.relationshipUuid);
  };

  const excludedProductIds = variants.map(variant => variant.id);

  // Don't render if classroomId is not available
  if (!classroomId) {
    console.error("ClassroomId is missing");
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Products in this class</h3>
            <p className="text-sm text-muted-foreground">
              {variants.length} product{variants.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelectorOpen(true)}
            className="h-9 px-3 border-dashed border-primary/30 text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Products
          </Button>
        )}
      </div>

      {!variants || variants.length === 0 ? (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h4 className="text-lg font-medium text-muted-foreground mb-2">No products yet</h4>
            <p className="text-sm text-muted-foreground/80 text-center max-w-sm leading-relaxed">
              {isOwner 
                ? "Start building your classroom by adding products that students can access and purchase."
                : "The instructor hasn't added any products to this classroom yet."
              }
            </p>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectorOpen(true)}
                className="mt-4 border-dashed border-primary/30 text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {variants.map((variant, index) => (
            <Card 
              key={variant.id} 
              className="group hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary/40"
              onClick={() => handleProductClick(variant.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-base truncate text-foreground">
                          {variant.name}
                        </h4>
                        <Badge 
                          variant={variant.price === 0 ? "secondary" : "default"} 
                          className="text-xs px-2.5 py-1 flex-shrink-0 font-medium"
                        >
                          {variant.price === 0 ? "FREE" : `$${variant.price}`}
                        </Badge>
                      </div>
                      
                      {variant.features && variant.features.length > 0 && (
                        <p className="text-sm text-muted-foreground truncate leading-relaxed">
                          {variant.features[0]}
                          {variant.features.length > 1 && (
                            <span className="text-primary ml-1">
                              +{variant.features.length - 1} more feature{variant.features.length > 2 ? 's' : ''}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
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
                        className="h-9 w-9 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="View Files"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(variant, e)}
                        className="h-9 w-9 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                        title="Remove from classroom"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(variant.id);
                      }}
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 group-hover:text-primary"
                      title="View Details"
                    >
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isOwner && communityUuid && (
        <ClassroomProductSelector
          open={isSelectorOpen}
          onOpenChange={setIsSelectorOpen}
          classroomId={classroomId}
          communityUuid={communityUuid}
          excludedProductIds={excludedProductIds}
        />
      )}
      
      <DeleteClassroomProductDialog
        open={!!deleteRelationshipUuid}
        onOpenChange={(open) => !open && setDeleteRelationshipUuid(null)}
        relationshipUuid={deleteRelationshipUuid}
        onSuccess={() => {
          setDeleteRelationshipUuid(null);
          // The parent component will handle the refresh via query invalidation
        }}
      />
    </div>
  );
}
