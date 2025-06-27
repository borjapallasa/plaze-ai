
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ExternalLink } from "lucide-react";
import { Variant } from "@/components/product/types/variants";
import { useNavigate } from "react-router-dom";

interface ClassroomProductsListProps {
  variants?: Variant[];
  className?: string;
}

export function ClassroomProductsList({ 
  variants = [], 
  className = "" 
}: ClassroomProductsListProps) {
  const navigate = useNavigate();

  if (!variants || variants.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No products available in this classroom yet.</p>
      </div>
    );
  }

  const handleProductClick = (productId: string) => {
    navigate(`/community/product/${productId}`);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {variants.map((variant) => (
        <Card key={variant.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleProductClick(variant.id)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{variant.name}</h4>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="font-medium">
                    ${variant.price}
                  </Badge>
                  {variant.comparePrice > 0 && variant.comparePrice !== variant.price && (
                    <Badge variant="outline" className="line-through text-muted-foreground">
                      ${variant.comparePrice}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {variant.label || 'Package'}
                  </Badge>
                </div>

                {variant.features && variant.features.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                    {variant.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                    {variant.features.length > 3 && (
                      <li className="text-xs text-muted-foreground/70">
                        +{variant.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(variant.id);
                  }}
                  className="min-w-[120px]"
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                
                {variant.filesLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(variant.filesLink, '_blank');
                    }}
                    className="min-w-[120px]"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Files
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
