
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

interface MobileProductLayoutProps extends ProductLayoutProps {
  images: ProductImage[];
  handleContactSeller: () => void;
  onLeaveReview?: (variantId: string) => void;
  expertUuid?: string;
}

export function MobileProductLayout({
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
  reviews,
  isLoading = false,
  onLeaveReview,
  expertUuid
}: MobileProductLayoutProps) {
  const embedUrl = product.demo ? `https://www.youtube.com/embed/${product.demo}` : null;

  return (
    <div className="space-y-6">
      {/* Product Gallery */}
      <ProductGallery images={images} />

      {/* Product Header */}
      <ProductHeader
        title={product.name}
        seller={product.expert_uuid || "Unknown Seller"}
        rating={averageRating}
        onContactSeller={handleContactSeller}
        expertUuid={expertUuid}
        shortDescription={product.short_description}
      />

      {/* Variant Picker */}
      <VariantPicker
        variants={variants}
        selectedVariant={selectedVariant}
        onVariantChange={onVariantChange}
      />

      {/* Pricing and Add to Cart */}
      <ProductPricing
        variants={variants}
        selectedVariant={selectedVariant}
        onAddToCart={onAddToCart}
        isLoading={isLoading}
      />

      {/* Additional Variants */}
      {relatedProductsWithVariants.length > 0 && (
        <AdditionalVariants
          relatedProductsWithVariants={relatedProductsWithVariants}
          onAdditionalSelect={onAdditionalVariantToggle}
        />
      )}

      {/* Purchase Protection */}
      <PurchaseProtection />

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
