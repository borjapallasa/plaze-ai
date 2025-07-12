
export interface Variant {
  id: string;
  name: string;
  price: number;
  comparePrice?: number; // Make this optional to match actual usage
  label?: string;
  highlight?: boolean;
  tags?: string[];
  features?: string[];
  hidden?: boolean;
  createdAt?: Date | null;
  filesLink?: string;
  paymentLink?: string;
  additionalDetails?: string;
  community_product_relationship_uuid?: string; // Added for classroom product relationships
}

export interface ProductVariantsEditorProps {
  variants?: Variant[];
  onVariantsChange?: (variants: Variant[]) => void;
  className?: string;
}

export interface VariantPickerProps {
  variants: Variant[];
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  onAddToCart?: () => void;
  className?: string;
  isLoading?: boolean;
}

export interface ProductLayoutProps {
  product: any;
  variants: Variant[];
  relatedProductsWithVariants: any[];
  selectedVariant?: string;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle?: (variantId: string, selected: boolean) => void;
  reviews: any[];
  isLoading?: boolean;
}
