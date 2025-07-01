
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import { AffiliateTabsInterface } from "@/components/affiliates/AffiliateTabsInterface";
import { AffiliateOffersSection } from "@/components/affiliates/AffiliateOffersSection";

export default function AffiliatesPage() {
  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 pt-16">
        <div className="space-y-8">
          <div>
            
            
          </div>
          
          {/* Keep the original dashboard components */}
          <AffiliateDashboard />
          
          {/* Add the new tabbed interface below */}
          <AffiliateTabsInterface />
          
          {/* Add the new affiliate offers section */}
          <AffiliateOffersSection />
        </div>
      </div>
    </>
  );
}
