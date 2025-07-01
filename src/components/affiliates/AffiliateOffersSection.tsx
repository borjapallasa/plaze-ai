
import React, { useState } from "react";
import { AffiliateOffersLayoutSwitcher, LayoutType } from "./AffiliateOffersLayoutSwitcher";
import { AffiliateOffersGrid } from "./AffiliateOffersGrid";
import { AffiliateOffersList } from "./AffiliateOffersList";
import { useAllAffiliateProducts } from "@/hooks/use-affiliate-products";

export function AffiliateOffersSection() {
  const [layout, setLayout] = useState<LayoutType>("grid");
  const { data: affiliateProducts = [], isLoading, error } = useAllAffiliateProducts();

  // Transform the data to match the expected interface
  const offers = affiliateProducts.map(product => ({
    id: product.affiliate_products_uuid,
    title: product.product_name || "Unnamed Product",
    description: product.product_description || "No description available",
    category: product.type || "General",
    // Convert commission from 0-1 range to percentage
    commissionRate: Math.round((product.affiliate_share || 0) * 100),
    commissionType: "percentage" as const,
    rating: 4.5, // Default rating since we don't have this data
    totalAffiliates: 100, // Default value since we don't have this data
    monthlyEarnings: 100, // Default as requested
    thumbnail: product.product_thumbnail || "",
    status: product.status === "active" ? "active" as const : "pending" as const,
    partnerName: product.expert_name || "Unknown Expert"
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
            <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
          </div>
          <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
            <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
          </div>
          <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load affiliate offers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
          <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
        </div>
        <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No affiliate offers available at the moment.</p>
        </div>
      ) : (
        <>
          {layout === "grid" ? (
            <AffiliateOffersGrid offers={offers} />
          ) : (
            <AffiliateOffersList offers={offers} />
          )}
        </>
      )}
    </div>
  );
}
