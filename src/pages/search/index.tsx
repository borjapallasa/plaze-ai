import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  // Add other relevant fields
}

interface Product {
  product_uuid: string;
  name: string;
  description: string;
  type: string;
  tech_stack?: string;
  slug?: string;
  user_uuid: string;
}

// Updated Expert interface to match the actual DB schema
interface Expert {
  expert_uuid: string;
  name: string;
  description: string; // Using description instead of bio
  avatar_url?: string;
  slug?: string;
}

interface Community {
  community_uuid: string;
  name: string;
  description: string;
  image_url?: string;
  slug?: string;
}

interface Job {
  job_uuid: string;
  title: string;
  description: string;
  company_name?: string;
  salary_range?: string;
}

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";

  const [results, setResults] = useState<{
    products: Product[];
    experts: Expert[];
    communities: Community[];
    jobs: Job[];
  }>({
    products: [],
    experts: [],
    communities: [],
    jobs: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(category);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch products
        const { data: products } = await supabase
          .from("products")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(8);

        // Fetch experts - map to match the Expert interface
        const { data: expertsData } = await supabase
          .from("experts")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(8);

        // Transform experts data to match our interface
        const experts = (expertsData || []).map((expert) => ({
          expert_uuid: expert.expert_uuid,
          name: expert.name || "Unknown Expert",
          description: expert.description || "", // Use description field from DB
          avatar_url: expert.thumbnail,
          slug: expert.slug,
        }));

        // Fetch communities
        const { data: communities } = await supabase
          .from("communities")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(8);

        // Fetch jobs
        const { data: jobs } = await supabase
          .from("jobs")
          .select("*")
          .ilike("title", `%${query}%`)
          .limit(8);

        setResults({
          products: products || [],
          experts: experts || [],
          communities: communities || [],
          jobs: jobs || [],
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  // Update active tab when category changes in URL
  useEffect(() => {
    if (
      category &&
      ["Products", "Experts", "Communities", "Jobs", "All"].includes(category)
    ) {
      setActiveTab(category);
    }
  }, [category]);

  const getTotalResults = () => {
    return (
      results.products.length +
      results.experts.length +
      results.communities.length +
      results.jobs.length
    );
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center text-gray-500 py-12">
            Enter a search query to see results
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-muted-foreground text-lg">
              Found {getTotalResults()} results
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Enhanced Tabs */}
              <div className="mb-8">
                <div className="border-b border-border bg-card/30 rounded-t-lg">
                  <nav className="flex space-x-0 overflow-x-auto scrollbar-hide px-6" aria-label="Tabs">
                    <button
                      onClick={() => {
                        setActiveTab("All");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete("category");
                        navigate(`/search?${newSearchParams.toString()}`);
                      }}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "All"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }`}
                    >
                      All ({getTotalResults()})
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab("Products");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.set("category", "Products");
                        navigate(`/search?${newSearchParams.toString()}`);
                      }}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "Products"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }`}
                    >
                      Products ({results.products.length})
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab("Experts");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.set("category", "Experts");
                        navigate(`/search?${newSearchParams.toString()}`);
                      }}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "Experts"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }`}
                    >
                      Experts ({results.experts.length})
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab("Communities");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.set("category", "Communities");
                        navigate(`/search?${newSearchParams.toString()}`);
                      }}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "Communities"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }`}
                    >
                      Communities ({results.communities.length})
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab("Jobs");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.set("category", "Jobs");
                        navigate(`/search?${newSearchParams.toString()}`);
                      }}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === "Jobs"
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }`}
                    >
                      Jobs ({results.jobs.length})
                    </button>
                  </nav>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-12">
                {(activeTab === "All" || activeTab === "Products") &&
                  results.products.length > 0 && (
                    <section>
                      {activeTab === "All" && (
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">Products</h2>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.products.map((product) => (
                          <ProductCard
                            key={product.product_uuid}
                            id={product.product_uuid}
                            slug={product.slug}
                            title={product.name}
                            price="$99.99"
                            image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                            seller={product.user_uuid}
                            description={product.description}
                            tags={
                              product.tech_stack
                                ? product.tech_stack.split(",")
                                : []
                            }
                            category={product.type}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                {(activeTab === "All" || activeTab === "Experts") &&
                  results.experts.length > 0 && (
                    <section>
                      {activeTab === "All" && (
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">Experts</h2>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.experts.map((expert) => (
                          <div
                            key={expert.expert_uuid}
                            className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="p-6">
                              <h3 className="font-semibold text-lg text-foreground mb-2">
                                {expert.name}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2">
                                {expert.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {(activeTab === "All" || activeTab === "Communities") &&
                  results.communities.length > 0 && (
                    <section>
                      {activeTab === "All" && (
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">Communities</h2>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.communities.map((community) => (
                          <div
                            key={community.community_uuid}
                            className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="p-6">
                              <h3 className="font-semibold text-lg text-foreground mb-2">
                                {community.name}
                              </h3>
                              <p className="text-muted-foreground line-clamp-2">
                                {community.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {(activeTab === "All" || activeTab === "Jobs") &&
                  results.jobs.length > 0 && (
                    <section>
                      {activeTab === "All" && (
                        <h2 className="text-2xl font-semibold mb-6 text-foreground">Jobs</h2>
                      )}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {results.jobs.map((job) => (
                          <div
                            key={job.job_uuid}
                            className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="p-6">
                              <h3 className="font-semibold text-lg text-foreground mb-2">
                                {job.title}
                              </h3>
                              {job.company_name && (
                                <p className="text-sm font-medium text-primary mb-2">
                                  {job.company_name}
                                </p>
                              )}
                              {job.salary_range && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {job.salary_range}
                                </p>
                              )}
                              <p className="text-muted-foreground line-clamp-2">
                                {job.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                {/* No results state */}
                {getTotalResults() === 0 && (
                  <div className="text-center py-16 border border-border rounded-lg bg-card">
                    <div className="max-w-md mx-auto">
                      <p className="text-xl font-semibold text-foreground mb-2">
                        No results found for "{query}"
                      </p>
                      <p className="text-muted-foreground">
                        Try different keywords or check your spelling
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
