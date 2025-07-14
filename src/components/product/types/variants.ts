
export interface Variant {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  label?: string;
  highlight?: boolean;
  tags?: string[];
  filesLink?: string;
  additionalDetails?: string;
  description?: string;
  features?: string[];
}

export interface ProductVariant extends Variant {
  // Add any additional properties specific to product variants
}
