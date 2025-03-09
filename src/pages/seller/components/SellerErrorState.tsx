
import React from "react";
import { MainHeader } from "@/components/MainHeader";

interface SellerErrorStateProps {
  error?: Error;
}

export function SellerErrorState({ error }: SellerErrorStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>
      <div className="container mx-auto px-4 pt-24 pb-8 text-center">
        <div className="p-8 rounded-xl border border-destructive/20 bg-destructive/5 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Seller Not Found</h2>
          <p className="text-muted-foreground">
            We couldn't find the seller profile you're looking for. Please check the URL and try again.
          </p>
          {error ? (
            <div className="mt-4 p-4 bg-muted/50 rounded text-left text-sm text-muted-foreground overflow-auto">
              <pre>Error: {error.message}</pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
