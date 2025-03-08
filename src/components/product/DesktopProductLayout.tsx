
import React from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductHeader } from "./ProductHeader";
import { VariantPicker } from "./VariantPicker";
import { AdditionalVariants } from "./AdditionalVariants";
import { ProductDescription } from "./ProductDescription";
import { ProductInfo } from "./ProductInfo";
import { ProductFullWidthSections } from "./ProductFullWidthSections";
import { ProductImage } from "@/hooks/use-product-images";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

interface DesktopProductLayoutProps {
  product: any;
  images: ProductImage[];
  variants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle: (variantId: string, selected: boolean) => void;
  handleContactSeller: () => void;
  isMobile: boolean;
  reviews: any[];
}

export function DesktopProductLayout({
  product,
  images,
  variants,
  selectedVariant,
  averageRating,
  onVariantChange,
  onAddToCart,
  onAdditionalVariantToggle,
  handleContactSeller,
  isMobile,
  reviews
}: DesktopProductLayoutProps) {
  const embedUrl = getVideoEmbedUrl(product.demo);

  return (
    <>
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
            onAdditionalSelect={onAdditionalVariantToggle}
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
        <ProductFullWidthSections 
          embedUrl={embedUrl}
          reviews={reviews}
          expert_uuid={product.expert_uuid}
        />
      </div>
    </>
  );
}
