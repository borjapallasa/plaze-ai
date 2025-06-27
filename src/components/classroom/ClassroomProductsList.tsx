
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
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
    <div className={`space-y-2 ${className}`}>
      {variants.map((variant) => (
        <Card 
          key={variant.id} 
          className="group hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer border-l-4 border-l-primary/30 hover:border-l-primary/60 bg-gradient-to-r from-background to-muted/20" 
          onClick={() => handleProductClick(variant.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Sparkles className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                    <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                      {variant.name}
                    </h4>
                  </div>
                  <Badge 
                    variant={variant.price === 0 ? "secondary" : "default"} 
                    className="text-xs px-2.5 py-1 flex-shrink-0 font-medium shadow-sm"
                  >
                    {variant.price === 0 ? "FREE" : `$${variant.price}`}
                  </Badge>
                </div>
                
                {variant.features && variant.features.length > 0 && (
                  <p className="text-xs text-muted-foreground truncate pl-5 leading-relaxed">
                    {variant.features[0]}
                    {variant.features.length > 1 && (
                      <span className="font-medium text-primary/70"> +{variant.features.length - 1} more</span>
                    )}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                {variant.filesLink && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(variant.filesLink, '_blank');
                    }}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
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
  );
}
