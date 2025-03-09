
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

type SortField = 'name' | 'status' | 'variant_count' | 'price_from' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface Product {
  product_uuid: string;
  name: string;
  status: string;
  variant_count: number;
  price_from: number;
  created_at: string;
  thumbnail: string;
}

interface ProductsTabProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductsTab({ products, isLoading = false }: ProductsTabProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  const sortedProducts = [...products].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return direction * (a.name || '').localeCompare(b.name || '');
      case 'status':
        return direction * (a.status || '').localeCompare(b.status || '');
      case 'variant_count':
        return direction * ((a.variant_count || 0) - (b.variant_count || 0));
      case 'price_from':
        return direction * ((a.price_from || 0) - (b.price_from || 0));
      case 'created_at':
        return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
          />
        </div>
        <Button asChild className="sm:w-auto">
          <Link to="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            <span className="ml-3 text-muted-foreground">Loading products...</span>
          </div>
        ) : (
          <ScrollArea className="w-full relative" type="always">
            <div className="w-[calc(100vw-4rem)] sm:w-full min-w-[800px]">
              <div className="rounded-lg border border-border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="w-[72px] sticky left-0 bg-muted/50"></th>
                      <th 
                        className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('name')}
                      >
                        <span className="flex items-center">
                          Product
                          <SortIcon field="name" />
                        </span>
                      </th>
                      <th 
                        className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('status')}
                      >
                        <span className="flex items-center">
                          Status
                          <SortIcon field="status" />
                        </span>
                      </th>
                      <th 
                        className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('variant_count')}
                      >
                        <span className="flex items-center">
                          Variants
                          <SortIcon field="variant_count" />
                        </span>
                      </th>
                      <th 
                        className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('price_from')}
                      >
                        <span className="flex items-center">
                          Price
                          <SortIcon field="price_from" />
                        </span>
                      </th>
                      <th 
                        className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('created_at')}
                      >
                        <span className="flex items-center">
                          Created
                          <SortIcon field="created_at" />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedProducts.map((product) => (
                      <tr 
                        key={product.product_uuid} 
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleProductClick(product.product_uuid)}
                      >
                        <td className="p-3 sticky left-0 bg-background">
                          <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                            {product.thumbnail && (
                              <img 
                                src={product.thumbnail} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <h3 className="font-medium text-sm">{product.name}</h3>
                        </td>
                        <td className="px-4 py-3">
                          <UIBadge 
                            variant={product.status === 'active' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {product.status || 'Draft'}
                          </UIBadge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">{product.variant_count || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">${product.price_from || '0.00'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            {new Date(product.created_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
