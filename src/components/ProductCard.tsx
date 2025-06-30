
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product_uuid: string;
  name: string;
  short_description?: string;
  thumbnail?: string;
  price_from: number;
  status: string;
  type?: string;
  expert_uuid?: string;
  user_uuid?: string;
  created_at: string;
  sales_count?: number;
  review_count?: number;
  variant_count?: number;
  slug?: string;
  expert?: {
    expert_uuid: string;
    name: string;
    thumbnail?: string;
    status: string;
  };
}

export const ProductCard = ({
  product_uuid,
  name,
  short_description,
  thumbnail,
  price_from,
  status,
  type,
  sales_count = 0,
  review_count = 0,
  variant_count = 0,
  slug,
  expert
}: ProductCardProps) => {
  const productUrl = slug ? `/product/${slug}` : `/product/${product_uuid}`;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        {type && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline">
              {type}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link to={productUrl}>
                {name}
              </Link>
            </h3>
            {short_description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {short_description}
              </p>
            )}
          </div>

          {expert && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img
                src={expert.thumbnail || "/placeholder.svg"}
                alt={expert.name}
                className="w-5 h-5 rounded-full"
              />
              <span>by {expert.name}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{review_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                <span>{sales_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{variant_count}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-primary">
              ${price_from}
            </div>
            <Button asChild size="sm">
              <Link to={productUrl}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
