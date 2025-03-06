
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

  const { data: seller } = useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: products = [] } = useQuery({
    queryKey: ['sellerProducts', id],
    queryFn: async () => {
      console.log('Fetching products for seller:', id);
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
        .eq('expert_uuid', id);

      if (error) {
        console.error('Error fetching seller products:', error);
        throw error;
      }

      console.log('Fetched products:', data);
      return data || [];
    },
    enabled: !!id
  });

  const { data: services = [] } = useQuery({
    queryKey: ['sellerServices', id],
    queryFn: async () => {
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
        .eq('expert_uuid', id);

      if (error) throw error;

      return (data || []).map(service => ({
        ...service,
        features: Array.isArray(service.features) ? service.features : []
      }));
    },
    enabled: !!id
  });

  const { data: communities } = useExpertCommunities(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <SellerHeader seller={seller} productsCount={products.length} />

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
