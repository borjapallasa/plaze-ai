
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
  hidden?: boolean;
  createdAt?: Date;
}

export interface ProductVariant extends Variant {
  // Add any additional properties specific to product variants
}

export interface ProductVariantsEditorProps {
  variants?: Variant[];
  onVariantsChange?: (variants: Variant[]) => void;
  className?: string;
}

export interface ProductLayoutProps {
  product: any;
  variants: Variant[];
  selectedVariant: Variant | null;
  relatedProductsWithVariants: any[];
  averageRating: number;
  onVariantChange: (variant: Variant) => void;
  onAddToCart: (variant: Variant, additionalVariants?: Variant[]) => void;
  onAdditionalVariantToggle?: (variantId: string, selected: boolean) => void;
  reviews: any[];
  isLoading?: boolean;
}
