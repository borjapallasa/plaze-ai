
export interface Variant {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  features?: string[];
  filesLink?: string;
  paymentLink?: string;
  tags?: string[];
  community_product_relationship_uuid?: string; // Added for classroom product relationships
}
