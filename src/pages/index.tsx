
import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { CategoryHeader } from "@/components/CategoryHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"products" | "communities">("products");
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data;
    }
  });

  // TODO: Add communities query when needed
  const { data: communities } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching communities:', error);
        throw error;
      }

      return data;
    },
    enabled: viewMode === 'communities'
  });

  const filteredProducts = useMemo(() =>
    selectedCategory && products
      ? products.filter(product => product.type === selectedCategory)
      : products,
    [selectedCategory, products]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MainHeader />
        <div className="pt-24 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <MainHeader />
        <div className="pt-24 container mx-auto px-4">
          <div className="text-center text-red-500">
            Error loading products. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MainHeader />

      <main className="pt-16">
        <CategoryHeader
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
          {viewMode === "products" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product.product_uuid}
                  id={product.product_uuid}
                  slug={product.slug}
                  title={product.name}
                  price="Free"
                  image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                  seller={product.user_uuid}
                  description={product.description}
                  tags={product.tech_stack ? product.tech_stack.split(',') : []}
                  category={product.type}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {communities?.map((community) => (
                <div key={community.community_uuid} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{community.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{community.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
