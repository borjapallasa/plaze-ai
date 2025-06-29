
import React, { useState } from "react";
import { useUserProducts } from "@/hooks/seller/useUserProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductsTabProps {
  seller: any;
  mode?: 'seller' | 'admin';
}

export function ProductsTab({ seller, mode = 'seller' }: ProductsTabProps) {
  const navigate = useNavigate();
  const { products, isLoading, error } = useUserProducts(seller.expert_uuid);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load products</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Products ({products?.length || 0})</h2>
        {mode === 'seller' && (
          <Button onClick={() => navigate('/seller/products/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No products found</p>
          {mode === 'seller' && (
            <Button onClick={() => navigate('/seller/products/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.product_uuid} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Created {new Date(product.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {product.description || "No description available"}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-600">
                    ${product.price_from?.toFixed(2) || "0.00"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/product/${product.product_uuid}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {mode === 'seller' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/product/${product.product_uuid}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
