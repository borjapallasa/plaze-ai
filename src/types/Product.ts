
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
  accept_terms: null | boolean;
  affiliate_information: null;
  affiliate_program: null | boolean;
  affiliation_amount: null;
  change_reasons: null;
  changes_neeeded: null; // Keep the misspelled field as it is in the database
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
  short_description: string | null;
  slug: string;
  status: string;
  team: null;
  tech_stack: string;
  tech_stack_price: string;
  thumbnail: string;
  use_case: null;
  user_uuid: string;
  utm_campaign: null;
  utm_content: null;
  utm_id: null;
  utm_medium: null;
  utm_source: null;
  utm_term: null;
  variant_count: null;
  product_files: null | string;
  category: any; // Using category instead of type
}

// Type for the product data from the API
export interface ProductData extends Product { }

// Type for the product variant - ensure comparePrice is required to match Variant interface
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  comparePrice: number; // Make this required to match Variant interface
  label?: string;
  highlight?: boolean;
  features?: string[];
  tags?: string[];
  filesLink?: string;
  additionalDetails?: string;
  hidden?: boolean;
  createdAt?: Date | null;
  paymentLink?: string;
  community_product_relationship_uuid?: string;
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
  reviewType: string; // Changed from 'type' to 'reviewType'
}

// Define a CommunityProduct interface for classroom and other components
export interface CommunityProduct {
  community_product_uuid: string;
  name: string;
  price: number;
  community_uuid: string;
  product_type?: string;
  variant_uuid?: string;
  variant_name?: string;
  variant_price?: number;
  files_link?: string;  // Added missing property
  payment_link?: string; // Added missing property
  expert_uuid?: string;  // Added for completeness
}
