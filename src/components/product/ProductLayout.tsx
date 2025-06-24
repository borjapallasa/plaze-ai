
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { usePreloadImage } from "@/hooks/use-preload-image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductImages } from "@/hooks/use-product-images";
import { MobileProductLayout } from "./MobileProductLayout";
import { DesktopProductLayout } from "./DesktopProductLayout";
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
  isLoading = false,
  onLeaveReview
}: ProductLayoutProps & { onLeaveReview?: (variantId: string) => void }) {
  const isMobile = useIsMobile();
  const { images, isLoading: isLoadingImages } = useProductImages(product.product_uuid);

  const mainImage = images[0]?.url;
  usePreloadImage(mainImage);

  const handleContactSeller = () => {
    console.log("Contact seller clicked");
  };

  const handleAdditionalVariantSelect = (variantId: string, selected: boolean) => {
    console.log(`Additional variant ${variantId} ${selected ? 'selected' : 'unselected'}`);
    if (onAdditionalVariantToggle) {
      onAdditionalVariantToggle(variantId, selected);
    }
  };

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 pt-28 md:pt-32">
        {isMobile ? (
          <MobileProductLayout
            product={product}
            images={images}
            variants={variants}
            relatedProductsWithVariants={relatedProductsWithVariants}
            selectedVariant={selectedVariant}
            averageRating={averageRating}
            onVariantChange={onVariantChange}
            onAddToCart={onAddToCart}
            onAdditionalVariantToggle={handleAdditionalVariantSelect}
            handleContactSeller={handleContactSeller}
            reviews={reviews}
            isLoading={isLoading}
            onLeaveReview={onLeaveReview}
          />
        ) : (
          <DesktopProductLayout
            product={product}
            images={images}
            variants={variants}
            relatedProductsWithVariants={relatedProductsWithVariants}
            selectedVariant={selectedVariant}
            averageRating={averageRating}
            onVariantChange={onVariantChange}
            onAddToCart={onAddToCart}
            onAdditionalVariantToggle={handleAdditionalVariantSelect}
            handleContactSeller={handleContactSeller}
            isMobile={isMobile}
            reviews={reviews}
            isLoading={isLoading}
            onLeaveReview={onLeaveReview}
          />
        )}
      </main>
    </div>
  );
}
