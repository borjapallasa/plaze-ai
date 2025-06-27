
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ExternalLink } from "lucide-react";
import { Variant } from "@/components/product/types/variants";

interface ClassroomProductsListProps {
  variants?: Variant[];
  className?: string;
}

export function ClassroomProductsList({ 
  variants = [], 
  className = "" 
}: ClassroomProductsListProps) {
  if (!variants || variants.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No products available in this classroom yet.</p>
      </div>
    );
  }

  const handleProductClick = (productId: string) => {
    window.open(`/community/product/${productId}`, '_blank');
  };

  return (
    <div className={`space-y-2 ${className}`}>
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
  );
}
