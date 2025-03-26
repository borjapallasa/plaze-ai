
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CommunityProduct } from "@/types/Product";

interface ProductCardProps {
  product: CommunityProduct;
  href?: string;
  className?: string;
}

export function ProductCard({ product, href, className }: ProductCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (product.community_product_uuid) {
      navigate(`/product/${product.community_product_uuid}`);
    }
  };

  return (
    <Card 
      className={`group relative flex flex-col p-4 lg:p-6 hover:bg-accent transition-colors cursor-pointer ${className || ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-accent flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src="/placeholder.svg"
            alt={product.name || 'Product'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight truncate">{product.name || 'Product'}</h3>
          <Badge 
            variant="secondary" 
            className="font-medium capitalize bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs mt-1.5"
          >
            {product.product_type || 'Package'}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mt-auto mb-4">
        <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-sm">
          #{product.product_type || 'product'}
        </span>
      </div>

      <div className="border-t border-border mt-auto pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">From ${product.price}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
