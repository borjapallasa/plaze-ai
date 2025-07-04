
import React from "react";
import { ProductDemo } from "./ProductDemo";
import { ProductReviews } from "./ProductReviews";
import { MoreFromSeller } from "./MoreFromSeller";
import { SimilarProducts } from "./SimilarProducts";
import { Review } from "./types/review";

interface ProductFullWidthSectionsProps {
  embedUrl: string | null;
  reviews: Review[];
  expert_uuid?: string;
  productUuid: string;
  selectedVariant?: string;
  onLeaveReview?: (variantId: string) => void;
}

export function ProductFullWidthSections({
  embedUrl,
  reviews,
  expert_uuid,
  productUuid,
  selectedVariant,
  onLeaveReview
}: ProductFullWidthSectionsProps) {
  console.log('ProductFullWidthSections received reviews:', reviews);
  
  return (
    <>
      <ProductDemo embedUrl={embedUrl} />
      <ProductReviews 
        reviews={reviews} 
        selectedVariant={selectedVariant}
        productUuid={productUuid}
        onLeaveReview={onLeaveReview}
      />
      <MoreFromSeller expert_uuid={expert_uuid} />
      <SimilarProducts />
    </>
  );
}
