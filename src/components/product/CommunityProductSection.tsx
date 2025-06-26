
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useExpertCommunities } from "@/hooks/expert/useExpertCommunities";
import { useProductVariants } from "@/hooks/use-product-variants";
import { useCommunityProducts } from "@/hooks/use-community-products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommunityProductSectionProps {
  expertUuid?: string;
  productUuid?: string;
}

export function CommunityProductSection({ expertUuid, productUuid }: CommunityProductSectionProps) {
  const [isCommunityProduct, setIsCommunityProduct] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [productType, setProductType] = useState<"free" | "paid">("free");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [price, setPrice] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: communities = [] } = useExpertCommunities(expertUuid);
  const { data: variants = [] } = useProductVariants(productUuid);
  const { data: communityProducts = [], refetch: refetchCommunityProducts } = useCommunityProducts(productUuid);

  const showVariantSelector = variants.length > 1;
  const selectedCommunityName = communities.find(c => c.community_uuid === selectedCommunity)?.name || "";

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!isCommunityProduct) return false;
    if (!selectedCommunity) return false;
    if (showVariantSelector && !selectedVariant) return false;
    if (productType === "paid" && !price) return false;
    return true;
  };

  const handleConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleDialogConfirm = async () => {
    if (!productUuid || !expertUuid || !selectedCommunity) {
      toast.error("Missing required information");
      return;
    }

    try {
      setIsLoading(true);

      // Get the selected variant or use the first one if only one variant exists
      const variantToUse = showVariantSelector 
        ? variants.find(v => v.id === selectedVariant)
        : variants[0];

      if (!variantToUse) {
        toast.error("No variant selected");
        return;
      }

      // Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("User not authenticated");
        return;
      }

      // Insert into community_products table
      const { error: insertError } = await supabase
        .from('community_products')
        .insert({
          community_uuid: selectedCommunity,
          expert_uuid: expertUuid,
          product_type: productType,
          name: variantToUse.name,
          files_link: variantToUse.filesLink,
          product_uuid: productUuid,
          price: productType === "paid" ? parseFloat(price) : 0
        });

      if (insertError) {
        console.error('Error inserting community product:', insertError);
        toast.error("Failed to link product to community");
        return;
      }

      toast.success("Product successfully linked to community");
      setShowConfirmDialog(false);
      
      // Reset form
      setIsCommunityProduct(false);
      setSelectedCommunity("");
      setProductType("free");
      setSelectedVariant("");
      setPrice("");

      // Refetch community products to show the new one
      refetchCommunityProducts();

    } catch (error) {
      console.error('Error linking product to community:', error);
      toast.error("Failed to link product to community");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="p-3 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4">Community product</h2>
        
        <div className="space-y-4">
          {/* Display existing community products */}
          {communityProducts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Linked to communities:</Label>
              <div className="space-y-2">
                {communityProducts.map((cp) => (
                  <div key={cp.community_product_uuid} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{cp.community.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cp.name} - {cp.product_type === "paid" ? `$${cp.price}` : "Free"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="community-product-toggle" className="text-base font-medium">
              Include in your community
            </Label>
            <Switch
              id="community-product-toggle"
              checked={isCommunityProduct}
              onCheckedChange={setIsCommunityProduct}
            />
          </div>

          {isCommunityProduct && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="community-select">Community</Label>
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a community" />
                  </SelectTrigger>
                  <SelectContent>
                    {communities.map((community) => (
                      <SelectItem key={community.community_uuid} value={community.community_uuid}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={productType === "free" ? "default" : "outline"}
                    onClick={() => setProductType("free")}
                    className="flex-1"
                  >
                    Free
                  </Button>
                  <Button
                    type="button"
                    variant={productType === "paid" ? "default" : "outline"}
                    onClick={() => setProductType("paid")}
                    className="flex-1"
                  >
                    Paid
                  </Button>
                </div>
              </div>

              {showVariantSelector && (
                <div className="space-y-2">
                  <Label htmlFor="variant-select">Variant</Label>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name} - ${variant.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {productType === "paid" && (
                <div className="space-y-2">
                  <Label htmlFor="community-price">Price ($)</Label>
                  <Input
                    id="community-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="19.99"
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleConfirm} 
                  className="w-full"
                  disabled={!isFormValid()}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Community Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>This will link this product to your Community {selectedCommunityName}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} disabled={isLoading}>
              {isLoading ? "Linking..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
