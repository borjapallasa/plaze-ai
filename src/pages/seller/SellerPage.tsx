
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
import type { Json } from "@/integrations/supabase/types";
import type { Service } from "@/components/expert/types";
import type { Expert } from "@/types/expert";

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

  // Safely handle the id parameter - don't use it directly in queries if it's ":id"
  const validId = id && id !== ':id' ? id : null;

  const { data: seller } = useQuery({
    queryKey: ['seller', validId],
    queryFn: async () => {
      if (!validId) {
        console.log('No valid user_uuid provided');
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', validId)
        .single();

      if (error) {
        console.error('Error fetching seller:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!validId
  });

  // First query to get the expert data by user_uuid
  const { data: expertData } = useQuery({
    queryKey: ['expert', validId],
    queryFn: async () => {
      if (!validId) {
        console.log('No valid user_uuid provided for expert query');
        return null;
      }
      
      // Try to fetch by user_uuid
      const { data, error } = await supabase
        .from('experts')
        .select(`
          expert_uuid,
          name,
          title,
          email,
          description,
          location,
          completed_projects,
          client_satisfaction,
          response_rate,
          areas,
          thumbnail
        `)
        .eq('user_uuid', validId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching expert data:", error);
        return null;
      }
      
      console.log("Expert data fetched:", data);
      
      if (!data) {
        return null;
      }
      
      // Return the expert data with default values for required properties
      return {
        ...data,
        id: 0, // Provide default values for required properties
        created_at: new Date().toISOString(),
        status: "active" as const
      } as Expert;
    },
    enabled: !!validId
  });

  // Query to fetch products using expert_uuid from the expert data
  const { data: products = [] } = useQuery({
    queryKey: ['sellerProducts', expertData?.expert_uuid],
    queryFn: async () => {
      if (!expertData?.expert_uuid) {
        console.log('No expert_uuid available to fetch products');
        return [];
      }
      
      console.log('Fetching products for expert_uuid:', expertData.expert_uuid);
      
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
        .eq('expert_uuid', expertData.expert_uuid);

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data || [];
    },
    enabled: !!expertData?.expert_uuid
  });

  // Query to fetch services using expert_uuid from the expert data
  const { data: servicesRaw = [] } = useQuery({
    queryKey: ['sellerServices', expertData?.expert_uuid],
    queryFn: async () => {
      if (!expertData?.expert_uuid) {
        console.log('No expert_uuid available to fetch services');
        return [];
      }
      
      console.log('Fetching services for expert_uuid:', expertData.expert_uuid);
      
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
        .eq('expert_uuid', expertData.expert_uuid);

      if (error) throw error;

      return data || [];
    },
    enabled: !!expertData?.expert_uuid
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

  // Use expert_uuid to fetch communities
  const { data: communities } = useExpertCommunities(expertData?.expert_uuid);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <SellerHeader seller={seller} expert={expertData} productsCount={products.length} />

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
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-background">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:bg-background">
              <UsersRound className="h-4 w-4 mr-2" />
              Communities
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-background">
              <AppWindow className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab products={products} />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab services={services} />
          </TabsContent>

          <TabsContent value="communities">
            <CommunitiesTab communities={communities || []} />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
