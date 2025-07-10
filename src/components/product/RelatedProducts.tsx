import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner"

interface Product {
  product_uuid: string;
  name: string;
  price_from?: number;
  slug?: string;
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
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch expert_uuid for the current user
  const { data: expertData, isLoading: isLoadingExpert } = useQuery({
    queryKey: ['userExpert', userUuid],
    queryFn: async () => {
      if (!userUuid) {
        console.log('DEBUG: No userUuid provided');
        return null;
      }

      console.log('DEBUG: Fetching expert data for userUuid:', userUuid);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('expert_uuid')
          .eq('user_uuid', userUuid)
          .maybeSingle();

        if (error) {
          console.error("DEBUG: Error fetching user expert data:", error);
          throw error;
        }

        console.log('DEBUG: Expert data fetched:', data);
        return data;
      } catch (error) {
        console.error("DEBUG: Failed to fetch user expert data:", error);
        return null;
      }
    },
    enabled: Boolean(userUuid),
    retry: 3,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Fetch user's products (excluding the current product) - only active ones
  const { data: userProducts = [], isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ['userProducts', userUuid, productId],
    queryFn: async () => {
      if (!userUuid || !productId) {
        console.log('No user or product')
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('product_uuid, name, price_from, slug')
          .eq('user_uuid', userUuid)
          .eq('status', 'active')
          .neq('product_uuid', productId);

        if (error) {
          console.error("Error fetching user products:", error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Failed to fetch user products:", error);
        return [];
      }
    },
    enabled: Boolean(userUuid) && Boolean(productId),
    retry: 3,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const { data: relationships = [], isLoading: isLoadingRelationships, error: relationshipsError } = useQuery({
    queryKey: ['productRelationships', productId],
    queryFn: async () => {
      if (!productId) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('product_relationships')
          .select(`
            *,
            related_product:products!product_relationships_related_product_uuid_fkey(
              product_uuid,
              name,
              price_from
            )
          `)
          .eq('product_uuid', productId);

        if (error) {
          console.error("Error fetching product relationships:", error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error("Failed to fetch product relationships:", error);
        return [];
      }
    },
    enabled: Boolean(productId),
    retry: 3,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Update selected products based on relationships
  useEffect(() => {
    console.log("Relationships changed:", relationships.length);

    if (relationships.length > 0 && userProducts.length > 0) {
      try {
        const relatedProductIds = relationships.map(rel => rel.related_product_uuid);
        const relatedProducts = userProducts.filter(product =>
          relatedProductIds.includes(product.product_uuid)
        );

        console.log("Setting selected products:", relatedProducts.length);
        setSelectedProducts(relatedProducts);
      } catch (error) {
        console.error("Error processing relationships:", error);
      }
    } else if (relationships.length === 0) {
      // Clear selected products if no relationships exist
      setSelectedProducts([]);
    }
  }, [relationships, userProducts]);

  // Save all relationships to the database
  const saveRelationships = async () => {
    console.log('DEBUG: Starting saveRelationships function');
    console.log('DEBUG: Current userUuid:', userUuid);
    console.log('DEBUG: Current productId:', productId);
    console.log('DEBUG: Expert data:', expertData);

    if (!productId || !expertData?.expert_uuid) {
      if (!expertData?.expert_uuid) {
        console.log('DEBUG: No expert_uuid found, cannot save');
        toast.error("Unable to save: Expert profile not found");
        return;
      }
      console.log('DEBUG: No productId, cannot save');
      return;
    }

    setSaving(true);

    try {
      console.log("DEBUG: Starting save relationships for product:", productId);
      console.log("DEBUG: Expert UUID:", expertData.expert_uuid);
      console.log("DEBUG: Selected products to save:", selectedProducts.length);
      console.log("DEBUG: Selected products data:", selectedProducts);
      
      // First, delete all existing relationships for this product
      console.log('DEBUG: Deleting existing relationships...');
      const { error: deleteError } = await supabase
        .from('product_relationships')
        .delete()
        .eq('product_uuid', productId);

      if (deleteError) {
        console.error("DEBUG: Error deleting existing relationships:", deleteError);
        throw deleteError;
      }
      console.log('DEBUG: Successfully deleted existing relationships');

      // Then, insert all selected products as new relationships
      if (selectedProducts.length > 0) {
        const relationshipsToInsert = selectedProducts.map((product, index) => ({
          product_uuid: productId,
          related_product_uuid: product.product_uuid,
          expert_uuid: expertData.expert_uuid,
          relationship_type: 'upsell',
          display_order: index
        }));

        console.log("DEBUG: Inserting relationships:", relationshipsToInsert);

        const { data: insertData, error: insertError } = await supabase
          .from('product_relationships')
          .insert(relationshipsToInsert)
          .select();

        if (insertError) {
          console.error("DEBUG: Error inserting relationships:", insertError);
          console.error("DEBUG: Insert error details:", {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw insertError;
        }

        console.log("DEBUG: Successfully inserted relationships:", insertData);
      } else {
        console.log('DEBUG: No products to insert');
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['productRelationships', productId] });
      queryClient.invalidateQueries({ queryKey: ['relatedProducts', productId] });
      toast.success("Related products have been updated successfully");
      console.log('DEBUG: Save operation completed successfully');
    } catch (error) {
      console.error("DEBUG: Error in saveRelationships:", error);
      toast.error("Failed to save related products");
    } finally {
      setSaving(false);
    }
  };

  // Delete a specific product relationship from the database
  const deleteProductRelationship = async (relatedProductUuid: string) => {
    if (!productId) return false;

    console.log('deleting', productId, relatedProductUuid)
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from('product_relationships')
        .delete()
        .eq('product_uuid', productId)
        .eq('related_product_uuid', relatedProductUuid);

      if (error) {
        console.error("Error deleting relationship:", error);
        toast.error("Failed to remove related product");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteProductRelationship:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle product selection in local state
  const toggleProductSelection = (product: Product) => {
    try {
      // Update local state
      setSelectedProducts(prev => {
        const isAlreadySelected = prev.some(p => p.product_uuid === product.product_uuid);

        // If it's already selected, remove it
        if (isAlreadySelected) {
          return prev.filter(p => p.product_uuid !== product.product_uuid);
        }

        // Otherwise, add it to the selected products
        return [...prev, product];
      });

      // Close the popover after selection
      setOpen(false);
    } catch (error) {
      console.error("Error toggling product selection:", error);
    }
  };

  // Remove a product from selection and delete from database
  const removeSelectedProduct = async (productToRemove: string) => {
    try {
      // First delete from database
      const success = await deleteProductRelationship(productToRemove);

      if (success) {
        // Then remove from local state
        setSelectedProducts(prev =>
          prev.filter(p => p.product_uuid !== productToRemove)
        );

        // Refresh queries
        queryClient.invalidateQueries({ queryKey: ['productRelationships', productId] });
        queryClient.invalidateQueries({ queryKey: ['relatedProducts', productId] });

        toast.success("Related product has been removed successfully");
      }
    } catch (error) {
      console.error("Error removing selected product:", error);
      toast.error("Failed to remove related product");
    }
  };

  // Error handling
  if (productsError || relationshipsError) {
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center text-red-800">
          Error loading related products. Please try refreshing the page.
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingProducts || isLoadingRelationships || isLoadingExpert) {
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-muted/30 rounded-md p-4 text-center text-muted-foreground">
          Loading product relationships...
        </div>
      </div>
    );
  }

  // Check if user has expert profile
  if (!expertData?.expert_uuid) {
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Products</Label>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center text-yellow-800">
          Expert profile required to manage related products.
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
                {userProducts.map((product) => {
                  const isSelected = selectedProducts.some(p => p.product_uuid === product.product_uuid);

                  return (
                    <CommandItem
                      key={product.product_uuid}
                      value={product.name}
                      onSelect={() => {
                        toggleProductSelection(product);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{product.name}</span>
                        {product.price_from !== null && (
                          <span className="text-xs text-muted-foreground">
                            ${product.price_from?.toFixed(2)}
                          </span>
                        )}
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
        <>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div
                key={product.product_uuid}
                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="truncate flex-1">
                  <p className="font-medium truncate">{product.name}</p>
                  {product.price_from !== null && (
                    <p className="text-sm text-muted-foreground">
                      ${product.price_from?.toFixed(2)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSelectedProduct(product.product_uuid)}
                  className="h-8 w-8 p-0 rounded-full"
                  disabled={isDeleting}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={saveRelationships}
            disabled={isSaving || isDeleting}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </>
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
