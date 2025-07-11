
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
  const [deleteRelationshipUuid, setDeleteRelationshipUuid] = useState<string | null>(null);

  const handleProductClick = (productId: string) => {
    window.open(`/community/product/${productId}`, '_blank');
  };

  const handleDeleteClick = (variant: Variant, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete clicked for variant:", variant);
    console.log("Community product relationship UUID from variant:", variant.community_product_relationship_uuid);
    
    if (!variant.community_product_relationship_uuid) {
      console.error("No community_product_relationship_uuid found for variant:", variant);
      console.error("Full variant object:", JSON.stringify(variant, null, 2));
      return;
    }
    
    // Use the community_product_relationship_uuid for deletion
    setDeleteRelationshipUuid(variant.community_product_relationship_uuid);
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
        <h3 className="font-semibold text-lg">Products in this class</h3>
        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelectorOpen(true)}
            className="h-8 w-8 p-0 rounded-md border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!variants || variants.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50/30">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No products yet</h4>
            <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed">
              This classroom doesn't have any products yet. {isOwner ? "Add your first product to get started." : "Check back later for new content."}
            </p>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectorOpen(true)}
                className="mt-6 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => (
            <Card key={variant.id} className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary/40" onClick={() => handleProductClick(variant.id)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-base truncate">{variant.name}</h4>
                      <Badge variant={variant.price === 0 ? "secondary" : "default"} className="text-xs px-2.5 py-0.5 flex-shrink-0 font-medium">
                        {variant.price === 0 ? "FREE" : `$${variant.price}`}
                      </Badge>
                    </div>
                    
                    {variant.features && variant.features.length > 0 && (
                      <p className="text-sm text-muted-foreground truncate leading-relaxed">
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
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                        title="View Files"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteClick(variant, e)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
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
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
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
