
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsTab } from "./ProductsTab";
import { CommunitiesTab } from "./CommunitiesTab";
import { ReviewsTab } from "./ReviewsTab";
import { MetricsTab } from "./MetricsTab";

interface SellerTabsProps {
  seller: any;
  mode?: 'seller' | 'admin';
}

export function SellerTabs({ seller, mode = 'seller' }: SellerTabsProps) {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "Products", component: ProductsTab },
    { id: "communities", label: "Communities", component: CommunitiesTab },
    { id: "reviews", label: "Reviews", component: ReviewsTab },
    { id: "metrics", label: "Metrics", component: MetricsTab },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => {
        const Component = tab.component;
        return (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <Component seller={seller} mode={mode} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
