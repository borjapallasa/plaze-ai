import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RelatedProduct {
  product_uuid: string;
  name: string;
  price_from?: number;
}

interface ProductRelationship {
  related_product_uuid: string;
  related_product: RelatedProduct;
}

interface RelatedProductsListProps {
  productUUID: string;
  className?: string;
}

export function RelatedProductsList({ productUUID, className = "" }: RelatedProductsListProps) {
  // Fetch related products
  const { data: relatedProducts = [], isLoading } = useQuery<ProductRelationship[]>({
    queryKey: ['relatedProducts', productUUID],
    queryFn: async () => {
      if (!productUUID) {
        return [];
      }

      const { data, error } = await supabase
        .from('product_relationships')
        .select(`
          related_product_uuid,
          related_product:products!product_relationships_related_product_uuid_fkey (
            product_uuid,
            name,
            price_from
          )
        `)
        .eq('product_uuid', productUUID);

      if (error) {
        console.error("Error fetching related products:", error);
        return [];
      }

      return data.map((item) => ({
        related_product_uuid: item.related_product_uuid,
        related_product: item.related_product[0] // Ensure related_product is an object
      })) || [];
    },
    enabled: Boolean(productUUID),
  });

  if (isLoading) {
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-muted/30 rounded-md p-4 text-center text-muted-foreground">
          Loading related products...
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-base font-medium">Related Products</Label>
      {relatedProducts.length > 0 ? (
        <div className="space-y-2">
          {relatedProducts.map((rel) => (
            <div
              key={rel.related_product_uuid}
              className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="truncate flex-1">
                <p className="font-medium truncate">{rel.related_product.name}</p>
                {rel.related_product.price_from !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    ${rel.related_product.price_from.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/10 text-center">
          <p className="text-muted-foreground text-sm mb-1">No related products</p>
          <p className="text-xs text-muted-foreground max-w-[250px]">
            Add related products to help customers discover more of your offerings
          </p>
        </div>
      )}
    </div>
  );
}