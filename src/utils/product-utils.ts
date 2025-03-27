
import { Variant } from "@/components/product/types/variants";
import { ProductVariant, CommunityProduct } from "@/types/Product";

/**
 * Converts a CommunityProduct to a Variant
 */
export function communityProductToVariant(product: CommunityProduct): Variant {
  return {
    id: product.community_product_uuid || product.variant_uuid || '',
    name: product.name || 'Product',
    price: Number(product.price) || 0,
    comparePrice: Number(product.price ? product.price * 1.25 : 0), // default higher compare price
    label: product.product_type || 'Package',
    features: Array.isArray(product.features) ? product.features : [] // Ensure features is always an array
  };
}

/**
 * Converts an array of CommunityProducts to Variants
 */
export function communityProductsToVariants(products: CommunityProduct[]): Variant[] {
  if (!products || !Array.isArray(products)) return [];
  return products.map(communityProductToVariant);
}

/**
 * Converts a ProductVariant to Variant type
 */
export function productVariantToVariant(variant: ProductVariant): Variant {
  // Make sure features is always an array, even if it's undefined or null in the source
  const features = Array.isArray(variant.features) ? variant.features : [];
  
  return {
    id: variant.id,
    name: variant.name || 'Package',
    price: Number(variant.price) || 0,
    comparePrice: Number(variant.comparePrice) || 0,
    label: variant.label || 'Package',
    highlight: variant.highlight,
    features: features
  };
}

/**
 * Converts ProductVariant array to Variant array
 */
export function productVariantsToVariants(variants: ProductVariant[]): Variant[] {
  if (!variants || !Array.isArray(variants)) return [];
  return variants.map(productVariantToVariant);
}
