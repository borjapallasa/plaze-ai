
export interface Variant {
  id: string;
  name?: string;
  price: string | number;
  comparePrice: string | number;
  highlight?: boolean;
  tags?: string[];
  label?: string;
  features?: string[];
  hidden?: boolean;
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
}
