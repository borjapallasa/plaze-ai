
export interface CartItem {
  product_uuid: string | null;
  variant_uuid: string;
  price: number;
  quantity: number;
  product_name?: string;
  variant_name?: string;
  is_available?: boolean; // Flag to indicate if the product/variant is still available
  last_updated?: number; // Timestamp to track the most recent update
  product_type?: string; // Type of product (community, default, regular)
}

export interface CartTransaction {
  transaction_uuid: string;
  item_count: number;
  total_amount: number;
  items: CartItem[];
  last_fetched?: number; // Timestamp to track when the cart was last fetched
}
