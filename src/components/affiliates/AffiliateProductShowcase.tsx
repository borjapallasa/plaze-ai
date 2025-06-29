
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllAffiliateProducts } from "@/hooks/use-affiliate-products";
import { DollarSign, TrendingUp } from "lucide-react";

export function AffiliateProductShowcase() {
  const { data: affiliateProducts = [], isLoading } = useAllAffiliateProducts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Affiliate Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Affiliate Products</CardTitle>
      </CardHeader>
      <CardContent>
        {affiliateProducts.length > 0 ? (
          <div className="grid gap-4">
            {affiliateProducts.map((product) => (
              <div key={product.affiliate_products_uuid} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.product_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {product.product_description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          ${product.product_price_from}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {Math.round(product.affiliate_share * 100)}% Commission
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          by {product.expert_name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {product.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No affiliate products available at the moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
