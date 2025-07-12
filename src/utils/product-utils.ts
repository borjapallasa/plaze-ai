
import { Variant } from "@/components/product/types/variants";

export function productVariantsToVariants(productVariants: any[]): Variant[] {
  return productVariants.map(variant => ({
    id: variant.variant_uuid || variant.id,
    name: variant.name || "Default Option",
    price: variant.price || 0,
    comparePrice: variant.compare_price || undefined, // Make it optional
    label: variant.label,
    highlight: variant.highlight || false,
    tags: variant.tags,
    features: variant.features,
    hidden: variant.hidden || false,
    createdAt: variant.created_at,
    filesLink: variant.files_link,
    paymentLink: variant.payment_link,
    additionalDetails: variant.additional_details,
    community_product_relationship_uuid: variant.community_product_relationship_uuid
  }));
}
