import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTabsInterface } from "@/components/affiliates/AffiliateTabsInterface";

export default function AffiliatesPage() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Affiliate Management</h1>
            <p className="text-muted-foreground">Manage your affiliate network and track performance</p>
          </div>
          
          {/* Keep the original dashboard components */}
          <AffiliateDashboard />
          
          {/* Add the new tabbed interface below */}
          <AffiliateTabsInterface />
        </div>
      </div>
    </>
  );
}
