
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { SellerHeader } from "./components/SellerHeader";
import { SellerLoadingState } from "./components/SellerLoadingState";
import { SellerErrorState } from "./components/SellerErrorState";
import { SellerTabs } from "./components/SellerTabs";
import { useSellerData } from "@/hooks/seller/useSellerData";
import { useSellerProducts } from "@/hooks/seller/useSellerProducts";
import type { Expert } from "@/types/expert";
import { toast } from "sonner";

export default function SellerPage() {
  const { id } = useParams();
  const [sellerData, setSellerData] = useState<Expert | null>(null);
  
  // Fetch seller data
  const { 
    data: seller, 
    isLoading: sellerLoading, 
    error: sellerError,
    refetch: refetchSeller
  } = useSellerData(id);

  // Update the local state when seller data changes
  useEffect(() => {
    if (seller) {
      setSellerData(seller);
    }
  }, [seller]);

  // Use the local state if available, otherwise use the fetched data
  const currentSeller = sellerData || seller;

  // Fetch products data
  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useSellerProducts(currentSeller?.expert_uuid);

  // Fetch communities data
  const { 
    data: communities = [], 
    isLoading: communitiesLoading 
  } = useExpertCommunities(currentSeller?.expert_uuid);

  // Handle seller update
  const handleSellerUpdate = (updatedSeller: Expert) => {
    console.log("Updating seller in SellerPage:", updatedSeller);
    setSellerData(updatedSeller);
    // Also refetch to ensure data consistency with the database
    refetchSeller();
    toast.success("Expert profile updated successfully");
  };

  // Show loading state
  if (sellerLoading) {
    return <SellerLoadingState />;
  }

  // Error state handling
  if (sellerError || !currentSeller) {
    return <SellerErrorState error={sellerError as Error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <SellerHeader 
          seller={currentSeller} 
          productsCount={products?.length || 0}
          communitiesCount={communities?.length || 0}
          totalEarnings={0}
          onSellerUpdate={handleSellerUpdate}
        />

        <SellerTabs
          products={products}
          communities={communities}
          productsLoading={productsLoading}
          communitiesLoading={communitiesLoading}
          expertUuid={currentSeller.expert_uuid}
        />
      </main>
    </div>
  );
}
