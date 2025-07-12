
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  label?: string;
  highlight?: boolean;
  tags?: string[];
  features?: string[];
  hidden?: boolean;
  createdAt?: Date | null;
  filesLink?: string;
  paymentLink?: string;
  additionalDetails?: string;
  community_product_relationship_uuid?: string;
}

export interface Product {
  product_uuid: string;
  name: string;
  slug?: string;
  description?: string;
  short_description?: string;
  thumbnail?: string;
  price_from?: number;
  status?: string;
  created_at?: string;
  user_uuid?: string;
  expert_uuid?: string;
  category?: any;
  platform?: any;
  industries?: any;
  use_case?: any;
  team?: any;
  demo?: string;
  product_includes?: string;
  tech_stack?: string;
  difficulty_level?: string;
  affiliate_program?: boolean;
  affiliate_information?: string;
  affiliation_amount?: number;
  accept_terms?: boolean;
  sales_count?: number;
  sales_amount?: number;
  review_count?: number;
  variant_count?: number;
  fees_amount?: number;
  related_products?: string[];
  product_images?: any;
  public_link?: string;
  tech_stack_price?: string;
  community_product_uuid?: string;
}

export interface CommunityProduct {
  community_product_uuid: string;
  community_uuid: string | null;
  compare_price: number | null;
  created_at: string;
  expert_uuid: string | null;
  files_link: string | null;
  id: number;
  name: string;
  payment_link: string | null;
  price: number | null;
  product_type: string | null;
  product_uuid: string | null;
}

export interface RelatedProduct {
  related_product_uuid: string;
  related_product_name: string;
  related_product_price_from: number;
  variant_uuid: string;
  variant_name: string;
  variant_price: number;
  variant_tags: any;
  variant_files_link: string;
}

export interface ProductData {
  product_uuid: string;
  name: string;
  description?: string;
  short_description?: string;
  thumbnail?: string;
  price_from?: number;
  status?: string;
  created_at?: string;
  user_uuid?: string;
  expert_uuid?: string;
  category?: any;
  platform?: any;
  industries?: any;
  use_case?: any;
  team?: any;
  demo?: string;
  product_includes?: string;
  tech_stack?: string;
  difficulty_level?: string;
  affiliate_program?: boolean;
  affiliate_information?: string;
  affiliation_amount?: number;
  accept_terms?: boolean;
  sales_count?: number;
  sales_amount?: number;
  review_count?: number;
  variant_count?: number;
  fees_amount?: number;
  related_products?: string[];
  product_images?: any;
  public_link?: string;
  tech_stack_price?: string;
  community_product_uuid?: string;
  slug?: string;
  product_files?: any;
}
