import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Product {
  product_uuid: string;
  name: string;
  description: string;
  price_from: number;
  thumbnail: string;
  slug: string;
  status: string;
}

interface Expert {
  expert_uuid: string;
  name: string;
  description: string;
  thumbnail: string;
  slug: string;
  areas: any[];
}

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  thumbnail: string;
  slug: string;
  member_count: number;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return { products: [], experts: [], communities: [] };

      const [productsRes, expertsRes, communitiesRes] = await Promise.all([
        supabase
          .from('products')
          .select('product_uuid, name, description, price_from, thumbnail, slug, status')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('status', 'active')
          .limit(10),
        
        supabase
          .from('experts')
          .select('expert_uuid, name, description, thumbnail, slug, areas')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(10),
        
        supabase
          .from('communities')
          .select('community_uuid, name, description, thumbnail, slug, member_count')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(10)
      ]);

      return {
        products: productsRes.data || [],
        experts: expertsRes.data || [],
        communities: communitiesRes.data || [],
      };
    },
    enabled: !!searchTerm.trim(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  const totalResults = searchResults ? 
    searchResults.products.length + searchResults.experts.length + searchResults.communities.length : 0;

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 pt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Search</h1>
            <p className="text-muted-foreground">Find products, experts, and communities</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, experts, or communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {searchTerm && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Searching..." : `${totalResults} results for "${searchTerm}"`}
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                  <TabsTrigger value="products">Products ({searchResults?.products.length || 0})</TabsTrigger>
                  <TabsTrigger value="experts">Experts ({searchResults?.experts.length || 0})</TabsTrigger>
                  <TabsTrigger value="communities">Communities ({searchResults?.communities.length || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {searchResults && (
                    <>
                      {searchResults.products.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-4">Products</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.products.map((product: Product) => (
                              <div key={product.product_uuid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                                <p className="text-sm font-medium mt-2">${product.price_from}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.experts.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-4">Experts</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.experts.map((expert: Expert) => (
                              <div key={expert.expert_uuid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-medium">{expert.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{expert.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.communities.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-4">Communities</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.communities.map((community: Community) => (
                              <div key={community.community_uuid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-medium">{community.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
                                <p className="text-sm text-muted-foreground mt-2">{community.member_count} members</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="products">
                  {searchResults?.products.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.products.map((product: Product) => (
                        <div key={product.product_uuid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                          <p className="text-sm font-medium mt-2">${product.price_from}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No products found</p>
                  )}
                </TabsContent>

                <TabsContent value="experts">
                  {searchResults?.experts.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.experts.map((expert: Expert) => (
                        <div key={expert.expert_uuid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium">{expert.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{expert.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No experts found</p>
                  )}
                </TabsContent>

                <TabsContent value="communities">
                  {searchResults?.communities.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.communities.map((community: Community) => (
                        <div key={community.community_uuid} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium">{community.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
                          <p className="text-sm text-muted-foreground mt-2">{community.member_count} members</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No communities found</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
