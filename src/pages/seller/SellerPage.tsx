
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, BriefcaseIcon, UsersRound, AppWindow } from "lucide-react";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { SellerHeader } from "./components/SellerHeader";
import { ProductsTab } from "./components/ProductsTab";
import { ServicesTab } from "./components/ServicesTab";
import { CommunitiesTab } from "./components/CommunitiesTab";
import { ApplicationsTab } from "./components/ApplicationsTab";
import type { Expert } from "@/types/expert";
import type { Service } from "@/components/expert/types";

export default function SellerPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['products', 'services', 'communities', 'applications'].includes(hash) ? hash : 'products';
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  // First, fetch the expert data to get the expert_uuid
  const { data: seller, isLoading: sellerLoading, error: sellerError } = useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      if (!id) throw new Error("No expert ID provided");
      
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('user_uuid', id)
        .single();

      if (error) {
        console.error('Error fetching expert:', error);
        throw error;
      }
      
      return data as Expert;
    },
    enabled: !!id
  });

  // Then use the expert_uuid to fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['sellerProducts', seller?.expert_uuid],
    queryFn: async () => {
      if (!seller?.expert_uuid) return [];
      
      console.log('Fetching products for expert_uuid:', seller.expert_uuid);
      const { data, error } = await supabase
        .from('products')
        .select(`
          name,
          status,
          variant_count,
          price_from,
          created_at,
          thumbnail,
          product_uuid
        `)
        .eq('expert_uuid', seller.expert_uuid);

      if (error) {
        console.error('Error fetching seller products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data || [];
    },
    enabled: !!seller?.expert_uuid
  });

  // Use the expert_uuid to fetch services
  const { data: servicesRaw = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['sellerServices', seller?.expert_uuid],
    queryFn: async () => {
      if (!seller?.expert_uuid) return [];
      
      console.log('Fetching services for expert_uuid:', seller.expert_uuid);
      const { data, error } = await supabase
        .from('services')
        .select(`
          name,
          description,
          price,
          features,
          type,
          status,
          service_uuid,
          monthly_recurring_revenue,
          revenue_amount,
          active_subscriptions_count,
          created_at
        `)
        .eq('expert_uuid', seller.expert_uuid);

      if (error) {
        console.error('Error fetching seller services:', error);
        throw error;
      }

      console.log('Fetched services:', data);
      return data || [];
    },
    enabled: !!seller?.expert_uuid
  });

  // Transform the services data to ensure features is a string array
  const services: Service[] = servicesRaw.map(service => ({
    ...service,
    features: Array.isArray(service.features) 
      ? service.features.map(feature => 
          typeof feature === 'string' ? feature : String(feature)
        ) 
      : []
  }));

  // Also update the communities fetching to use expert_uuid
  const { data: communities, isLoading: communitiesLoading } = useExpertCommunities(seller?.expert_uuid);

  // Show loading state or error handling if needed
  if (sellerLoading) {
    return <div className="p-8 text-center">Loading seller information...</div>;
  }

  if (sellerError) {
    console.error('Error loading seller:', sellerError);
    return <div className="p-8 text-center">Error loading seller information. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <SellerHeader seller={seller} productsCount={products?.length || 0} />

        <Tabs 
          defaultValue={activeTab} 
          value={activeTab}
          onValueChange={handleTabChange}
          className="animate-fade-in"
        >
          <TabsList className="grid grid-cols-4 h-12 items-center bg-muted/50">
            <TabsTrigger value="products" className="data-[state=active]:bg-background">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Products
              {productsLoading && <span className="ml-2 text-xs">Loading...</span>}
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-background">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Services
              {servicesLoading && <span className="ml-2 text-xs">Loading...</span>}
            </TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:bg-background">
              <UsersRound className="h-4 w-4 mr-2" />
              Communities
              {communitiesLoading && <span className="ml-2 text-xs">Loading...</span>}
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-background">
              <AppWindow className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab products={products} isLoading={productsLoading} />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab services={services} isLoading={servicesLoading} />
          </TabsContent>

          <TabsContent value="communities">
            <CommunitiesTab communities={communities || []} isLoading={communitiesLoading} />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
