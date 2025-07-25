
import React from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductHeader } from "./ProductHeader";
import { VariantPicker } from "./VariantPicker";
import { AdditionalVariants } from "./AdditionalVariants";
import { ProductDescription } from "./ProductDescription";
import { ProductInfo } from "./ProductInfo";
import { ProductFullWidthSections } from "./ProductFullWidthSections";
import { PurchaseProtection } from "./PurchaseProtection";
import { ProductImage } from "@/hooks/use-product-images";
import { getVideoEmbedUrl } from "@/utils/videoEmbed";

interface MobileProductLayoutProps {
  product: any;
  images: ProductImage[];
  variants: any[];
  relatedProductsWithVariants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle: (variantId: string, selected: boolean) => void;
  handleContactSeller: () => void;
  reviews: any[];
  isLoading?: boolean;
  onLeaveReview?: (variantId: string) => void;
  expertUuid?: string;
}

export function MobileProductLayout({
  product,
  images,
  variants = [],
  relatedProductsWithVariants = [],
  selectedVariant,
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
  const embedUrl = getVideoEmbedUrl(product.demo);

  return (
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
        className="mb-1"
        expertUuid={expertUuid}
        shortDescription={product.short_description}
      />
      {Array.isArray(variants) && variants.length > 0 && (
        <VariantPicker
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantChange={onVariantChange}
          onAddToCart={onAddToCart}
          className="mb-3"
          isLoading={isLoading}
        />)
      }
      {Array.isArray(relatedProductsWithVariants) && relatedProductsWithVariants.length > 0 && (
        <AdditionalVariants
          relatedProductsWithVariants={relatedProductsWithVariants}
          onAdditionalSelect={onAdditionalVariantToggle}
          className="mb-3"
        />)
      }
      <div className="mb-5">
        <PurchaseProtection />
      </div>

      <div className="space-y-6">
        <ProductDescription description={product.description} />

        <ProductInfo
          techStack={product.tech_stack}
          productIncludes={product.product_includes}
          difficultyLevel={product.difficulty_level}
        />

        <ProductFullWidthSections
          embedUrl={embedUrl}
          reviews={reviews}
          expert_uuid={product.expert_uuid}
          productUuid={product.product_uuid}
          selectedVariant={selectedVariant}
          onLeaveReview={onLeaveReview}
        />
      </div>
    </div>
  );
}
