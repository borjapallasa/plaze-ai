
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  description: string;
  tags: string[];
  category: string;
  product?: any;
  id?: string;
  slug?: string;
  split?: string;
}

export function ProductCard({
  title,
  price,
  image,
  seller,
  description,
  tags,
  category,
  product,
  id,
  slug
}: ProductCardProps) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    if (product?.product_type) {
      if (product.product_type === 'free' && product.files_link) {
        window.open(product.files_link, '_blank');
        return;
      } else if (product.product_type === 'paid' && product.payment_link) {
        window.open(product.payment_link, '_blank');
        return;
      }
    }
    
    // If product has id directly, or we have the id prop
    const productId = product?.product_uuid || product?.community_product_uuid || id;
    
    if (productId) {
      navigate(`/product/${productId}`);
    } else if (slug) {
      navigate(`/product/s/${slug}`);
    }
  };

  return (
    <Card
      className="group relative flex flex-col hover:bg-accent transition-colors cursor-pointer overflow-hidden h-full"
      onClick={handleProductClick}
    >
      <div className="aspect-[1.25] relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary">{category}</Badge>
        </div>
      </div>
      <CardContent className="p-6 relative flex flex-col flex-1">
        <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
        <p className="text-muted-foreground text-sm flex-1">{description}</p>
        <CardFooter className="flex items-center justify-between mt-4 p-0">
          <div>
            <div className="text-sm text-muted-foreground">Seller</div>
            <div className="font-medium">{seller}</div>
          </div>
          <div className="text-lg font-semibold">{price}</div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
