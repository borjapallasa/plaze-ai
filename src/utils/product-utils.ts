
import { Variant } from "@/components/product/types/variants";

export function productVariantsToVariants(productVariants: any[]): Variant[] {
  return productVariants.map(pv => ({
    id: pv.id,
    name: pv.name,
    price: pv.price,
    comparePrice: pv.comparePrice,
    highlight: pv.highlight,
    tags: pv.tags,
    filesLink: pv.filesLink,
    additionalDetails: pv.additionalDetails,
    label: pv.name
  }));
}
