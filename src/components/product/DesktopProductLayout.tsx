
import React from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductHeader } from "./ProductHeader";
import { VariantPicker } from "./VariantPicker";
import { ProductPricing } from "./ProductPricing";
import { AdditionalVariants } from "./AdditionalVariants";
import { PurchaseProtection } from "./PurchaseProtection";
import { ProductFullWidthSections } from "./ProductFullWidthSections";
import { ProductLayoutProps } from "./types/variants";
import { ProductImage } from "@/types/product-images";

interface DesktopProductLayoutProps extends ProductLayoutProps {
  images: ProductImage[];
  handleContactSeller: () => void;
  isMobile: boolean;
  onLeaveReview?: (variantId: string) => void;
  expertUuid?: string;
}

export function DesktopProductLayout({
  product,
  images,
  variants,
  selectedVariant,
  relatedProductsWithVariants,
  averageRating,
  onVariantChange,
  onAddToCart,
  onAdditionalVariantToggle,
  handleContactSeller,
  isMobile,
  reviews,
  isLoading = false,
  onLeaveReview,
  expertUuid
}: DesktopProductLayoutProps) {
  const embedUrl = product.demo ? `https://www.youtube.com/embed/${product.demo}` : null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Gallery */}
        <div className="space-y-6">
          <ProductGallery images={images} />
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <ProductHeader
            title={product.name}
            seller={product.expert_uuid || "Unknown Seller"}
            rating={averageRating}
            onContactSeller={handleContactSeller}
            expertUuid={expertUuid}
            shortDescription={product.short_description}
          />

          <VariantPicker
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantChange={onVariantChange}
          />

          <ProductPricing
            variants={variants}
            selectedVariant={selectedVariant}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />

          {relatedProductsWithVariants.length > 0 && (
            <AdditionalVariants
              relatedProductsWithVariants={relatedProductsWithVariants}
              onAdditionalSelect={onAdditionalVariantToggle}
            />
          )}

          <PurchaseProtection />
        </div>
      </div>

      {/* Full-width sections */}
      <ProductFullWidthSections
        embedUrl={embedUrl}
        reviews={reviews}
        expert_uuid={expertUuid}
        productUuid={product.product_uuid}
        selectedVariant={selectedVariant}
        onLeaveReview={onLeaveReview}
      />
    </div>
  );
}
