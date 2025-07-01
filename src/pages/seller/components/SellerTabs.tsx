
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, UsersRound, BarChart3, Star, Handshake } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ProductsTab } from "./ProductsTab";
import { CommunitiesTab } from "./CommunitiesTab";
import { MetricsTab } from "./MetricsTab";
import { ReviewsTab } from "./ReviewsTab";
import { PartnershipsTab } from "./PartnershipsTab";

interface SellerTabsProps {
  products: any[];
  communities: any[];
  productsLoading: boolean;
  communitiesLoading: boolean;
  expertUuid?: string;
}

export function SellerTabs({
  products,
  communities,
  productsLoading,
  communitiesLoading,
  expertUuid
}: SellerTabsProps) {
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const availableTabs = ['metrics', 'products', 'communities', 'partnerships', 'reviews'];
    return availableTabs.includes(hash) ? hash : 'metrics';
  });

  // Load hash from URL on page load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const availableTabs = ['metrics', 'products', 'communities', 'partnerships', 'reviews'];
      if (availableTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set hash if it doesn't exist or if current hash is not available
    const availableTabs = ['metrics', 'products', 'communities', 'partnerships', 'reviews'];
    
    if (!window.location.hash || !availableTabs.includes(window.location.hash.replace('#', ''))) {
      window.location.hash = activeTab;
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div className="animate-fade-in">
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <div className="mb-6">
          <div className="max-w-[1400px] mx-auto px-4 border-b border-border">
            <TabsList className="h-auto items-center bg-transparent w-auto justify-start rounded-none p-0 border-0">
              <TabsTrigger 
                value="metrics" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Metrics
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Products
                {productsLoading && <span className="ml-2 text-xs">Loading...</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="communities" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <UsersRound className="h-4 w-4 mr-2" />
                Communities
                {communitiesLoading && <span className="ml-2 text-xs">Loading...</span>}
              </TabsTrigger>
              <TabsTrigger 
                value="partnerships" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <Handshake className="h-4 w-4 mr-2" />
                Partnerships
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-foreground whitespace-nowrap flex-shrink-0 rounded-none pb-3 px-4 border-b-2 border-transparent hover:border-muted-foreground/50 transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="metrics" className="mt-0">
          <MetricsTab />
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <ProductsTab 
            products={products} 
            isLoading={productsLoading} 
            showLayoutSelector={true}
          />
        </TabsContent>

        <TabsContent value="communities" className="mt-0">
          <CommunitiesTab 
            communities={communities.map(community => ({
              ...community,
              status: community.status || 'active' // Add default status
            }))} 
            isLoading={communitiesLoading} 
          />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-0">
          <PartnershipsTab expertUuid={expertUuid} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-0">
          <ReviewsTab expertUuid={expertUuid} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
