
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

interface ClassroomProductSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  communityUuid: string;
  excludedProductIds: string[];
}

export function ClassroomProductSelector({
  open,
  onOpenChange,
  classroomId,
  communityUuid,
  excludedProductIds
}: ClassroomProductSelectorProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get user's expert UUID
  const { data: userExpert } = useQuery({
    queryKey: ['userExpert', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error("Error fetching user expert:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const { data: availableProducts, isLoading } = useQuery({
    queryKey: ['availableCommunityProducts', communityUuid, excludedProductIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_products')
        .select('*')
        .eq('community_uuid', communityUuid)
        .not('community_product_uuid', 'in', `(${excludedProductIds.join(',')})`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching available community products:", error);
        throw error;
      }

      return data || [];
    },
    enabled: open && !!communityUuid && excludedProductIds.length >= 0
  });

  // Filter products based on search query
  const filteredProducts = availableProducts?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const addProductsMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (!userExpert?.expert_uuid) {
        throw new Error("User must be an expert to add products to classroom");
      }

      const relationships = productIds.map(productId => ({
        community_uuid: communityUuid,
        community_product_uuid: productId,
        user_uuid: user.id,
        classroom_uuid: classroomId,
        expert_uuid: userExpert.expert_uuid
      }));

      const { error } = await supabase
        .from('community_product_relationships')
        .insert(relationships);

      if (error) {
        console.error("Error adding products to classroom:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classroomProducts', classroomId] });
      toast({
        title: "Success",
        description: `${selectedProducts.length} product(s) added to classroom`,
      });
      setSelectedProducts([]);
      setSearchQuery("");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error adding products:", error);
      toast({
        title: "Error",
        description: "Failed to add products. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddSelected = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No products selected",
        description: "Please select at least one product to add.",
        variant: "destructive"
      });
      return;
    }

    if (!userExpert?.expert_uuid) {
      toast({
        title: "Permission denied",
        description: "You must be an expert to add products to classrooms.",
        variant: "destructive"
      });
      return;
    }

    addProductsMutation.mutate(selectedProducts);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Products to Classroom</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading available products...</span>
              </div>
            ) : !availableProducts || availableProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No additional products available to add to this classroom.
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found matching "{searchQuery}".
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card
                  key={product.community_product_uuid}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedProducts.includes(product.community_product_uuid)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => handleToggleProduct(product.community_product_uuid)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{product.name}</h4>
                          <Badge variant={product.price === 0 ? "secondary" : "default"} className="text-xs px-2 py-0.5 flex-shrink-0">
                            {product.price === 0 ? "FREE" : `$${product.price}`}
                          </Badge>
                        </div>
                        
                        {product.product_type && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {product.product_type} product
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {selectedProducts.includes(product.community_product_uuid) && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Plus className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedProducts.length} product(s) selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSelected}
              disabled={selectedProducts.length === 0 || addProductsMutation.isPending || !userExpert?.expert_uuid}
            >
              {addProductsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                `Add ${selectedProducts.length > 0 ? selectedProducts.length : ''} Product${selectedProducts.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
