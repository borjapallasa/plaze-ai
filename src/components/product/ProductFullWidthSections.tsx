
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
}

export function ProductFullWidthSections({
  embedUrl,
  reviews,
  expert_uuid,
  productUuid
}: ProductFullWidthSectionsProps) {
  return (
    <>
      <ProductDemo embedUrl={embedUrl} />
      <ProductReviews reviews={reviews} />
      <MoreFromSeller expert_uuid={expert_uuid} />
      <SimilarProducts />
    </>
  );
}
