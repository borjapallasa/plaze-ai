
import React, { useState, useEffect, useMemo } from "react";
import { CategoryHeader } from "@/components/CategoryHeader";
import { ProductCard } from "@/components/ProductCard";
import { CommunitySubscriptionCard } from "@/components/communities/CommunitySubscriptionCard";
import { CommunitySubscriptionListView } from "@/components/communities/CommunitySubscriptionListView";
import { CommunitySubscriptionSortSelector } from "@/components/communities/CommunitySubscriptionSortSelector";
import { LayoutSelector } from "@/components/transactions/LayoutSelector";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

interface Product {
  product_uuid: string;
  name: string;
  short_description: string;
  thumbnail: string;
  price_from: number;
  status: string;
  type: string;
  expert_uuid?: string;
  user_uuid?: string;
  created_at: string;
  sales_count: number;
  review_count: number;
  variant_count: number;
  slug: string;
}

interface Community {
  community_uuid: string;
  name: string;
  intro: string;
  thumbnail: string;
  price: number;
  type: string;
  expert_uuid?: string;
  user_uuid?: string;
  created_at: string;
  member_count: number;
  slug: string;
  expert_thumbnail?: string;
}

interface Expert {
  expert_uuid: string;
  name: string;
  thumbnail: string;
  status: string;
}

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"products" | "communities">("products");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const location = useLocation();

  // Parse URL hash to determine initial view mode
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#communities") {
      setViewMode("communities");
    } else {
      setViewMode("products");
    }
  }, [location.hash]);

  // Fetch products with expert data
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['search-products', selectedCategory, sortBy],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          product_uuid,
          name,
          short_description,
          thumbnail,
          price_from,
          status,
          type,
          expert_uuid,
          user_uuid,
          created_at,
          sales_count,
          review_count,
          variant_count,
          slug
        `)
        .eq('status', 'active');

      // Apply category filters
      if (selectedCategory === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (selectedCategory === 'top-seller') {
        query = query.order('sales_count', { ascending: false, nullsLast: true });
      } else if (selectedCategory === 'best-reviews') {
        query = query.order('review_count', { ascending: false, nullsLast: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch experts
  const { data: experts = [] } = useQuery({
    queryKey: ['search-experts'],
    queryFn: async (): Promise<Expert[]> => {
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid, name, thumbnail, status')
        .eq('status', 'accepted');

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch communities with expert data
  const { data: communities = [], isLoading: isLoadingCommunities } = useQuery({
    queryKey: ['search-communities', selectedCategory, sortBy],
    queryFn: async (): Promise<Community[]> => {
      let query = supabase
        .from('communities')
        .select(`
          community_uuid,
          name,
          intro,
          thumbnail,
          price,
          type,
          expert_uuid,
          user_uuid,
          created_at,
          member_count,
          slug,
          expert_thumbnail
        `)
        .eq('visibility', 'public');

      // Apply category filters
      if (selectedCategory === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (selectedCategory === 'top-seller') {
        query = query.order('member_count', { ascending: false, nullsLast: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Create expert lookup for enriching data
  const expertLookup = useMemo(() => {
    const lookup: Record<string, Expert> = {};
    experts.forEach(expert => {
      lookup[expert.expert_uuid] = expert;
    });
    return lookup;
  }, [experts]);

  // Enrich products with expert data
  const enrichedProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      expert: product.expert_uuid ? expertLookup[product.expert_uuid] : undefined
    }));
  }, [products, expertLookup]);

  // Enrich communities with expert data
  const enrichedCommunities = useMemo(() => {
    return communities.map(community => ({
      ...community,
      expert: community.expert_uuid ? expertLookup[community.expert_uuid] : undefined
    }));
  }, [communities, expertLookup]);

  const isLoading = viewMode === "products" ? isLoadingProducts : isLoadingCommunities;
  const currentData = viewMode === "products" ? enrichedProducts : enrichedCommunities;

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryHeader 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {viewMode === "products" ? "Discover Products" : "Join Communities"}
            </h1>
            <p className="text-gray-600 mt-2">
              {viewMode === "products" 
                ? `${enrichedProducts.length} products found`
                : `${enrichedCommunities.length} communities found`
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            {viewMode === "communities" && (
              <CommunitySubscriptionSortSelector 
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            )}
            <LayoutSelector layout={layout} onLayoutChange={setLayout} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {viewMode} found matching your criteria.
            </p>
          </div>
        ) : viewMode === "products" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedProducts.map((product) => (
              <ProductCard 
                key={product.product_uuid}
                {...product}
              />
            ))}
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedCommunities.map((community) => (
              <CommunitySubscriptionCard 
                key={community.community_uuid}
                community={community}
              />
            ))}
          </div>
        ) : (
          <CommunitySubscriptionListView communities={enrichedCommunities} />
        )}
      </div>
    </div>
  );
}
