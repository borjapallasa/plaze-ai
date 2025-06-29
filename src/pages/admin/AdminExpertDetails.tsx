
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { SellerHeader } from "@/pages/seller/components/SellerHeader";
import { SellerLoadingState } from "@/pages/seller/components/SellerLoadingState";
import { SellerErrorState } from "@/pages/seller/components/SellerErrorState";
import { SellerTabs } from "@/pages/seller/components/SellerTabs";
import { useSellerData } from "@/hooks/seller/useSellerData";
import { useSellerProducts } from "@/hooks/seller/useSellerProducts";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import type { Expert } from "@/types/expert";
import { toast } from "sonner";

export default function AdminExpertDetails() {
  const { id } = useParams();
  const [sellerData, setSellerData] = useState<Expert | null>(null);
  
  const { 
    data: seller, 
    isLoading: sellerLoading, 
    error: sellerError,
    refetch: refetchSeller
  } = useSellerData(id);

  React.useEffect(() => {
    if (seller) {
      setSellerData(seller);
    }
  }, [seller]);

  const currentSeller = sellerData || seller;

  const { 
    data: products = [], 
    isLoading: productsLoading 
  } = useSellerProducts(currentSeller?.expert_uuid);

  const { 
    data: communities = [], 
    isLoading: communitiesLoading 
  } = useExpertCommunities(currentSeller?.expert_uuid);

  const handleSellerUpdate = (updatedSeller: Expert) => {
    console.log("Updating seller in AdminExpertDetails:", updatedSeller);
    setSellerData(updatedSeller);
    refetchSeller();
    toast.success("Expert profile updated successfully");
  };

  if (sellerLoading) {
    return <SellerLoadingState />;
  }

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
          expertUuid={currentSeller?.expert_uuid}
        />
      </main>
    </div>
  );
}
