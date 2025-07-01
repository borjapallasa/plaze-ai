
import React from "react";
import { AffiliateOfferCard } from "./AffiliateOfferCard";

interface AffiliateOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: "percentage" | "fixed";
  rating: number;
  totalAffiliates: number;
  monthlyEarnings: number;
  thumbnail: string;
  status: "active" | "pending" | "paused";
  partnerName: string;
  type?: string;
}

interface AffiliateOffersGridProps {
  offers: AffiliateOffer[];
}

export function AffiliateOffersGrid({ offers }: AffiliateOffersGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {offers.map((offer) => (
        <AffiliateOfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
