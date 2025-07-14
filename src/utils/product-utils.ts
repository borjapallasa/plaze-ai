
import { Variant } from "@/components/product/types/variants";

export const productVariantsToVariants = (productVariants: any[]): Variant[] => {
  return productVariants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    price: variant.price,
    comparePrice: variant.comparePrice || 0, // Ensure comparePrice is always a number, defaulting to 0
    label: variant.label || "Package",
    highlight: variant.highlight || false,
    tags: variant.tags || [],
    features: variant.features || [],
    hidden: variant.hidden || false,
    createdAt: variant.createdAt || new Date(),
    filesLink: variant.filesLink || "",
    additionalDetails: variant.additionalDetails || "",
    community_product_relationship_uuid: variant.community_product_relationship_uuid || undefined,
  }));
};
