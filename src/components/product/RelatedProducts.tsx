
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  slug?: string;
}

interface ProductRelationship {
  id: number;
  product_uuid: string;
  related_product_uuid: string;
  display_order: number;
  relationship_type: string;
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
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Fetch related product relationships from the new table
  const { 
    data: relationships = [], 
    isLoading: isLoadingRelationships 
  } = useQuery({
    queryKey: ['productRelationships', productId],
    queryFn: async () => {
      if (!productId || productId === ":id") return [];
      
      const { data, error } = await supabase
        .from('product_relationships')
        .select('*')
        .eq('product_uuid', productId);
      
      if (error) {
        console.error("Error fetching product relationships:", error);
        return [];
      }
      
      return data as ProductRelationship[];
    },
    enabled: Boolean(productId) && productId !== ":id",
  });

  // Extract the selected IDs from the relationships
  useEffect(() => {
    if (relationships.length > 0) {
      const relatedIds = relationships.map(rel => rel.related_product_uuid);
      setSelectedIds(relatedIds);
    } else if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
      // Fallback to the passed relatedProducts for backward compatibility
      setSelectedIds([...relatedProducts]);
    } else {
      setSelectedIds([]);
    }
  }, [relationships, relatedProducts]);

  // First, fetch all the expert's products (more efficient than multiple small queries)
  const { 
    data: expertProducts = [], 
    isLoading: isLoadingProducts
  } = useQuery({
    queryKey: ['expertProducts', expertUuid],
    queryFn: async () => {
      if (!expertUuid) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('product_uuid, name, price_from, slug')
        .eq('expert_uuid', expertUuid);
      
      if (error) {
        console.error("Error fetching expert products:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: Boolean(expertUuid),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter out the current product from potential related products
  const availableProducts = useMemo(() => {
    return expertProducts.filter(p => p.product_uuid !== productId);
  }, [expertProducts, productId]);

  // Get already selected products for display
  const selectedProducts = useMemo(() => {
    return expertProducts.filter(p => selectedIds.includes(p.product_uuid));
  }, [expertProducts, selectedIds]);
  
  // For products that are selected but not found in expertProducts (might happen during initial load)
  const missingProductIds = useMemo(() => {
    return selectedIds.filter(id => !expertProducts.some(p => p.product_uuid === id));
  }, [selectedIds, expertProducts]);

  // Fetch any missing product details if needed
  const { data: missingProducts = [] } = useQuery({
    queryKey: ['missingProducts', missingProductIds],
    queryFn: async () => {
      if (missingProductIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('product_uuid, name, price_from, slug')
        .in('product_uuid', missingProductIds);
      
      if (error) {
        console.error("Error fetching missing products:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: missingProductIds.length > 0
  });

  // Update cache manually when missing products are fetched
  useEffect(() => {
    if (missingProducts.length > 0) {
      queryClient.setQueryData(['expertProducts', expertUuid], 
        (oldData: Product[] = []) => {
          if (!oldData) return [...missingProducts];
          // Filter out duplicates
          const existingIds = new Set(oldData.map(p => p.product_uuid));
          const newProducts = missingProducts.filter(p => !existingIds.has(p.product_uuid));
          return [...oldData, ...newProducts];
        }
      );
    }
  }, [missingProducts, queryClient, expertUuid]);

  // Combine all products for display
  const allDisplayProducts = useMemo(() => {
    return [...selectedProducts, ...missingProducts];
  }, [selectedProducts, missingProducts]);

  // Toggle a product selection
  const toggleProduct = async (id: string) => {
    try {
      if (productId === ":id") {
        // Just update the local state if we don't have a real product ID yet
        const newSelection = selectedIds.includes(id)
          ? selectedIds.filter(selectedId => selectedId !== id)
          : [...selectedIds, id];
        
        setSelectedIds(newSelection);
        onRelatedProductsChange(newSelection);
        return;
      }
      
      if (selectedIds.includes(id)) {
        // Remove the relationship
        const { error } = await supabase
          .from('product_relationships')
          .delete()
          .eq('product_uuid', productId)
          .eq('related_product_uuid', id);
          
        if (error) throw error;
        
        // Update local state
        const newSelection = selectedIds.filter(selectedId => selectedId !== id);
        setSelectedIds(newSelection);
        onRelatedProductsChange(newSelection);
        
        // Update cache
        queryClient.setQueryData(
          ['productRelationships', productId],
          (oldData: ProductRelationship[] = []) => 
            oldData.filter(rel => rel.related_product_uuid !== id)
        );
      } else {
        // Add the relationship
        const { data, error } = await supabase
          .from('product_relationships')
          .insert({
            product_uuid: productId,
            related_product_uuid: id,
            relationship_type: 'related',
            display_order: selectedIds.length // Use the current count as order
          })
          .select();
          
        if (error) throw error;
        
        // Update local state
        const newSelection = [...selectedIds, id];
        setSelectedIds(newSelection);
        onRelatedProductsChange(newSelection);
        
        // Update cache
        queryClient.setQueryData(
          ['productRelationships', productId],
          (oldData: ProductRelationship[] = []) => [...(oldData || []), ...(data || [])]
        );
      }
    } catch (error) {
      console.error("Error toggling product relationship:", error);
      toast({
        title: "Error",
        description: "Failed to update related products",
        variant: "destructive",
      });
    }
  };

  // Remove a product from selection
  const removeProduct = async (id: string) => {
    try {
      if (productId === ":id") {
        // Just update the local state if we don't have a real product ID yet
        const newSelection = selectedIds.filter(selectedId => selectedId !== id);
        setSelectedIds(newSelection);
        onRelatedProductsChange(newSelection);
        return;
      }
      
      // Remove the relationship
      const { error } = await supabase
        .from('product_relationships')
        .delete()
        .eq('product_uuid', productId)
        .eq('related_product_uuid', id);
        
      if (error) throw error;
      
      // Update local state
      const newSelection = selectedIds.filter(selectedId => selectedId !== id);
      setSelectedIds(newSelection);
      onRelatedProductsChange(newSelection);
      
      // Update cache
      queryClient.setQueryData(
        ['productRelationships', productId],
        (oldData: ProductRelationship[] = []) => 
          oldData.filter(rel => rel.related_product_uuid !== id)
      );
      
      toast({
        title: "Product removed",
        description: "Related product has been removed",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error removing product relationship:", error);
      toast({
        title: "Error",
        description: "Failed to remove related product",
        variant: "destructive",
      });
    }
  };

  // If product ID is a placeholder, show a disabled state
  if (productId === ":id") {
    return (
      <div className={className}>
        <h3 className="text-lg font-medium mb-2">Related Products</h3>
        <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 text-center">
          <p className="text-muted-foreground">
            Save product first to add related products
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoadingRelationships || isLoadingProducts) {
    return (
      <div className={className}>
        <h3 className="text-lg font-medium mb-2">Related Products</h3>
        <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30 text-center">
          <p className="text-muted-foreground">Loading related products...</p>
        </div>
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
                {isLoadingProducts 
                  ? "Loading products..." 
                  : "No products found"}
              </CommandEmpty>
              
              <CommandGroup className="max-h-[300px] overflow-auto">
                {availableProducts.length > 0 ? (
                  availableProducts.map((product) => (
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
                    {isLoadingProducts 
                      ? "Loading products..." 
                      : "No other products available"}
                  </CommandItem>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Selected products grid */}
      {allDisplayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allDisplayProducts.map(product => (
            <Card 
              key={product.product_uuid}
              className="overflow-hidden border bg-card transition-all hover:shadow-md"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1 mr-2">
                  <div className="font-medium truncate">
                    {product.name || `Product ${product.product_uuid.slice(0, 8)}...`}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ${product.price_from?.toFixed(2) || '0.00'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeProduct(product.product_uuid)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => {
                      if (product.slug) {
                        window.open(`/products/${product.slug}`, '_blank');
                      }
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
