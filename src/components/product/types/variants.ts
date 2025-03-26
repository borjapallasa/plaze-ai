
export interface Variant {
  id: string;
  name: string; // Make name required
  price: string | number;
  comparePrice: string | number;
  highlight?: boolean;
  tags?: string[];
  label?: string;
  features?: string[];
  hidden?: boolean;
  createdAt?: string;
  filesLink?: string;
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
