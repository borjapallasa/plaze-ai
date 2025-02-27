
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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Fetch user's products (excluding the current product)
  const { data: userProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['userProducts', userUuid, productId],
    queryFn: async () => {
      if (!userUuid || !productId) return [];
      
      console.log("Fetching products for user:", userUuid);
      
      const { data, error } = await supabase
        .from('products')
        .select('product_uuid, name, price_from, slug')
        .eq('user_uuid', userUuid)
        .neq('product_uuid', productId);
      
      if (error) {
        console.error("Error fetching user products:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: Boolean(userUuid) && Boolean(productId),
  });

  // Fetch existing relationships
  const { data: relationships = [], isLoading: isLoadingRelationships } = useQuery({
    queryKey: ['productRelationships', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('product_relationships')
        .select('*')
        .eq('product_uuid', productId);
      
      if (error) {
        console.error("Error fetching product relationships:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: Boolean(productId),
  });

  // Update selected products based on relationships
  useEffect(() => {
    if (relationships.length > 0 && userProducts.length > 0) {
      const relatedProductIds = relationships.map(rel => rel.related_product_uuid);
      const relatedProducts = userProducts.filter(product => 
        relatedProductIds.includes(product.product_uuid)
      );
      setSelectedProducts(relatedProducts);
    } else {
      setSelectedProducts([]);
    }
  }, [relationships, userProducts]);

  // Add a related product
  const addRelatedProduct = async (productToAdd: Product) => {
    try {
      // Check if the relationship already exists
      if (selectedProducts.some(p => p.product_uuid === productToAdd.product_uuid)) {
        toast({
          title: "Already added",
          description: "This product is already in your related products",
          variant: "default",
        });
        return;
      }

      // Add the relationship to the database
      const { error } = await supabase
        .from('product_relationships')
        .insert({
          product_uuid: productId,
          related_product_uuid: productToAdd.product_uuid,
          relationship_type: 'related',
          display_order: selectedProducts.length
        });
      
      if (error) throw error;
      
      // Update the UI
      setSelectedProducts(prev => [...prev, productToAdd]);
      
      // Refresh data
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
    try {
      const { error } = await supabase
        .from('product_relationships')
        .delete()
        .eq('product_uuid', productId)
        .eq('related_product_uuid', relatedProductId);
      
      if (error) throw error;
      
      // Update the UI
      setSelectedProducts(prev => prev.filter(p => p.product_uuid !== relatedProductId));
      
      // Refresh data
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
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-muted/30 rounded-md p-4 text-center text-muted-foreground">
          Loading product relationships...
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Related Products</Label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Product</span>
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search products..." />
              <CommandEmpty>No products found</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {userProducts.map((product) => (
                  <CommandItem
                    key={product.product_uuid}
                    value={product.name}
                    onSelect={() => {
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
                        selectedProducts.some(p => p.product_uuid === product.product_uuid) 
                          ? "opacity-100" 
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedProducts.length > 0 ? (
        <div className="space-y-2">
          {selectedProducts.map((product) => (
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
                onClick={() => removeRelatedProduct(productId, product.product_uuid)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
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
