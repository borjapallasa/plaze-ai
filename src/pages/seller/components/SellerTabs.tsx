
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, BriefcaseIcon, UsersRound, AppWindow } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ProductsTab } from "./ProductsTab";
import { ServicesTab } from "./ServicesTab";
import { CommunitiesTab } from "./CommunitiesTab";
import { ApplicationsTab } from "./ApplicationsTab";
import type { Service } from "@/components/expert/types";

interface SellerTabsProps {
  products: any[];
  services: Service[];
  communities: any[];
  productsLoading: boolean;
  servicesLoading: boolean;
  communitiesLoading: boolean;
}

export function SellerTabs({
  products,
  services,
  communities,
  productsLoading,
  servicesLoading,
  communitiesLoading
}: SellerTabsProps) {
  const location = useLocation();
  const isSellerPage = location.pathname.startsWith('/seller/');
  
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const availableTabs = isSellerPage 
      ? ['products', 'communities'] 
      : ['products', 'services', 'communities', 'applications'];
    return availableTabs.includes(hash) ? hash : 'products';
  });

  // Load hash from URL on page load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const availableTabs = isSellerPage 
        ? ['products', 'communities'] 
        : ['products', 'services', 'communities', 'applications'];
      if (availableTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set hash if it doesn't exist or if current hash is not available
    const availableTabs = isSellerPage 
      ? ['products', 'communities'] 
      : ['products', 'services', 'communities', 'applications'];
    
    if (!window.location.hash || !availableTabs.includes(window.location.hash.replace('#', ''))) {
      window.location.hash = activeTab;
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab, isSellerPage]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <Tabs 
      defaultValue={activeTab} 
      value={activeTab}
      onValueChange={handleTabChange}
      className="animate-fade-in"
    >
      <TabsList className={`grid ${isSellerPage ? 'grid-cols-2' : 'grid-cols-4'} h-12 items-center bg-muted/50 mb-6`}>
        <TabsTrigger value="products" className="data-[state=active]:bg-background">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Products
          {productsLoading && <span className="ml-2 text-xs">Loading...</span>}
        </TabsTrigger>
        {!isSellerPage && (
          <TabsTrigger value="services" className="data-[state=active]:bg-background">
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            Services
            {servicesLoading && <span className="ml-2 text-xs">Loading...</span>}
          </TabsTrigger>
        )}
        <TabsTrigger value="communities" className="data-[state=active]:bg-background">
          <UsersRound className="h-4 w-4 mr-2" />
          Communities
          {communitiesLoading && <span className="ml-2 text-xs">Loading...</span>}
        </TabsTrigger>
        {!isSellerPage && (
          <TabsTrigger value="applications" className="data-[state=active]:bg-background">
            <AppWindow className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="products" className="mt-0">
        <ProductsTab products={products} isLoading={productsLoading} />
      </TabsContent>

      {!isSellerPage && (
        <TabsContent value="services" className="mt-0">
          <ServicesTab services={services} isLoading={servicesLoading} />
        </TabsContent>
      )}

      <TabsContent value="communities" className="mt-0">
        <CommunitiesTab 
          communities={communities.map(community => ({
            ...community,
            status: community.status || 'active' // Add default status
          }))} 
          isLoading={communitiesLoading} 
        />
      </TabsContent>

      {!isSellerPage && (
        <TabsContent value="applications" className="mt-0">
          <ApplicationsTab />
        </TabsContent>
      )}
    </Tabs>
  );
}
