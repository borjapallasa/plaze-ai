
import React from "react";
import { ProductDemo } from "./ProductDemo";
import { ProductReviews } from "./ProductReviews";
import { MoreFromSeller } from "./MoreFromSeller";
import { Review } from "./types/review";

interface ProductFullWidthSectionsProps {
  embedUrl: string | null;
  reviews: Review[];
  expert_uuid?: string;
}

export function ProductFullWidthSections({
  embedUrl,
  reviews,
  expert_uuid
}: ProductFullWidthSectionsProps) {
  return (
    <>
      <ProductDemo embedUrl={embedUrl} />
      <ProductReviews reviews={reviews} />
      <MoreFromSeller expert_uuid={expert_uuid} />
    </>
  );
}
