
import React, { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Check, Plus, X, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  name: string;
  price_from: number;
  product_uuid: string;
  slug?: string;
}

interface ProductRelationship {
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch user's products
  const { data: userProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['userProducts', userUuid],
    queryFn: async () => {
      if (!userUuid) return [];
      
      console.log("Fetching products for user:", userUuid);
      
      const { data, error } = await supabase
        .from('products')
        .select('product_uuid, name, price_from, slug')
        .eq('user_uuid', userUuid);
      
      if (error) {
        console.error("Error fetching user products:", error);
        return [];
      }
      
      return (data || []).filter(p => p.product_uuid !== productId);
    },
    enabled: Boolean(userUuid),
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
        return [];
      }
      
      setSelectedIds(data.map(rel => rel.related_product_uuid));
      return data;
    },
    enabled: Boolean(productId),
  });

  // Toggle product selection
  const toggleProduct = async (id: string) => {
    try {
      if (selectedIds.includes(id)) {
        // Remove relationship
        const { error } = await supabase
          .from('product_relationships')
          .delete()
          .eq('product_uuid', productId)
          .eq('related_product_uuid', id);
          
        if (error) throw error;
        
        setSelectedIds(prev => prev.filter(prevId => prevId !== id));
        
        toast({
          title: "Product removed",
          description: "Related product has been removed",
          duration: 3000,
        });
      } else {
        // Add relationship
        const { error } = await supabase
          .from('product_relationships')
          .insert({
            product_uuid: productId,
            related_product_uuid: id,
            relationship_type: 'related',
            display_order: selectedIds.length
          });
          
        if (error) throw error;
        
        setSelectedIds(prev => [...prev, id]);
        
        toast({
          title: "Product added",
          description: "Related product has been added",
          duration: 3000,
        });
      }
      
      // Refresh relationships data
      queryClient.invalidateQueries({ queryKey: ['productRelationships', productId] });
      
    } catch (error) {
      console.error('Error toggling product relationship:', error);
      toast({
        title: "Error",
        description: "Failed to update related products",
        variant: "destructive",
      });
    }
  };

  // Remove a relationship
  const removeRelationship = async (relatedProductId: string) => {
    try {
      const { error } = await supabase
        .from('product_relationships')
        .delete()
        .eq('product_uuid', productId)
        .eq('related_product_uuid', relatedProductId);
      
      if (error) throw error;
      
      setSelectedIds(prev => prev.filter(id => id !== relatedProductId));
      queryClient.invalidateQueries({ queryKey: ['productRelationships', productId] });
      
      toast({
        title: "Removed",
        description: "Product relationship removed successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing relationship:', error);
      toast({
        title: "Error",
        description: "Failed to remove relationship",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProducts || isLoadingRelationships) {
    return (
      <div className={className}>
        <Label className="text-sm font-medium mb-3">Related Products</Label>
        <div className="h-[100px] flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  // Get selected products details
  const selectedProducts = userProducts.filter(p => selectedIds.includes(p.product_uuid));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <Label className="text-lg font-medium">Related Products</Label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Products</span>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search products..." />
              <CommandEmpty>No products found</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {userProducts.map((product) => (
                  <CommandItem
                    key={product.product_uuid}
                    value={product.product_uuid}
                    onSelect={() => toggleProduct(product.product_uuid)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{product.name}</span>
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
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {selectedProducts.map(product => (
            <Card 
              key={product.product_uuid}
              className="overflow-hidden border bg-card transition-all hover:shadow-md"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1 mr-2">
                  <div className="font-medium truncate">
                    {product.name}
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
                    onClick={() => removeRelationship(product.product_uuid)}
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
