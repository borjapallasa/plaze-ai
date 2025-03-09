
import React from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { SellerHeader } from "./components/SellerHeader";
import { SellerLoadingState } from "./components/SellerLoadingState";
import { SellerErrorState } from "./components/SellerErrorState";
import { SellerTabs } from "./components/SellerTabs";
import { useSellerData } from "@/hooks/seller/useSellerData";
import { useSellerProducts } from "@/hooks/seller/useSellerProducts";
import { useSellerServices } from "@/hooks/seller/useSellerServices";

export default function SellerPage() {
  const { id } = useParams();
  
  // Fetch seller data
  const { 
    data: seller, 
    isLoading: sellerLoading, 
    error: sellerError 
  } = useSellerData(id);

  // Fetch products data
  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useSellerProducts(seller?.expert_uuid);

  // Fetch services data
  const { 
    services = [], 
    isLoading: servicesLoading 
  } = useSellerServices(seller?.expert_uuid);

  // Fetch communities data
  const { 
    data: communities = [], 
    isLoading: communitiesLoading 
  } = useExpertCommunities(seller?.expert_uuid);

  // Show loading state
  if (sellerLoading) {
    return <SellerLoadingState />;
  }

  // Error state handling
  if (sellerError || !seller) {
    return <SellerErrorState error={sellerError as Error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <SellerHeader seller={seller} productsCount={products?.length || 0} />

        <SellerTabs
          products={products}
          services={services}
          communities={communities}
          productsLoading={productsLoading}
          servicesLoading={servicesLoading}
          communitiesLoading={communitiesLoading}
        />
      </main>
    </div>
  );
}
