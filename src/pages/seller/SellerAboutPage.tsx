
import React from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { SellerAboutHeader } from "./components/SellerAboutHeader";
import { SellerLoadingState } from "./components/SellerLoadingState";
import { SellerErrorState } from "./components/SellerErrorState";
import { SellerAboutTabs } from "./components/SellerAboutTabs";
import { useSellerData } from "@/hooks/seller/useSellerData";
import { useSellerProducts } from "@/hooks/seller/useSellerProducts";

export default function SellerAboutPage() {
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

  // Fetch communities data
  const { 
    data: communities = [], 
    isLoading: communitiesLoading 
  } = useExpertCommunities(seller?.expert_uuid);

  // Show loading state
  if (sellerLoading) {
    return <SellerLoadingState />;
  }

  // Error state handling or seller not found
  if (sellerError || !seller) {
    return <SellerErrorState error={sellerError as Error} />;
  }

  // Check if seller is active - if not, show error state
  if (seller.status !== 'active') {
    return <SellerErrorState error={new Error('This seller profile is not publicly available.')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <SellerAboutHeader 
          seller={seller} 
          productsCount={products?.length || 0}
          communitiesCount={communities?.length || 0}
        />

        <SellerAboutTabs
          products={products}
          communities={communities}
          productsLoading={productsLoading}
          communitiesLoading={communitiesLoading}
          expertUuid={seller.expert_uuid}
        />
      </main>
    </div>
  );
}
