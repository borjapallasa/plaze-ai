
export interface CartItem {
  product_uuid: string | null;
  variant_uuid: string;
  price: number;
  quantity: number;
  product_name?: string;
  variant_name?: string;
  is_available?: boolean; // Flag to indicate if the product/variant is still available
}

export interface CartTransaction {
  transaction_uuid: string;
  item_count: number;
  total_amount: number;
  items: CartItem[];
}
