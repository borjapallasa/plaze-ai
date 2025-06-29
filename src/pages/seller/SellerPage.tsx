
import React from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { DefaultHeader } from "@/components/DefaultHeader";
import { SellerLoadingState } from "./components/SellerLoadingState";
import { SellerErrorState } from "./components/SellerErrorState";
import { SellerHeader } from "./components/SellerHeader";
import { SellerTabs } from "./components/SellerTabs";
import { useSellerData } from "@/hooks/seller/useSellerData";

interface SellerPageProps {
  mode?: 'seller' | 'admin';
}

export default function SellerPage({ mode = 'seller' }: SellerPageProps) {
  const { id } = useParams<{ id: string }>();
  const { data: seller, isLoading, error, refetch } = useSellerData(id || '');

  if (isLoading) {
    return <SellerLoadingState />;
  }

  if (error || !seller) {
    return <SellerErrorState onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      {mode === 'admin' && <DefaultHeader />}
      <div className="container mx-auto px-4 py-8">
        <SellerHeader seller={seller} mode={mode} />
        <SellerTabs seller={seller} mode={mode} />
      </div>
    </div>
  );
}
