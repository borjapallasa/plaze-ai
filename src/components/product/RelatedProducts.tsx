
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
import { useToast } from "@/components/ui/use-toast";
import { Check, Plus, X } from "lucide-react";

interface Product {
  name: string;
  price_from: number;
  product_uuid: string;
}

interface RelatedProductsProps {
  productId: string;
  expertUuid: string;
  relatedProducts: string[] | null;
  onRelatedProductsChange: (productIds: string[]) => void;
  className?: string;
}

export function RelatedProducts({
  productId,
  expertUuid,
  relatedProducts,
  onRelatedProductsChange,
  className,
}: RelatedProductsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  // Initialize with empty array, not depending on relatedProducts which might be null
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // When related products prop changes, update local state
  useEffect(() => {
    // Handle the case where relatedProducts is null, undefined, or not an array
    if (Array.isArray(relatedProducts)) {
      setSelectedProductIds([...relatedProducts]);
    } else {
      // Ensure we always have an array, even if empty
      setSelectedProductIds([]);
    }
  }, [relatedProducts]);

  // Fetch products with same expert_uuid
  const { data, isLoading, error } = useQuery({
    queryKey: ['relatedProductOptions', expertUuid],
    queryFn: async () => {
      console.log('Fetching products for expert:', expertUuid);
      if (!expertUuid) return [];

      const { data, error } = await supabase
        .from('products')
        .select('product_uuid, name, price_from')
        .eq('expert_uuid', expertUuid)
        .neq('product_uuid', productId || ''); // Exclude current product
      
      if (error) {
        console.error("Error fetching related products:", error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} potential related products`);
      return data || [];
    },
    enabled: !!expertUuid,
  });

  // Update local state when query data changes
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAvailableProducts([...data]);
    } else {
      // Ensure we always have an array, even if empty
      setAvailableProducts([]);
    }
  }, [data]);

  // Handle selection of a product
  const handleSelect = (productId: string) => {
    if (!productId) return;
    
    const isSelected = selectedProductIds.includes(productId);
    let newSelectedIds: string[];
    
    if (isSelected) {
      newSelectedIds = selectedProductIds.filter(id => id !== productId);
    } else {
      newSelectedIds = [...selectedProductIds, productId];
    }
    
    setSelectedProductIds(newSelectedIds);
    onRelatedProductsChange(newSelectedIds);
    
    // Close the popover after selection
    setOpen(false);
  };

  // Handle removing a product from the selected list
  const handleRemove = (productId: string) => {
    if (!productId) return;
    
    const newSelectedIds = selectedProductIds.filter(id => id !== productId);
    setSelectedProductIds(newSelectedIds);
    onRelatedProductsChange(newSelectedIds);
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-1.5">Related Products</h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            type="button"
            className="w-full justify-between"
          >
            {selectedProductIds.length > 0 
              ? `${selectedProductIds.length} product${selectedProductIds.length > 1 ? 's' : ''} selected`
              : "Select related products"}
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandEmpty>
              {error ? "Error loading products" : isLoading ? "Loading..." : "No products found"}
            </CommandEmpty>
            <CommandGroup>
              {availableProducts && availableProducts.length > 0 ? availableProducts.map((product) => (
                <CommandItem
                  key={product.product_uuid}
                  value={product.product_uuid}
                  onSelect={handleSelect}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span>{product.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ${product.price_from?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    {selectedProductIds.includes(product.product_uuid) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CommandItem>
              )) : null}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected products - only show if we have selections */}
      {selectedProductIds && selectedProductIds.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedProductIds.map(id => {
            // Find the corresponding product details if available
            const product = availableProducts && availableProducts.length > 0 
              ? availableProducts.find(p => p.product_uuid === id) 
              : undefined;
              
            return (
              <div 
                key={id}
                className="flex items-center justify-between px-3 py-2 text-sm bg-secondary/20 rounded-md"
              >
                <div className="truncate">
                  {product?.name || `Product ${id.slice(0, 8)}...`}
                  {product && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ${product.price_from?.toFixed(2) || '0.00'}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
