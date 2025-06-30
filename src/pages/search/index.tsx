
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Product {
  product_uuid: string;
  name: string;
  description: string;
  price_from: number;
  thumbnail: string;
  slug: string;
  status: string;
  type: string;
  expert_uuid: string;
  user_uuid: string;
  created_at: string;
}

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  slug: string;
  type: string;
  expert_uuid: string;
  created_at: string;
}

interface Expert {
  expert_uuid: string;
  name: string;
  description: string;
  thumbnail: string;
  slug: string;
  title: string;
  location: string;
  areas: any;
  created_at: string;
}

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'communities' | 'experts'>('all');

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchTerm, activeTab],
    queryFn: async () => {
      if (!searchTerm.trim()) return { products: [], communities: [], experts: [] };

      const results: { products: Product[], communities: Community[], experts: Expert[] } = {
        products: [],
        communities: [],
        experts: []
      };

      if (activeTab === 'all' || activeTab === 'products') {
        const { data: products } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .eq('status', 'active')
          .limit(20);
        
        results.products = products || [];
      }

      if (activeTab === 'all' || activeTab === 'communities') {
        const { data: communities } = await supabase
          .from('communities')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(20);
        
        results.communities = communities || [];
      }

      if (activeTab === 'all' || activeTab === 'experts') {
        const { data: experts } = await supabase
          .from('experts')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`)
          .eq('status', 'approved')
          .limit(20);
        
        results.experts = experts || [];
      }

      return results;
    },
    enabled: !!searchTerm.trim(),
  });

  const handleSearch = () => {
    // The query will automatically refetch when searchTerm changes
  };

  const getTotalResults = () => {
    if (!searchResults) return 0;
    return searchResults.products.length + searchResults.communities.length + searchResults.experts.length;
  };

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for products, communities, or experts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            <Button onClick={handleSearch} size="lg">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>

          <div className="flex gap-4 mb-6 border-b">
            {(['all', 'products', 'communities', 'experts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
                {searchResults && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({tab === 'all' ? getTotalResults() : searchResults[tab as keyof typeof searchResults]?.length || 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : !searchTerm.trim() ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Search for anything</h3>
              <p className="text-gray-600">Find products, communities, and experts that match your needs.</p>
            </div>
          ) : searchResults && getTotalResults() === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Products Section */}
              {(activeTab === 'all' || activeTab === 'products') && searchResults?.products && searchResults.products.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.products.map((product) => (
                      <ProductCard
                        key={product.product_uuid}
                        title={product.name}
                        price={`$${product.price_from}`}
                        image={product.thumbnail || '/placeholder.svg'}
                        seller="Seller"
                        description={product.description}
                        tags={[]}
                        category={product.type || 'product'}
                        id={product.product_uuid}
                        slug={product.slug}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Communities Section */}
              {(activeTab === 'all' || activeTab === 'communities') && searchResults?.communities && searchResults.communities.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Communities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.communities.map((community) => (
                      <div key={community.community_uuid} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gray-100">
                          {community.thumbnail && (
                            <img
                              src={community.thumbnail}
                              alt={community.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{community.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{community.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">${community.price}</span>
                            <span className="text-xs text-gray-500 capitalize">{community.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Experts Section */}
              {(activeTab === 'all' || activeTab === 'experts') && searchResults?.experts && searchResults.experts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Experts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.experts.map((expert) => (
                      <div key={expert.expert_uuid} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden mr-4">
                              {expert.thumbnail && (
                                <img
                                  src={expert.thumbnail}
                                  alt={expert.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{expert.name}</h3>
                              <p className="text-gray-600 text-sm">{expert.title}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{expert.description}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{expert.location}</span>
                            <span>{expert.areas?.length || 0} areas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
