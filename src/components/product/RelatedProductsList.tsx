
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RelatedProduct {
  product_uuid: string;
  name: string;
  price_from?: number;
}

interface RelatedProductsListProps {
  productUUID: string;
  className?: string;
}

export function RelatedProductsList({ productUUID, className = "" }: RelatedProductsListProps) {
  // Fetch related products
  const { data: relatedProducts = [], isLoading, error } = useQuery<any>({
    queryKey: ['relatedProducts', productUUID],
    queryFn: async () => {
      if (!productUUID) {
        return [];
      }

      try {
        // First attempt - try the RPC function for detailed data
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_related_products_with_variants', { product_uuid_input: productUUID });
          
        if (!rpcError && rpcData && rpcData.length > 0) {
          // Transform RPC data to the format we need
          return rpcData.map(item => ({
            product_uuid: item.related_product_uuid,
            name: item.related_product_name,
            price_from: item.related_product_price_from
          }));
        }
        
        // Fallback - direct query
        const { data, error } = await supabase
          .from('product_relationships')
          .select(`
            related_product:products!product_relationships_related_product_uuid_fkey (
              product_uuid,
              name,
              price_from
            )
          `)
          .eq('product_uuid', productUUID);

        if (error) {
          console.error("Error fetching related products:", error);
          throw error;
        }

        return data.map((item) => item.related_product).filter(Boolean) || [];
      } catch (error) {
        console.error("Failed to fetch related products:", error);
        return [];
      }
    },
    enabled: Boolean(productUUID),
    retry: 3,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  if (error) {
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center text-red-800">
          Error loading related products. Please try again later.
        </div>
      </div>
    );
  }

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
          {relatedProducts.map((rel: RelatedProduct) => (
            <div
              key={rel.product_uuid}
              className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="truncate flex-1">
                <p className="font-medium truncate">{rel.name}</p>
                {rel.price_from !== undefined && rel.price_from !== null && (
                  <p className="text-sm text-muted-foreground">
                    ${rel.price_from.toFixed(2)}
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
