import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsUp, TrendingUp, Sparkle, Trophy, Tags } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAffiliateProducts } from "@/hooks/use-affiliate-products";
import { useUsers } from "@/hooks/admin/useUsers";

const badges = [
  { label: "Trending", icon: TrendingUp, category: null },
  { label: "Newest", icon: Sparkle, category: "template" },
  { label: "Top Seller", icon: Trophy, category: "prompt" },
  { label: "Best Reviews", icon: ThumbsUp, category: "community" },
  { label: "Our Pick", icon: Star, category: "expert" },
  { label: "Affiliate Offers", icon: Tags, category: null }
];

export default function Affiliates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("All");
  const { data: affiliateProducts = [], isLoading, error } = useAffiliateProducts();
  const { 
    users, 
    isLoading: usersLoading, 
    error: usersError, 
    searchQuery, 
    setSearchQuery, 
    roleFilter, 
    setRoleFilter, 
    sortField, 
    sortDirection, 
    handleSort 
  } = useUsers();

  const handleBadgeClick = (category: string | null) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  // Filter products based on type
  const filteredProducts = affiliateProducts.filter(product => {
    if (filterType === "All") return true;
    if (filterType === "Product") return product.type === "product";
    if (filterType === "Community") return product.type === "community";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Your affiliate dashboard</h1>
        <AffiliateDashboard />
        
        <div className="mt-12 space-y-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">Your affiliates</h2>
            <p className="text-muted-foreground mb-8">
              Manage your affiliate network and track performance across different categories.
            </p>
            
            <Tabs defaultValue="users" className="space-y-4">
              <div className="w-full">
                <TabsList className="h-auto p-0 bg-transparent gap-6 justify-start w-auto">
                  <TabsTrigger 
                    value="users"
                    className="relative h-12 px-0 py-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground font-medium hover:text-foreground transition-colors"
                  >
                    Users
                  </TabsTrigger>
                  <TabsTrigger 
                    value="product-transactions"
                    className="relative h-12 px-0 py-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground font-medium hover:text-foreground transition-colors"
                  >
                    Product Transactions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="community-transactions"
                    className="relative h-12 px-0 py-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground font-medium hover:text-foreground transition-colors"
                  >
                    Community Transactions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="partnerships"
                    className="relative h-12 px-0 py-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground font-medium hover:text-foreground transition-colors"
                  >
                    Your Partnerships
                  </TabsTrigger>
                </TabsList>
                <Separator />
              </div>

              <TabsContent value="users">
                {usersLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : usersError ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Error loading users. Please try again.</p>
                  </div>
                ) : (
                  <UsersTable 
                    users={users}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                )}
              </TabsContent>

              <TabsContent value="product-transactions">
                <div className="border rounded-lg p-6 text-center text-muted-foreground">
                  <h3 className="font-semibold mb-2">Product Transactions</h3>
                  <p>View and manage all product-related affiliate transactions</p>
                </div>
              </TabsContent>

              <TabsContent value="community-transactions">
                <div className="border rounded-lg p-6 text-center text-muted-foreground">
                  <h3 className="font-semibold mb-2">Community Transactions</h3>
                  <p>Track community subscription and membership transactions</p>
                </div>
              </TabsContent>

              <TabsContent value="partnerships">
                <div className="border rounded-lg p-6 text-center text-muted-foreground">
                  <h3 className="font-semibold mb-2">Your Partnerships</h3>
                  <p>Manage your partnership agreements and collaboration opportunities</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="flex flex-col space-y-8 mb-8">
              <h2 className="text-4xl font-bold text-foreground">Affiliate offers</h2>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  {badges.map((badge, index) => {
                    const Icon = badge.icon;
                    const isSelected = selectedCategory === badge.category;
                    return (
                      <Badge
                        key={index}
                        variant={isSelected ? "default" : "secondary"}
                        className={`px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'hover:bg-secondary hover:shadow-sm'
                        }`}
                        onClick={() => handleBadgeClick(badge.category)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {badge.label}
                      </Badge>
                    );
                  })}
                </div>
                
                <Select 
                  defaultValue="All" 
                  onValueChange={setFilterType}
                  value={filterType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="border rounded-lg p-6 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Error loading affiliate products. Please try again.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No affiliate products available for the selected filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.affiliate_products_uuid}
                    title={product.product_name}
                    price={`$${product.product_price_from.toFixed(2)}`}
                    image={product.product_thumbnail || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"}
                    seller={product.expert_name}
                    description={product.product_description}
                    tags={["affiliate"]}
                    category="software"
                    split={`${Math.round(product.affiliate_share * 100)}/${Math.round(product.expert_share * 100)}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
