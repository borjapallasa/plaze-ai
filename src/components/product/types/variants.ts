
export interface Variant {
  id: string;
  name?: string;
  price: string | number;
  comparePrice: string | number;
  highlight?: boolean;
  tags?: string[];
  label?: string;
  features?: string[];
}

export interface ProductVariantsProps {
  variants?: Variant[];
  onVariantsChange?: (variants: Variant[]) => void;
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
  onAddToCart?: () => void;
  className?: string;
}
