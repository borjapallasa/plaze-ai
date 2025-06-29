
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Plus } from "lucide-react";
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
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export function ProductsTab({ products, isLoading = false }: ProductsTabProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

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

  return (
    <div className="space-y-6 mt-6">
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

          {isCurrentUserSeller && (
            <Button onClick={handleCreateProduct} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Product
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
          <span className="ml-3 text-muted-foreground">Loading products...</span>
        </div>
      ) : (
        <div>
          {filteredAndSortedProducts.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                {searchQuery ? `No products found matching "${searchQuery}"` : "No products found"}
              </div>
            </Card>
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
        </div>
      )}
    </div>
  );
}
