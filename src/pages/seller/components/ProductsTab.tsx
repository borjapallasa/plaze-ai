
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Loader2, Plus, Package, Table, LayoutGrid, MoreHorizontal } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";

interface Product {
  product_uuid: string;
  name: string;
  status: string;
  variant_count: number;
  price_from: number;
  created_at: string;
  thumbnail: string;
  description?: string;
}

interface ProductsTabProps {
  products: Product[];
  isLoading?: boolean;
  showLayoutSelector?: boolean; // New prop to control layout selector visibility
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
type LayoutOption = 'cards' | 'table';

export function ProductsTab({ products, isLoading = false, showLayoutSelector = false }: ProductsTabProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [layout, setLayout] = useState<LayoutOption>('cards');

  // Get current user's expert_uuid - using case insensitive email comparison
  const { data: expertData } = useQuery({
    queryKey: ['current-user-expert', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .ilike('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching expert:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.email,
  });

  const isCurrentUserSeller = expertData?.expert_uuid === id;

  const handleProductClick = (productId: string) => {
    if (isCurrentUserSeller) {
      navigate(`/product/${productId}/edit`);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleCreateProduct = () => {
    navigate('/seller/products/new');
  };

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    // First filter by search query
    let filtered = products.filter(product =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then sort based on selected option
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'price-asc':
          return (a.price_from || 0) - (b.price_from || 0);
        case 'price-desc':
          return (b.price_from || 0) - (a.price_from || 0);
        default:
          return 0;
      }
    });
  }, [products, searchQuery, sortBy]);

  // Show search and sorting only if there are products
  const hasProducts = products && products.length > 0;

  const ProductTableView = () => (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="text-left p-4 font-medium">Product</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Price</th>
            <th className="text-left p-4 font-medium">Variants</th>
            <th className="text-left p-4 font-medium">Created</th>
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedProducts.map((product, index) => (
            <tr 
              key={product.product_uuid} 
              className={`border-b hover:bg-muted/25 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {product.thumbnail ? (
                      <img 
                        src={product.thumbnail} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : product.status === 'draft' 
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.status}
                </span>
              </td>
              <td className="p-4 font-medium">
                ${product.price_from || '0.00'}
              </td>
              <td className="p-4 text-muted-foreground">
                {product.variant_count || 0}
              </td>
              <td className="p-4 text-muted-foreground">
                {new Date(product.created_at).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/product/${product.product_uuid}`)}
                    >
                      View Public Page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleProductClick(product.product_uuid)}
                    >
                      {isCurrentUserSeller ? 'Edit Product' : 'View Product'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 mt-6">
      {hasProducts && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            {showLayoutSelector && (
              <ToggleGroup
                type="single"
                value={layout}
                onValueChange={(value: LayoutOption) => {
                  if (value) setLayout(value);
                }}
                className="inline-flex items-center gap-1"
              >
                <ToggleGroupItem
                  value="cards"
                  aria-label="Card view"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#E5E7EB] data-[state=on]:bg-[#1A1F2C] data-[state=on]:text-white data-[state=on]:border-[#1A1F2C] hover:bg-gray-50"
                >
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="table"
                  aria-label="Table view"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#E5E7EB] data-[state=on]:bg-[#1A1F2C] data-[state=on]:text-white data-[state=on]:border-[#1A1F2C] hover:bg-gray-50"
                >
                  <Table className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            )}

            {isCurrentUserSeller && (
              <Button onClick={handleCreateProduct} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Product
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Show Create Product button even when no products if user is seller */}
      {!hasProducts && isCurrentUserSeller && (
        <div className="flex justify-end">
          <Button onClick={handleCreateProduct} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Product
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <span className="ml-3 text-muted-foreground">Loading products...</span>
        </div>
      ) : (
        <div>
          {filteredAndSortedProducts.length === 0 ? (
            <Card className="border-dashed border-2 border-muted-foreground/30">
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {searchQuery ? "No products found" : "No products yet"}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-sm">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}". Try a different search term or clear the search.`
                    : "This seller doesn't have any products available yet. Check back later as the seller adds new products."}
                </p>
                
                {/* Action Button */}
                {searchQuery ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                    className="px-6"
                  >
                    Clear Search
                  </Button>
                ) : isCurrentUserSeller ? (
                  <Button 
                    onClick={handleCreateProduct}
                    className="px-6"
                  >
                    Create Your First Product
                  </Button>
                ) : null}
              </div>
            </Card>
          ) : (
            <>
              {layout === 'table' && showLayoutSelector ? (
                <ProductTableView />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.product_uuid}
                      title={product.name}
                      price={`$${product.price_from || '0.00'}`}
                      image={product.thumbnail || '/placeholder.svg'}
                      seller="Seller"
                      description={product.description || product.name}
                      tags={[product.status || 'Draft']}
                      category="Product"
                      id={product.product_uuid}
                      onClick={() => handleProductClick(product.product_uuid)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
