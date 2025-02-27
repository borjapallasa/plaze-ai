
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
  console.log("RelatedProducts - Component Rendering with props:", { 
    productId, 
    expertUuid, 
    relatedProducts: relatedProducts ? `Array of ${relatedProducts.length} items` : 'null or undefined',
    className 
  });
  
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Initialize selected IDs from props
  useEffect(() => {
    console.log("RelatedProducts - useEffect for relatedProducts:", {
      relatedProducts,
      isArray: Array.isArray(relatedProducts),
      type: typeof relatedProducts
    });
    
    if (relatedProducts && Array.isArray(relatedProducts)) {
      console.log("RelatedProducts - Setting selectedIds from relatedProducts:", relatedProducts);
      setSelectedIds([...relatedProducts]);
    } else {
      console.log("RelatedProducts - Setting selectedIds to empty array");
      setSelectedIds([]);
    }
  }, [relatedProducts]);

  // Fetch potential related products
  const { data: potentialProducts = [], isLoading, error } = useQuery({
    queryKey: ['relatedProductOptions', expertUuid, productId],
    queryFn: async () => {
      console.log("RelatedProducts - Fetching products for expert:", expertUuid);
      
      if (!expertUuid) {
        console.log("RelatedProducts - No expertUuid provided, returning empty array");
        return [];
      }
      
      // Skip if productId is a route parameter placeholder
      if (productId === ":id") {
        console.log("RelatedProducts - productId is a placeholder (:id), returning empty array");
        return [];
      }
      
      try {
        console.log("RelatedProducts - Executing Supabase query");
        const { data, error } = await supabase
          .from('products')
          .select('product_uuid, name, price_from')
          .eq('expert_uuid', expertUuid)
          .neq('product_uuid', productId);
        
        if (error) {
          console.error("RelatedProducts - Error fetching related products:", error);
          throw error;
        }
        
        console.log(`RelatedProducts - Query successful, found ${data?.length || 0} products:`, data);
        return data || [];
      } catch (err) {
        console.error("RelatedProducts - Exception in query:", err);
        return [];
      }
    },
    enabled: !!expertUuid && productId !== ":id",
  });

  // Log when potential products change
  useEffect(() => {
    console.log("RelatedProducts - potentialProducts updated:", {
      count: potentialProducts?.length || 0,
      isArray: Array.isArray(potentialProducts),
      isEmpty: !potentialProducts || potentialProducts.length === 0
    });
  }, [potentialProducts]);

  // Add or remove product from selection
  const toggleProduct = (id: string) => {
    console.log("RelatedProducts - toggleProduct called with id:", id);
    console.log("RelatedProducts - Current selectedIds:", selectedIds);
    
    let newSelection: string[];
    
    if (selectedIds.includes(id)) {
      console.log("RelatedProducts - Removing product from selection");
      newSelection = selectedIds.filter(selectedId => selectedId !== id);
    } else {
      console.log("RelatedProducts - Adding product to selection");
      newSelection = [...selectedIds, id];
    }
    
    console.log("RelatedProducts - New selection:", newSelection);
    setSelectedIds(newSelection);
    onRelatedProductsChange(newSelection);
  };

  // Remove product from selection
  const removeProduct = (id: string) => {
    console.log("RelatedProducts - removeProduct called with id:", id);
    console.log("RelatedProducts - Current selectedIds:", selectedIds);
    
    const newSelection = selectedIds.filter(selectedId => selectedId !== id);
    console.log("RelatedProducts - New selection after removal:", newSelection);
    
    setSelectedIds(newSelection);
    onRelatedProductsChange(newSelection);
  };

  console.log("RelatedProducts - Before render, selectedIds:", selectedIds);

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
      <Popover open={open} onOpenChange={(newOpen) => {
        console.log("RelatedProducts - Popover state changing to:", newOpen);
        setOpen(newOpen);
      }}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            type="button"
            onClick={() => console.log("RelatedProducts - PopoverTrigger clicked")}
          >
            {selectedIds.length 
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
              {Array.isArray(potentialProducts) && potentialProducts.length > 0 ? (
                potentialProducts.map((product: Product) => (
                  <CommandItem
                    key={product.product_uuid}
                    value={product.product_uuid}
                    onSelect={() => {
                      console.log("RelatedProducts - CommandItem selected:", product.product_uuid);
                      toggleProduct(product.product_uuid);
                    }}
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
            const product = Array.isArray(potentialProducts) 
              ? potentialProducts.find((p: Product) => p.product_uuid === id)
              : undefined;
            
            console.log("RelatedProducts - Rendering selected product:", { id, foundProduct: !!product });
            
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
