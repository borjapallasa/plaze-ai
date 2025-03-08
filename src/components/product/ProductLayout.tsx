
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { usePreloadImage } from "@/hooks/use-preload-image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductImages } from "@/hooks/use-product-images";
import { MobileProductLayout } from "./MobileProductLayout";
import { DesktopProductLayout } from "./DesktopProductLayout";

interface ProductLayoutProps {
  product: any;
  variants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle?: (variantId: string, selected: boolean) => void;
  reviews: any[];
}

export function ProductLayout({
  product,
  variants,
  selectedVariant,
  averageRating,
  onVariantChange,
  onAddToCart,
  onAdditionalVariantToggle,
  reviews
}: ProductLayoutProps) {
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
      <main className="container mx-auto px-4 pt-16">
        <MobileProductLayout 
          product={product}
          images={images}
          variants={variants}
          selectedVariant={selectedVariant}
          averageRating={averageRating}
          onVariantChange={onVariantChange}
          onAddToCart={onAddToCart}
          onAdditionalVariantToggle={handleAdditionalVariantSelect}
          handleContactSeller={handleContactSeller}
          reviews={reviews}
        />
        
        <DesktopProductLayout 
          product={product}
          images={images}
          variants={variants}
          selectedVariant={selectedVariant}
          averageRating={averageRating}
          onVariantChange={onVariantChange}
          onAddToCart={onAddToCart}
          onAdditionalVariantToggle={handleAdditionalVariantSelect}
          handleContactSeller={handleContactSeller}
          isMobile={isMobile}
          reviews={reviews}
        />
      </main>
    </div>
  );
}
