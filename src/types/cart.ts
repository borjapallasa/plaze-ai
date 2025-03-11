
// Types for cart functionality
export interface CartItem {
  product_uuid: string;
  variant_uuid: string;
  price: number;
  quantity: number;
  product_name?: string;
  variant_name?: string;
}

export interface CartTransaction {
  transaction_uuid: string;
  item_count: number;
  total_amount: number;
  items: CartItem[];
}
