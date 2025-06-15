
export interface Variant {
  id: string;
  name: string; // Name is required
  price: number; // Price is number
  comparePrice: number; // Compare price is number
  highlight?: boolean;
  tags?: string[];
  label: string; // Make label required to match usage
  features: string[]; // Make features required and always an array
  hidden?: boolean;
  createdAt?: string;
  filesLink?: string;
  additionalDetails?: string;
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
