import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Community } from "./CommunityStats";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export interface RelatedCommunityProductProps {
  community: Community;
  className?: string;
}

export interface CommunityProduct {
  community_product_uuid: string
  community_uuid: string;
  price?: number;
  product_type: 'free' | 'paid';
  payment_link?: string;
  name: string | null
}

export function EditCommunityRelatedProducts({
  community,
  className
}: RelatedCommunityProductProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<CommunityProduct[]>([]);
  const [isSaving, setSaving] = useState(false);

  const { data: communityProducts = [], isLoading: isLoadingProducts }: { data: CommunityProduct[], isLoading: boolean } = useQuery({
    queryKey: ['communityUserProducts', community.community_uuid],
    queryFn: async () => {
      if (!community) {
        console.log('No community found')
        return [];
      }

      const { data, error } = await supabase
        .from('community_products')
        .select('community_product_uuid, price, product_type, name')
        .eq('community_uuid', community.community_uuid)

      if (error) {
        console.error("Error fetching user products:", error);
        return [];
      }

      return data || [];
    },
    enabled: Boolean(community.community_uuid),
  });

  const { data: relationships = [], isLoading: isLoadingRelationships }: { data: any[]; isLoading: boolean } = useQuery({
    queryKey: ['communityProductRelationships', community],
    queryFn: async () => {
      if (!community) {
        return [];
      }
      const session = await supabase.auth.getSession();
      console.log("Session", session);

      const { data, error } = await supabase
        .from('community_product_relationships')
        .select(`
        community_product_uuid (
          community_product_uuid, 
          name,
          price
        )
      `)
        .eq('community_uuid', community.community_uuid);
      console.log('data n2', data, 'error', error);

      if (error) {
        console.error("Error fetching product relationships:", error);
        return [];
      }

      return data || [];
    },
    enabled: Boolean(community.community_uuid),
  });

  // Update selected products based on relationships
  useEffect(() => {
    const relatedProductIds = relationships.map(rel => rel.community_product_uuid.community_product_uuid);
    const relatedProducts = communityProducts.filter(product =>
      relatedProductIds.includes(product.community_product_uuid)
    );
    console.log('setting selected', relatedProducts)
    setSelectedProducts(relatedProducts);
  }, [relationships.length]); // Only run when relationships array length changes

  // Save all relationships to the database
  const saveRelationships = async () => {
    if (!community) return;

    setSaving(true);

    try {
      // First, delete all existing relationships
      const { error: deleteError } = await supabase
        .from('community_product_relationships')
        .delete()
        .eq('community_uuid', community.community_uuid);

      if (deleteError) {
        throw deleteError;
      }

      // Then, insert all selected products as new relationships
      if (selectedProducts.length > 0) {
        console.log('UID: ', community.user_uuid)
        const relationshipsToInsert = selectedProducts.map((product, index) => ({
          community_uuid: community.community_uuid,
          community_product_uuid: product.community_product_uuid,
          user_uuid: community.user_uuid
        }));

        const { data, error: insertError } = await supabase
          .from('community_product_relationships')
          .insert(relationshipsToInsert);

        if (insertError) {
          throw insertError;
        }
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['communityProductRelationships'] }); // todo: check correct

      toast({
        title: "Changes saved",
        description: "Related products have been updated successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving relationships:", error);
      toast({
        title: "Error",
        description: "Failed to save related products",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle product selection in local state
  const toggleProductSelection = (product: CommunityProduct) => {
    try {
      // Update local state
      setSelectedProducts(prev => {
        const isAlreadySelected = prev.some(p => p.community_product_uuid === product.community_product_uuid);

        // If it's already selected, remove it
        if (isAlreadySelected) {
          return prev.filter(p => p.community_product_uuid !== product.community_product_uuid);
        }

        // Otherwise, add it to the selected products
        return [...prev, product];
      });
    } catch (error) {
      console.error("Error toggling product selection:", error);
    }
  };

  // Remove a product from selection
  const removeSelectedProduct = async (productId: string) => {
    try {
      // Delete relationship from database
      await deleteProductRelationship(productId);
    } catch (error) {
      console.error("Error removing selected community product:", error);
    }
  };

  // Function to delete product relationships from the database
  const deleteProductRelationship = async (relatedProductId: string) => {
    console.log('Attempting to delete relationship:', relatedProductId);
    try {
      const { error, data } = await supabase
        .from('community_product_relationships')
        .delete()
        .eq('community_product_uuid', relatedProductId)

      if (error) {
        throw error;
      }

      // Remove from local state only if the deletion was successful
      setSelectedProducts(prev =>
        prev.filter(p => p.community_product_uuid !== relatedProductId)
      );

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['communityProductRelationships'] }); // todo: check correct
    } catch (error) {
      console.error("Error deleting product relationship:", error);
    }
  };

  if (isLoadingProducts || isLoadingRelationships) {
    return (
      <div className={className}>
        <Label className="text-base font-medium mb-4 block">Related Community Products</Label>
        <div className="bg-muted/30 rounded-md p-4 text-center text-muted-foreground">
          Loading community product relationships...
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Community Product</span>
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search products..." />
              <CommandEmpty>No products found</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {communityProducts.map((product) => {
                  const isSelected = selectedProducts.some(p => p.community_product_uuid === product.community_product_uuid);

                  return (
                    <CommandItem
                      key={product.community_product_uuid}
                      value={product.name}
                      onSelect={() => {
                        toggleProductSelection(product);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ${product.price?.toFixed(2) || '0.00'}
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
        <>
          <div className="space-y-2">
            {selectedProducts.map((product) => (
              <div
                key={product.community_product_uuid}
                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="truncate flex-1">
                  <p className="font-medium truncate">{product.name}</p>
                  {product.price !== null && (
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSelectedProduct(product.community_product_uuid)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={saveRelationships}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </>
      ) : (
        <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/10 text-center">
          <p className="text-muted-foreground text-sm mb-1">No related community products</p>
          <p className="text-xs text-muted-foreground max-w-[250px]">
            Add related community products to help customers discover more of your community's offerings
          </p>
        </div>
      )}
    </div>
  );
}