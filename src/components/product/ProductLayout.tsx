
import React from "react";
import { MainHeader } from "@/components/MainHeader";
import { ProductGallery } from "./ProductGallery";
import { Card } from "@/components/ui/card";
import { usePreloadImage } from "@/hooks/use-preload-image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductImages } from "@/hooks/use-product-images";
import { ProductInfo } from "./ProductInfo";
import { MoreFromSeller } from "./MoreFromSeller";
import { ProductReviews } from "./ProductReviews";
import { VariantPicker } from "./VariantPicker";
import { AdditionalVariants } from "./AdditionalVariants";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";
import { ProductHeader } from "./ProductHeader";
import { ProductDemo } from "./ProductDemo";
import { ProductDescription } from "./ProductDescription";

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

  const embedUrl = getVideoEmbedUrl(product.demo);

  const handleContactSeller = () => {
    console.log("Contact seller clicked");
  };

  const handleAdditionalVariantSelect = (variantId: string, selected: boolean) => {
    console.log(`Additional variant ${variantId} ${selected ? 'selected' : 'unselected'}`);
    if (onAdditionalVariantToggle) {
      onAdditionalVariantToggle(variantId, selected);
    }
  };

  const fullWidthSections = (
    <>
      <ProductDemo embedUrl={embedUrl} />
      <ProductReviews reviews={reviews} />
      <MoreFromSeller expert_uuid={product.expert_uuid} />
    </>
  );

  return (
    <div className="min-h-screen">
      <MainHeader />
      <main className="container mx-auto px-4 pt-16">
        <div className="lg:hidden">
          <ProductGallery 
            images={images}
            className="mb-4" 
            priority={true}
          />
          <ProductHeader 
            title={product.name}
            seller="Design Master"
            rating={averageRating}
            onContactSeller={handleContactSeller}
            className="mb-3"
          />
          <VariantPicker
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantChange={onVariantChange}
            onAddToCart={onAddToCart}
            className="mb-3"
          />
          
          <AdditionalVariants
            variants={variants}
            selectedMainVariant={selectedVariant}
            onAdditionalSelect={handleAdditionalVariantSelect}
            className="mb-5"
          />

          <div className="space-y-6">
            <ProductDescription description={product.description} />

            <ProductInfo 
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              difficultyLevel={product.difficulty_level}
            />

            {fullWidthSections}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ProductGallery 
                images={images}
                className="mb-5" 
                priority={!isMobile}
              />
              <ProductDescription description={product.description} />
            </div>
          </div>

          <div className="lg:space-y-4">
            <ProductHeader 
              title={product.name}
              seller="Design Master"
              rating={averageRating}
              onContactSeller={handleContactSeller}
              className="mb-2"
            />
            <VariantPicker
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantChange={onVariantChange}
              onAddToCart={onAddToCart}
              className="mb-3"
            />
            
            <AdditionalVariants
              variants={variants}
              selectedMainVariant={selectedVariant}
              onAdditionalSelect={handleAdditionalVariantSelect}
              className="mb-4"
            />
            
            <ProductInfo 
              techStack={product.tech_stack}
              productIncludes={product.product_includes}
              difficultyLevel={product.difficulty_level}
            />
          </div>
        </div>

        <div className="hidden lg:block mt-8 space-y-6">
          {fullWidthSections}
        </div>
      </main>
    </div>
  );
}
