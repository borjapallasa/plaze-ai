
export interface Variant {
  id: string;
  name: string;
  price: number;
  features: string[];
  filesLink?: string;
  paymentLink?: string;
  relationshipUuid?: string; // Added for classroom product relationships
}

export interface VariantWithReviews extends Variant {
  reviews: any[];
  averageRating: number;
}
