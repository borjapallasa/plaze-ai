
import React, { useState } from "react";
import { useUserProducts } from "@/hooks/seller/useUserProducts";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  product_uuid: string;
  name: string;
  price_from: number;
  thumbnail?: string;
  status: string;
  created_at: string;
}

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
  selectedProduct: Product | null;
}

export function ProductSelector({ onSelect, selectedProduct }: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, isLoading, error } = useUserProducts();

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          Loading your products...
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Error loading products. Please try again.</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No products found.</p>
        <p className="text-sm">Create some products first to use them as templates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Select a product to use as template</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredProducts.map((product) => (
          <Card
            key={product.product_uuid}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedProduct?.product_uuid === product.product_uuid
                ? "ring-2 ring-primary bg-accent"
                : ""
            }`}
            onClick={() => onSelect(product)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      From ${product.price_from}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-4 text-muted-foreground">
          <p>No products found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
