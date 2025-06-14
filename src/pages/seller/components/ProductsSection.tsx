
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Loader2, MoreHorizontal, Edit, Eye, Copy, Package } from "lucide-react";

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

interface ProductsSectionProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductsSection({ products, isLoading = false }: ProductsSectionProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <span className="ml-3 text-muted-foreground">Loading products...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Only Drafts
          </Button>
          <Button variant="outline" size="sm">
            Recently Updated
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(sortedProducts.map(p => p.product_uuid));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                  />
                </th>
                <th className="w-16 p-3"></th>
                <th 
                  className="px-3 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Product
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('variant_count')}
                >
                  <div className="flex items-center">
                    Variants
                    <SortIcon field="variant_count" />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('price_from')}
                >
                  <div className="flex items-center">
                    Price
                    <SortIcon field="price_from" />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Created
                    <SortIcon field="created_at" />
                  </div>
                </th>
                <th className="w-12 p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedProducts.map((product, index) => (
                <tr 
                  key={product.product_uuid} 
                  className={`hover:bg-muted/30 transition-colors group ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedProducts.includes(product.product_uuid)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.product_uuid]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.product_uuid));
                        }
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td 
                    className="px-3 py-3 cursor-pointer"
                    onClick={() => handleProductClick(product.product_uuid)}
                  >
                    <h3 className="font-medium text-sm hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </td>
                  <td className="px-3 py-3">
                    <UIBadge 
                      variant={product.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {product.status || 'Draft'}
                    </UIBadge>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm text-muted-foreground">{product.variant_count || 0}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm font-medium">${product.price_from || '0.00'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleProductClick(product.product_uuid)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {sortedProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-2">No products found</p>
                    <p className="text-sm">
                      {searchQuery ? 'Try adjusting your search terms' : 'Create your first product to get started'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-lg px-4 py-3 shadow-lg border flex items-center gap-4 z-50">
          <span className="text-sm font-medium">
            {selectedProducts.length} products selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              Export
            </Button>
            <Button size="sm" variant="secondary">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
