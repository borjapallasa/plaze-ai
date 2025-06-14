import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CategoryHeader } from "@/components/CategoryHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize view mode based on URL hash
  const getInitialViewMode = (): "products" | "communities" => {
    const hash = location.hash;
    if (hash === "#communities") return "communities";
    return "products";
  };
  
  const [viewMode, setViewMode] = useState<"products" | "communities">(getInitialViewMode);

  // Update view mode when URL hash changes
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#communities" && viewMode !== "communities") {
      setViewMode("communities");
    } else if (hash === "#products" && viewMode !== "products") {
      setViewMode("products");
    } else if (!hash && viewMode !== "products") {
      setViewMode("products");
    }
  }, [location.hash, viewMode]);

  // Set initial hash if none exists
  useEffect(() => {
    if (!location.hash) {
      navigate(location.pathname + location.search + "#products", { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

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
        <Footer />
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
        <Footer />
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

        <div className="w-full max-w-[1400px] mx-auto px-4 py-2 pb-12">
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
                <Card key={community.community_uuid} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Community Image */}
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={community.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"}
                      alt={community.name || 'Community'}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    {/* Community Name */}
                    <h3 className="font-semibold text-lg line-clamp-2">{community.name}</h3>
                    
                    {/* Community Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
                    
                    {/* Community Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{community.member_count || 0} members</span>
                      </div>
                      
                      <div className="font-medium">
                        {community.price && community.price > 0 ? (
                          <span className="text-primary">${community.price}/mo</span>
                        ) : (
                          <span className="text-green-600">Free</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
