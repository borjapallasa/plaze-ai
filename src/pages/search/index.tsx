
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { SearchFilters } from "@/components/experts/SearchFilters";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  product_uuid: string;
  name: string;
  description: string;
  price_from: number;
  thumbnail: string;
  status: "active" | "inactive" | "draft" | "review";
  expert_uuid: string;
  slug: string;
  type: string;
  use_case: any;
  platform: any;
  industries: any;
  tech_stack: string;
  variant_count: number;
  sales_count: number;
  review_count: number;
  experts?: {
    name: string;
    thumbnail: string;
  };
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    priceRange: searchParams.get("priceRange") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
  });

  // Update URL when search term or filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("q", searchTerm);
    if (filters.category) newParams.set("category", filters.category);
    if (filters.priceRange) newParams.set("priceRange", filters.priceRange);
    if (filters.sortBy) newParams.set("sortBy", filters.sortBy);
    
    setSearchParams(newParams, { replace: true });
  }, [searchTerm, filters, setSearchParams]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['search-products', searchTerm, filters],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          experts!inner(name, thumbnail)
        `)
        .eq('status', 'active');

      // Apply search term filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      // Apply category filter
      if (filters.category) {
        query = query.contains('use_case', [filters.category]);
      }

      // Apply price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        query = query.gte('price_from', min);
        if (max) {
          query = query.lte('price_from', max);
        }
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          query = query.order('price_from', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price_from', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('sales_count', { ascending: false, nullsLast: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {searchTerm ? `Search results for "${searchTerm}"` : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <SearchFilters 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              initialSearchTerm={searchTerm}
              initialFilters={filters}
            />
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.product_uuid}
                    name={product.name}
                    description={product.description}
                    price={product.price_from}
                    image={product.thumbnail}
                    slug={product.slug}
                    expertName={product.experts?.name}
                    expertThumbnail={product.experts?.thumbnail}
                    variantCount={product.variant_count}
                    salesCount={product.sales_count}
                    reviewCount={product.review_count}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
