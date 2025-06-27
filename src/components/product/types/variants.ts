export interface Variant {
  id: string;
  name: string; // Name is required
  price: number; // Price is number
  comparePrice: number; // Compare price is number
  label: string; // Make label required to match usage
  highlight: boolean;
  tags: string[]; // Make tags required and always an array
  features: string[]; // Make features required and always an array
  hidden: boolean;
  createdAt: Date | null;
  filesLink: string | null;
  relationshipUuid?: string; // Add this optional field
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
