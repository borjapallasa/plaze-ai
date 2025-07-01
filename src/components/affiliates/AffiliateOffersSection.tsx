
import React, { useState, useMemo } from "react";
import { AffiliateOffersLayoutSwitcher, LayoutType } from "./AffiliateOffersLayoutSwitcher";
import { AffiliateOffersSortSelector, SortOption } from "./AffiliateOffersSortSelector";
import { AffiliateOffersTypeFilter, FilterType } from "./AffiliateOffersTypeFilter";
import { AffiliateOffersGrid } from "./AffiliateOffersGrid";
import { AffiliateOffersList } from "./AffiliateOffersList";
import { useAllAffiliateProducts } from "@/hooks/use-affiliate-products";

export function AffiliateOffersSection() {
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [sortBy, setSortBy] = useState<SortOption>({ 
    field: "earnings", 
    direction: "desc", 
    label: "Earnings (High to Low)" 
  });
  const [filterType, setFilterType] = useState<FilterType>("all");
  
  const { data: affiliateProducts = [], isLoading, error } = useAllAffiliateProducts();

  // Transform and sort the data
  const offers = useMemo(() => {
    const transformedOffers = affiliateProducts
      .filter(product => product.status === "active")
      .map(product => ({
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
        partnerName: product.expert_name || "Unknown Expert",
        type: product.type || "product" // Add type for filtering
      }));

    // Filter by type
    const filteredOffers = filterType === "all" 
      ? transformedOffers 
      : transformedOffers.filter(offer => offer.type === filterType);

    // Sort the offers based on selected criteria
    return filteredOffers.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy.field) {
        case "earnings":
          compareValue = a.monthlyEarnings - b.monthlyEarnings;
          break;
        case "commission":
          compareValue = a.commissionRate - b.commissionRate;
          break;
        case "name":
          compareValue = a.title.localeCompare(b.title);
          break;
        default:
          compareValue = 0;
      }
      
      return sortBy.direction === "desc" ? -compareValue : compareValue;
    });
  }, [affiliateProducts, sortBy, filterType]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
            <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-3">
            <AffiliateOffersTypeFilter filterType={filterType} onFilterChange={setFilterType} />
            <AffiliateOffersSortSelector sortBy={sortBy} onSortChange={setSortBy} />
            <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
          </div>
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
            <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-3">
            <AffiliateOffersTypeFilter filterType={filterType} onFilterChange={setFilterType} />
            <AffiliateOffersSortSelector sortBy={sortBy} onSortChange={setSortBy} />
            <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load affiliate offers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
          <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-3">
          <AffiliateOffersTypeFilter filterType={filterType} onFilterChange={setFilterType} />
          <AffiliateOffersSortSelector sortBy={sortBy} onSortChange={setSortBy} />
          <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {filterType === "all" 
              ? "No active affiliate offers available at the moment." 
              : `No ${filterType} offers available at the moment.`}
          </p>
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
