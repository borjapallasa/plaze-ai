
export interface Variant {
  id: string;
  name: string;
  price: number;
  comparePrice: number;
  highlight: boolean;
  tags: string[];
  filesLink: string;
  additionalDetails: string;
  label?: string;
}

export interface ProductVariantsEditorProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  onAddVariant: () => void;
}

export interface ProductLayoutProps {
  product: any;
  variants: Variant[];
  relatedProductsWithVariants: any[];
  selectedVariant: string | null;
  averageRating: number;
  onVariantChange: (variantId: string) => void;
  onAddToCart: () => void;
  onAdditionalVariantToggle: (variantId: string) => void;
  reviews: any[];
  isLoading: boolean;
  onLeaveReview: (variantId: string) => void;
}
