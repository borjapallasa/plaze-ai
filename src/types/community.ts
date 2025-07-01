
export interface Community {
  community_uuid: string;
  name: string;
  description: string;
  intro?: string;
  type: "free" | "paid" | "private";
  price: number;
  member_count: number;
  paid_member_count?: number;
  monthly_recurring_revenue?: number;
  total_revenue?: number;
  post_count?: number;
  classroom_count?: number;
  product_count?: number;
  status: string;
  created_at: string;
  last_activity: string;
  thumbnail?: string;
  expert_thumbnail?: string;
  slug?: string;
  title?: string;
  visibility?: "public" | "private";
  billing_period?: "monthly" | "yearly";
  affiliate_program?: boolean;
  threads_tags?: any;
  links?: any;
  user_uuid?: string;
  expert_uuid?: string;
  community_price_uuid?: string;
  webhook?: string;
  active_product_id?: string;
  active_price_id?: string;
  payment_link?: string;
}

export interface CommunityCardProps {
  name: string;
  member_count: number;
  status: string;
  created_at: string;
  thumbnail: string;
  community_uuid: string;
}
