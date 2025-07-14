
import React from "react";
import { useMobile } from "@/hooks/use-mobile";
import { DesktopProductLayout } from "./DesktopProductLayout";
import { MobileProductLayout } from "./MobileProductLayout";
import { ProductLayoutProps } from "./types/variants";

export function ProductLayout({
  product,
  variants,
  selectedVariant,
  relatedProductsWithVariants,
  averageRating,
  onVariantChange,
  onAddToCart,
  onAdditionalVariantToggle,
  reviews,
  isLoading,
  onLeaveReview
}: ProductLayoutProps & { onLeaveReview?: (variantId: string) => void }) {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <MobileProductLayout
        product={product}
        variants={variants}
        selectedVariant={selectedVariant}
        relatedProductsWithVariants={relatedProductsWithVariants}
        averageRating={averageRating}
        onVariantChange={onVariantChange}
        onAddToCart={onAddToCart}
        onAdditionalVariantToggle={onAdditionalVariantToggle}
        reviews={reviews}
        isLoading={isLoading}
        onLeaveReview={onLeaveReview}
      />
    );
  }

  return (
    <DesktopProductLayout
      product={product}
      variants={variants}
      selectedVariant={selectedVariant}
      relatedProductsWithVariants={relatedProductsWithVariants}
      averageRating={averageRating}
      onVariantChange={onVariantChange}
      onAddToCart={onAddToCart}
      onAdditionalVariantToggle={onAdditionalVariantToggle}
      reviews={reviews}
      isLoading={isLoading}
      onLeaveReview={onLeaveReview}
    />
  );
}
