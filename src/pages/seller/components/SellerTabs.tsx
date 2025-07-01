
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsTab } from "./ProductsTab";
import { ServicesTab } from "./ServicesTab";
import { CommunitiesTab } from "./CommunitiesTab";
import { PartnershipsTab } from "./PartnershipsTab";
import { MetricsTab } from "./MetricsTab";
import { ReviewsTab } from "./ReviewsTab";
import { ApplicationsTab } from "./ApplicationsTab";
import { Service } from "@/types/service";

export interface SellerTabsProps {
  products: Array<{
    name: string;
    status: "inactive" | "active" | "draft" | "review";
    variant_count: number;
    price_from: number;
    created_at: string;
    thumbnail: string;
    product_uuid: string;
  }>;
  services?: Service[];
  communities: Array<{
    name: string;
    member_count: number;
    status: string;
    created_at: string;
    thumbnail: string;
    community_uuid: string;
  }>;
  partnerships: Array<{
    affiliate_partnership_uuid: string;
    name: string;
    status: string;
    expert_split: number;
    affiliate_split: number;
    revenue: number;
    created_at: string;
    type: string;
  }>;
  expertUuid: string;
}

export function SellerTabs({ 
  products, 
  services = [], 
  communities, 
  partnerships, 
  expertUuid 
}: SellerTabsProps) {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="communities">Communities</TabsTrigger>
        <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="products" className="mt-6">
        <ProductsTab products={products} />
      </TabsContent>
      
      <TabsContent value="services" className="mt-6">
        <ServicesTab services={services} />
      </TabsContent>
      
      <TabsContent value="communities" className="mt-6">
        <CommunitiesTab communities={communities} />
      </TabsContent>
      
      <TabsContent value="partnerships" className="mt-6">
        <PartnershipsTab partnerships={partnerships} />
      </TabsContent>
      
      <TabsContent value="metrics" className="mt-6">
        <MetricsTab expertUuid={expertUuid} />
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-6">
        <ReviewsTab expertUuid={expertUuid} />
      </TabsContent>
      
      <TabsContent value="applications" className="mt-6">
        <ApplicationsTab expertUuid={expertUuid} />
      </TabsContent>
    </Tabs>
  );
}
