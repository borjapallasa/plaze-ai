
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Product {
  product_uuid: string;
  name: string;
  price_from?: number;
  slug?: string;
}

interface ProductRelationship {
  relationship_uuid: string;
  product_uuid: string;
  related_product_uuid: string;
  display_order: number;
  relationship_type: string;
}

interface RelatedProductsProps {
  productId: string;
  userUuid: string;
  className?: string;
}

export function RelatedProducts({
  productId,
  userUuid,
  className
}: RelatedProductsProps) {
  console.log("RelatedProducts component initialized with:", { productId, userUuid });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Fetch user's products (excluding the current product)
  const { data: userProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['userProducts', userUuid, productId],
    queryFn: async () => {
      if (!userUuid || !productId) {
        console.log("Missing userUuid or productId, skipping user products fetch");
        return [];
      }
      
      console.log("Fetching products for user:", userUuid, "excluding product:", productId);
      
      const { data, error } = await supabase
        .from('products')
        .select('product_uuid, name, price_from, slug')
        .eq('user_uuid', userUuid)
        .neq('product_uuid', productId);
      
      if (error) {
        console.error("Error fetching user products:", error);
        throw error;
      }
      
      console.log("Fetched user products:", data?.length || 0, "products");
      console.log("Sample product data:", data?.[0]);
      return data || [];
    },
    enabled: Boolean(userUuid) && Boolean(productId),
  });

  // Fetch existing relationships
  const { data: relationships = [], isLoading: isLoadingRelationships } = useQuery({
    queryKey: ['productRelationships', productId],
    queryFn: async () => {
      if (!productId) {
        console.log("Missing productId, skipping relationships fetch");
        return [];
      }
      
      console.log("Fetching relationships for product:", productId);
      
      const { data, error } = await supabase
        .from('product_relationships')
        .select('*')
        .eq('product_uuid', productId);
      
      if (error) {
        console.error("Error fetching product relationships:", error);
        throw error;
      }
      
      console.log("Fetched relationships:", data?.length || 0, "relationships");
      console.log("Relationship data:", data);
      return data || [];
    },
    enabled: Boolean(productId),
  });

  // Update selected products based on relationships
  useEffect(() => {
    console.log("useEffect triggered - relationships or userProducts changed");
    console.log("Current relationships:", relationships.length);
    console.log("Available user products:", userProducts.length);
    
    if (relationships.length > 0 && userProducts.length > 0) {
      const relatedProductIds = relationships.map(rel => rel.related_product_uuid);
      console.log("Related product IDs from relationships:", relatedProductIds);
      
      const relatedProducts = userProducts.filter(product => 
        relatedProductIds.includes(product.product_uuid)
      );
      
      console.log("Filtered related products:", relatedProducts.length);
      setSelectedProducts(relatedProducts);
    } else {
      console.log("No relationships or user products available, clearing selected products");
      setSelectedProducts([]);
    }
  }, [relationships, userProducts]);

  // Add a related product
  const addRelatedProduct = async (productToAdd: Product) => {
    console.log("Adding related product:", productToAdd);
    
    try {
      // Check if the relationship already exists
      if (selectedProducts.some(p => p.product_uuid === productToAdd.product_uuid)) {
        console.log("Product already exists in relationships, skipping");
        toast({
          title: "Already added",
          description: "This product is already in your related products",
          variant: "default",
        });
        return;
      }

      console.log("Inserting new relationship:", {
        product_uuid: productId,
        related_product_uuid: productToAdd.product_uuid
      });

      // Add the relationship to the database
      const { data, error } = await supabase
        .from('product_relationships')
        .insert({
          product_uuid: productId,
          related_product_uuid: productToAdd.product_uuid,
          relationship_type: 'related',
          display_order: selectedProducts.length
        });
      
      if (error) {
        console.error("Error inserting relationship:", error);
        throw error;
      }
      
      console.log("Relationship inserted successfully:", data);
      
      // Update the UI
      console.log("Updating selected products state");
      setSelectedProducts(prev => {
        const updated = [...prev, productToAdd];
        console.log("New selected products:", updated);
        return updated;
      });
      
      // Refresh data
      console.log("Invalidating relationships query cache");
      queryClient.invalidateQueries({ queryKey: ['productRelationships', productId] });
      
      toast({
        title: "Product added",
        description: "Related product has been added successfully",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error adding related product:', error);
      toast({
        title: "Error",
        description: "Failed to add related product",
        variant: "destructive",
      });
    }
  };

  // Remove a related product
  const removeRelatedProduct = async (productId: string, relatedProductId: string) => {
    console.log("Removing related product relationship:", {
      product_uuid: productId,
      related_product_uuid: relatedProductId
    });
    
    try {
      console.log("Deleting relationship from database");
      const { data, error } = await supabase
        .from('product_relationships')
        .delete()
        .eq('product_uuid', productId)
        .eq('related_product_uuid', relatedProductId);
      
      if (error) {
        console.error("Error deleting relationship:", error);
        throw error;
      }
      
      console.log("Delete successful, response:", data);
      
      // Update the UI
      console.log("Updating selected products state");
      setSelectedProducts(prev => {
        const filtered = prev.filter(p => p.product_uuid !== relatedProductId);
        console.log("Products after removal:", filtered);
        return filtered;
      });
      
      // Refresh data
      console.log("Invalidating relationships query cache");
      queryClient.invalidateQueries({ queryKey: ['productRelationships', productId] });
      
      toast({
        title: "Product removed",
        description: "Related product has been removed",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error removing related product:', error);
      toast({
        title: "Error",
        description: "Failed to remove related product",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProducts || isLoadingRelationships) {
    console.log("Loading state - products:", isLoadingProducts, "relationships:", isLoadingRelationships);
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-muted/30 rounded-md p-4 text-center text-muted-foreground">
          Loading product relationships...
        </div>
      </div>
    );
  }

  console.log("Rendering RelatedProducts component with:", {
    productId,
    selectedProducts: selectedProducts.length,
    availableProducts: userProducts.length
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Related Products</Label>
        
        <Popover open={open} onOpenChange={(newOpen) => {
          console.log("Popover state changing to:", newOpen);
          setOpen(newOpen);
        }}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product</span>
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search products..." onInput={(e) => {
                console.log("Searching products:", (e.target as HTMLInputElement).value);
              }} />
              <CommandEmpty>No products found</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {userProducts.map((product) => {
                  const isSelected = selectedProducts.some(p => p.product_uuid === product.product_uuid);
                  console.log("Rendering product option:", product.name, "selected:", isSelected);
                  
                  return (
                    <CommandItem
                      key={product.product_uuid}
                      value={product.name}
                      onSelect={() => {
                        console.log("Product selected from dropdown:", product.name);
                        addRelatedProduct(product);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${product.price_from?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedProducts.length > 0 ? (
        <div className="space-y-2">
          {selectedProducts.map((product) => {
            console.log("Rendering selected product:", product.name);
            
            return (
              <div 
                key={product.product_uuid}
                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="truncate flex-1">
                  <p className="font-medium truncate">{product.name}</p>
                  {product.price_from !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      ${product.price_from.toFixed(2)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log("Remove button clicked for product:", product.name);
                    removeRelatedProduct(productId, product.product_uuid);
                  }}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            );
          })}
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
