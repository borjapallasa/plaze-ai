
import { Variant } from "@/components/product/types/variants";

/**
 * Converts a CommunityProduct to a Variant
 */
export function communityProductToVariant(product: any): Variant {
  return {
    id: product.community_product_uuid || product.variant_uuid || '',
    name: product.name || 'Product',
    price: product.price || 0,
    comparePrice: product.comparePrice || product.price ? product.price * 1.25 : 0, // default higher compare price
    label: product.product_type || 'Package',
    features: product.features || []
  };
}

/**
 * Converts an array of CommunityProducts to Variants
 */
export function communityProductsToVariants(products: any[]): Variant[] {
  if (!products || !Array.isArray(products)) return [];
  return products.map(communityProductToVariant);
}
