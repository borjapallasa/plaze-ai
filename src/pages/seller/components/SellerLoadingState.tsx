
import React from "react";
import { MainHeader } from "@/components/MainHeader";

export function SellerLoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="animate-pulse">
          <div className="h-48 bg-muted rounded-xl mb-8"></div>
          <div className="h-12 bg-muted rounded-lg mb-8"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
