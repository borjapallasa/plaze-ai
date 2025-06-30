
import React, { useState } from "react";
import { AffiliateOffersLayoutSwitcher, LayoutType } from "./AffiliateOffersLayoutSwitcher";
import { AffiliateOffersGrid } from "./AffiliateOffersGrid";
import { AffiliateOffersList } from "./AffiliateOffersList";

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
}

const mockOffers: AffiliateOffer[] = [
  {
    id: "1",
    title: "Premium Web Templates",
    description: "High-quality responsive web templates for modern businesses",
    category: "Design",
    commissionRate: 30,
    commissionType: "percentage",
    rating: 4.8,
    totalAffiliates: 1250,
    monthlyEarnings: 850,
    thumbnail: "",
    status: "active",
    partnerName: "WebCraft Studios"
  },
  {
    id: "2",
    title: "Digital Marketing Course",
    description: "Complete digital marketing masterclass with 50+ hours of content",
    category: "Education",
    commissionRate: 25,
    commissionType: "percentage",
    rating: 4.9,
    totalAffiliates: 890,
    monthlyEarnings: 1200,
    thumbnail: "",
    status: "active",
    partnerName: "MarketPro Academy"
  },
  {
    id: "3",
    title: "SaaS Analytics Tool",
    description: "Advanced analytics platform for SaaS businesses",
    category: "Software",
    commissionRate: 40,
    commissionType: "percentage",
    rating: 4.7,
    totalAffiliates: 560,
    monthlyEarnings: 2100,
    thumbnail: "",
    status: "active",
    partnerName: "DataInsight Inc"
  },
  {
    id: "4",
    title: "E-commerce Store Builder",
    description: "Drag-and-drop e-commerce platform with payment integration",
    category: "E-commerce",
    commissionRate: 35,
    commissionType: "percentage",
    rating: 4.6,
    totalAffiliates: 780,
    monthlyEarnings: 950,
    thumbnail: "",
    status: "pending",
    partnerName: "ShopBuilder"
  },
  {
    id: "5",
    title: "Photography Lightroom Presets",
    description: "Professional photo editing presets for photographers",
    category: "Photography",
    commissionRate: 50,
    commissionType: "percentage",
    rating: 4.9,
    totalAffiliates: 2100,
    monthlyEarnings: 650,
    thumbnail: "",
    status: "active",
    partnerName: "PhotoArt Studio"
  },
  {
    id: "6",
    title: "Mobile App Development Kit",
    description: "Complete toolkit for building cross-platform mobile apps",
    category: "Development",
    commissionRate: 45,
    commissionType: "percentage",
    rating: 4.5,
    totalAffiliates: 420,
    monthlyEarnings: 1350,
    thumbnail: "",
    status: "paused",
    partnerName: "AppDev Tools"
  }
];

export function AffiliateOffersSection() {
  const [layout, setLayout] = useState<LayoutType>("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Available Affiliate Offers</h2>
          <p className="text-muted-foreground">Discover new products to promote and earn commissions</p>
        </div>
        <AffiliateOffersLayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {layout === "grid" ? (
        <AffiliateOffersGrid offers={mockOffers} />
      ) : (
        <AffiliateOffersList offers={mockOffers} />
      )}
    </div>
  );
}
