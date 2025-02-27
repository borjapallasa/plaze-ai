
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Check, Plus, X, ChevronRight } from "lucide-react";

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Related Products</h3>
        
        {/* Product selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="flex items-center gap-1"
              type="button"
            >
              <Plus className="h-4 w-4" />
              <span>{selectedIds.length > 0 ? "Add More" : "Add Products"}</span>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search products..." />
              
              <CommandEmpty>
                {isLoading 
                  ? "Loading products..." 
                  : error 
                    ? "Error loading products" 
                    : "No products found"}
              </CommandEmpty>
              
              <CommandGroup className="max-h-[300px] overflow-auto">
                {potentialProducts.length > 0 ? (
                  potentialProducts.map((product) => (
                    <CommandItem
                      key={product.product_uuid}
                      value={product.product_uuid}
                      onSelect={() => toggleProduct(product.product_uuid)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">
                          {product.name}
                        </span>
                        
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">
                            ${product.price_from?.toFixed(2) || '0.00'}
                          </span>
                          
                          {selectedIds.includes(product.product_uuid) ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Plus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
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
      </div>
      
      {/* Selected products grid */}
      {selectedIds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedIds.map(id => {
            const product = potentialProducts.find(p => p.product_uuid === id);
            
            return (
              <Card 
                key={id}
                className="overflow-hidden border bg-card transition-all hover:shadow-md"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <div className="font-medium truncate">
                      {product?.name || `Product ${id.slice(0, 8)}...`}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ${product?.price_from?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeProduct(id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 text-center">
          <div className="text-muted-foreground mb-2">No related products selected</div>
          <p className="text-sm text-muted-foreground max-w-md">
            Add related products to help customers discover more of your offerings
          </p>
        </div>
      )}
    </div>
  );
}
