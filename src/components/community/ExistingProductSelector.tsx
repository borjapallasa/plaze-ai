
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommunityProduct } from "@/types/Product";

interface ExistingProductSelectorProps {
  expertUuid: string | undefined;
  onSelect: (product: CommunityProduct) => void;
  selectedProduct: CommunityProduct | null;
}

export function ExistingProductSelector({
  expertUuid,
  onSelect,
  selectedProduct,
}: ExistingProductSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const { data: existingProducts, isLoading } = useQuery({
    queryKey: ['expertCommunityProducts', expertUuid],
    queryFn: async () => {
      if (!expertUuid) return [];
      
      const { data, error } = await supabase
        .from('community_products')
        .select('*')
        .eq('expert_uuid', expertUuid);
        
      if (error) {
        console.error('Error fetching expert community products:', error);
        throw error;
      }
      
      return data as CommunityProduct[];
    },
    enabled: !!expertUuid,
  });

  if (!expertUuid || isLoading || !existingProducts?.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Use existing product as template</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedProduct ? selectedProduct.name : "Select existing product..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {existingProducts.map((product) => (
                <CommandItem
                  key={product.community_product_uuid}
                  value={product.name || ""}
                  onSelect={() => {
                    onSelect(product);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProduct?.community_product_uuid === product.community_product_uuid
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {product.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {product.product_type === "paid" 
                      ? `$${product.price?.toFixed(2)}` 
                      : "Free"}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
