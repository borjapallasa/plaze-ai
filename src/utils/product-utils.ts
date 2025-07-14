
import { Variant } from "@/components/product/types/variants";
import { ProductVariant } from "@/types/Product";

export function productVariantsToVariants(productVariants: ProductVariant[]): Variant[] {
  return productVariants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    price: variant.price,
    comparePrice: variant.comparePrice, // Make sure comparePrice is passed through
    label: variant.label,
    highlight: variant.highlight,
    tags: variant.tags,
    features: variant.features,
    hidden: variant.hidden,
    createdAt: variant.createdAt,
    filesLink: variant.filesLink,
    paymentLink: variant.paymentLink,
    additionalDetails: variant.additionalDetails,
    community_product_relationship_uuid: variant.community_product_relationship_uuid
  }));
}
