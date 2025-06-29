
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ExternalLink, Plus, Trash2, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter variants based on search term
  const filteredVariants = variants.filter(variant =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const excludedProductIds = variants.map(variant => variant.id);

  // Don't render if classroomId is not available
  if (!classroomId) {
    console.error("ClassroomId is missing");
    return null;
  }

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

      {variants.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      {!variants || variants.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No products available in this classroom yet.</p>
        </div>
      ) : filteredVariants.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No products found matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredVariants.map((variant) => (
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
                        onClick={(e) => handleDeleteClick(variant, e)}
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
