import React, { useState, useMemo } from "react";
import { AffiliateOffersLayoutSwitcher, LayoutType } from "./AffiliateOffersLayoutSwitcher";
import { AffiliateOffersSortSelector, SortOption } from "./AffiliateOffersSortSelector";
import { AffiliateOffersTypeFilter, FilterType } from "./AffiliateOffersTypeFilter";
import { AffiliateOffersGrid } from "./AffiliateOffersGrid";
import { AffiliateOffersList } from "./AffiliateOffersList";
import { useAllAffiliateProducts } from "@/hooks/use-affiliate-products";
import { useExistingPartnerships } from "@/hooks/use-existing-partnerships";
import { Star } from "lucide-react";

export function AffiliateOffersSection() {
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [sortBy, setSortBy] = useState<SortOption>({ 
    field: "earnings", 
    direction: "desc", 
    label: "Earnings (High to Low)" 
  });
  const [filterType, setFilterType] = useState<FilterType>("all");
  
  const { data: affiliateProducts = [], isLoading, error } = useAllAffiliateProducts();
  const { data: existingPartnerships = [] } = useExistingPartnerships();

  // Transform and sort the data
  const offers = useMemo(() => {
    const transformedOffers = affiliateProducts
      .filter(product => product.status === "active")
      // Filter out products where partnerships already exist
      .filter(product => !existingPartnerships.includes(product.affiliate_products_uuid))
      .map(product => ({
        id: product.affiliate_products_uuid,
        title: product.product_name || "Unnamed Product",
        description: product.product_description || "No description available",
        category: "product", // Default category instead of using type
        // Convert commission from 0-1 range to percentage
        commissionRate: Math.round((product.affiliate_share || 0) * 100),
        commissionType: "percentage" as const,
        rating: 4.5, // Default rating since we don't have this data
        totalAffiliates: 100, // Default value since we don't have this data
        monthlyEarnings: 100, // Default as requested
        thumbnail: product.product_thumbnail || "",
        status: product.status === "active" ? "active" as const : "pending" as const,
        partnerName: product.expert_name || "Unknown Expert",
        type: "product", // Keep for filtering compatibility
        createdAt: product.created_at // Add created_at for sorting
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
        case "added":
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          compareValue = 0;
      }
      
      return sortBy.direction === "desc" ? -compareValue : compareValue;
    });
  }, [affiliateProducts, sortBy, filterType, existingPartnerships]);

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
        <div 
          className="rounded-lg bg-gray-50/50 py-16 px-8"
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px'
          }}
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers available yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {filterType === "all" 
                ? "There are currently no new affiliate offers available. Check back later as experts add new products to the affiliate program." 
                : `There are currently no new ${filterType} offers available. Try changing your filter or check back later.`}
            </p>
          </div>
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
