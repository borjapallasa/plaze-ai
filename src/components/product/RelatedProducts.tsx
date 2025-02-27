
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
  relatedProducts = null,
  onRelatedProductsChange,
  className,
}: RelatedProductsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Safely initialize from relatedProducts
  useEffect(() => {
    setSelectedIds(Array.isArray(relatedProducts) ? [...relatedProducts] : []);
  }, [relatedProducts]);

  // Fetch potential related products
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['relatedProductOptions', expertUuid, productId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('product_uuid, name, price_from')
          .eq('expert_uuid', expertUuid)
          .neq('product_uuid', productId);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching related products:", err);
        return [];
      }
    },
    enabled: Boolean(expertUuid) && productId !== ':id',
  });

  const potentialProducts = data || [];

  // Update selected products
  const toggleProduct = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    
    setSelectedIds(newSelection);
    onRelatedProductsChange(newSelection);
  };

  // Remove product from selection
  const removeProduct = (id: string) => {
    const newSelection = selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelection);
    onRelatedProductsChange(newSelection);
  };

  // If product ID is a placeholder, show a disabled state
  if (productId === ":id") {
    return (
      <div className={className}>
        <h3 className="text-sm font-medium mb-1.5">Related Products</h3>
        <Button
          variant="outline"
          className="w-full justify-between opacity-70"
          type="button"
          disabled
        >
          Save product first to add related products
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-1.5">Related Products</h3>
      
      {/* Product selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
          >
            {selectedIds.length > 0
              ? `${selectedIds.length} product${selectedIds.length !== 1 ? 's' : ''} selected` 
              : "Select related products"}
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search products..." />
            
            <CommandEmpty>
              {isLoading 
                ? "Loading products..." 
                : error 
                  ? "Error loading products" 
                  : "No products found"}
            </CommandEmpty>
            
            <CommandGroup>
              {potentialProducts.length > 0 ? (
                potentialProducts.map((product) => (
                  <CommandItem
                    key={product.product_uuid}
                    value={product.product_uuid}
                    onSelect={() => toggleProduct(product.product_uuid)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>
                        {product.name}
                        <span className="ml-2 text-sm text-muted-foreground">
                          ${product.price_from?.toFixed(2) || '0.00'}
                        </span>
                      </span>
                      
                      {selectedIds.includes(product.product_uuid) && (
                        <Check className="h-4 w-4 text-primary ml-2" />
                      )}
                    </div>
                  </CommandItem>
                ))
              ) : (
                <CommandItem value="no-products" disabled>
                  {isLoading ? "Loading products..." : "No products available"}
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Selected products list */}
      {selectedIds.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedIds.map(id => {
            const product = potentialProducts.find(p => p.product_uuid === id);
            
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
                  onClick={() => removeProduct(id)}
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
