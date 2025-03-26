
export interface RelatedProduct {
  product_uuid: string;
  name: string;
  price_from?: number;
}

export interface RelatedProductsListProps {
  productUUID: string;
  className?: string;
}

export interface Product {
  accept_terms: null;
  affiliate_information: null;
  affiliate_program: null;
  affiliation_amount: null;
  change_reasons: null;
  changes_neeeded: null; // Keep the misspelled field as it is in the database
  changes_needed: null; // Add this for code compatibility
  created_at: string;
  demo: string;
  description: string;
  difficulty_level: null;
  expert_uuid: string;
  fees_amount: null;
  free_or_paid: null;
  id: number;
  industries: null;
  name: string;
  platform: null;
  price_from: number;
  product_includes: string;
  product_uuid: string;
  public_link: null;
  related_products: any[];
  review_count: null;
  reviewed_by: null;
  sales_amount: null;
  sales_count: null;
  slug: string;
  status: string;
  team: null;
  tech_stack: string;
  tech_stack_price: string;
  thumbnail: string;
  type: null;
  use_case: null;
  user_uuid: string;
  utm_campaign: null;
  utm_content: null;
  utm_id: null;
  utm_medium: null;
  utm_source: null;
  utm_term: null;
  variant_count: null;
}

// Type for the product data from the API
export interface ProductData extends Product {}

// Type for the product variant
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  label?: string;
  highlight?: boolean;
  features?: string[];
}

// Type for the product review
export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  description: string;
  avatar: string;
  date: string;
  itemQuality: number;
  shipping: number;
  customerService: number;
  type: string;
}

// Define a CommunityProduct interface for classroom and other components
export interface CommunityProduct {
  community_product_uuid: string;
  name: string;
  price: number;
  community_uuid?: string;
  product_type?: string;
  variant_uuid?: string;
  variant_name?: string;
  variant_price?: number;
}
