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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            Search Results for "{query}"
          </h1>
          <p className="text-muted-foreground mb-6">
            Found {getTotalResults()} results
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 border-b">
                <Button
                  variant={activeTab === "All" ? "default" : "ghost"}
                  onClick={() => {
                    setActiveTab("All");
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.delete("category");
                    navigate(`/search?${newSearchParams.toString()}`);
                  }}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  data-state={activeTab === "All" ? "active" : "inactive"}
                >
                  All ({getTotalResults()})
                </Button>
                <Button
                  variant={activeTab === "Products" ? "default" : "ghost"}
                  onClick={() => {
                    setActiveTab("Products");
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set("category", "Products");
                    navigate(`/search?${newSearchParams.toString()}`);
                  }}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  data-state={activeTab === "Products" ? "active" : "inactive"}
                >
                  Products ({results.products.length})
                </Button>
                <Button
                  variant={activeTab === "Experts" ? "default" : "ghost"}
                  onClick={() => {
                    setActiveTab("Experts");
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set("category", "Experts");
                    navigate(`/search?${newSearchParams.toString()}`);
                  }}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  data-state={activeTab === "Experts" ? "active" : "inactive"}
                >
                  Experts ({results.experts.length})
                </Button>
                <Button
                  variant={activeTab === "Communities" ? "default" : "ghost"}
                  onClick={() => {
                    setActiveTab("Communities");
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set("category", "Communities");
                    navigate(`/search?${newSearchParams.toString()}`);
                  }}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  data-state={
                    activeTab === "Communities" ? "active" : "inactive"
                  }
                >
                  Communities ({results.communities.length})
                </Button>
                <Button
                  variant={activeTab === "Jobs" ? "default" : "ghost"}
                  onClick={() => {
                    setActiveTab("Jobs");
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.set("category", "Jobs");
                    navigate(`/search?${newSearchParams.toString()}`);
                  }}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  data-state={activeTab === "Jobs" ? "active" : "inactive"}
                >
                  Jobs ({results.jobs.length})
                </Button>
              </div>

              {/* Results */}
              {(activeTab === "All" || activeTab === "Products") &&
                results.products.length > 0 && (
                  <div className={activeTab !== "All" ? "" : "mb-10"}>
                    {activeTab === "All" && (
                      <h2 className="text-xl font-semibold mb-4">Products</h2>
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
                  </div>
                )}

              {(activeTab === "All" || activeTab === "Experts") &&
                results.experts.length > 0 && (
                  <div className={activeTab !== "All" ? "" : "mb-10"}>
                    {activeTab === "All" && (
                      <h2 className="text-xl font-semibold mb-4">Experts</h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.experts.map((expert) => (
                        <div
                          key={expert.expert_uuid}
                          className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="p-4">
                            <h3 className="font-medium text-lg">
                              {expert.name}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2 mt-1">
                              {expert.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeTab === "All" || activeTab === "Communities") &&
                results.communities.length > 0 && (
                  <div className={activeTab !== "All" ? "" : "mb-10"}>
                    {activeTab === "All" && (
                      <h2 className="text-xl font-semibold mb-4">
                        Communities
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.communities.map((community) => (
                        <div
                          key={community.community_uuid}
                          className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="p-4">
                            <h3 className="font-medium text-lg">
                              {community.name}
                            </h3>
                            <p className="text-muted-foreground line-clamp-2 mt-1">
                              {community.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {(activeTab === "All" || activeTab === "Jobs") &&
                results.jobs.length > 0 && (
                  <div>
                    {activeTab === "All" && (
                      <h2 className="text-xl font-semibold mb-4">Jobs</h2>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {results.jobs.map((job) => (
                        <div
                          key={job.job_uuid}
                          className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="p-4">
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            {job.company_name && (
                              <p className="text-sm font-medium text-primary mt-1">
                                {job.company_name}
                              </p>
                            )}
                            {job.salary_range && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {job.salary_range}
                              </p>
                            )}
                            <p className="text-muted-foreground line-clamp-2 mt-2">
                              {job.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* No results state */}
              {getTotalResults() === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-lg font-medium">
                    No results found for "{query}"
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
