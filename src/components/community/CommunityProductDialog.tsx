
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProductSelector } from "@/components/community/ProductSelector";
import { VariantSelector } from "@/components/community/VariantSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

interface Product {
  product_uuid: string;
  name: string;
  price_from: number;
  thumbnail?: string;
  status: string;
  created_at: string;
}

interface ProductVariant {
  variant_uuid: string;
  name: string;
  price: number;
  compare_price?: number;
  files_link?: string;
  additional_details?: string;
}

interface CommunityProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityUuid: string;
  expertUuid: string | undefined;
  showTemplateSelector: boolean;
}

export function CommunityProductDialog({
  open,
  onOpenChange,
  communityUuid,
  expertUuid,
  showTemplateSelector,
}: CommunityProductDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState<"free" | "paid">("free");
  const [filesLink, setFilesLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name || "");
    setPrice(product.price_from ? product.price_from.toString() : "");
    setProductType(product.price_from && product.price_from > 0 ? "paid" : "free");
    setFilesLink("");
    setSelectedVariant(null); // Reset variant selection when product changes
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setPrice(variant.price ? variant.price.toString() : "");
    setFilesLink(variant.files_link || "");
  };

  const handleSubmit = async () => {
    if (showTemplateSelector) {
      if (!selectedProduct) {
        toast.error("Please select a product");
        return;
      }
    } else {
      if (!name.trim()) {
        toast.error("Product name is required");
        return;
      }
    }

    if (productType === "paid" && (!price || parseFloat(price) <= 0)) {
      toast.error("Please enter a valid price for paid products");
      return;
    }

    if (!user?.id) {
      toast.error("You need to be logged in to create a product");
      return;
    }

    try {
      setIsSaving(true);

      // Step 1: Create the community product
      const { data, error } = await supabase
        .from("community_products")
        .insert({
          name: showTemplateSelector ? selectedProduct?.name : name,
          community_uuid: communityUuid,
          product_type: productType,
          price: productType === "paid" ? parseFloat(price) : null,
          payment_link: null,
          files_link: showTemplateSelector ? (selectedVariant?.files_link || null) : (filesLink || null),
          expert_uuid: expertUuid,
          product_uuid: selectedProduct?.product_uuid || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community product:", error);
        toast.error("Failed to create product");
        throw error;
      }

      if (showTemplateSelector && selectedProduct) {
        // Step 2: If creating from template, update the original product with community_product_uuid
        const { error: updateError } = await supabase
          .from("products")
          .update({
            community_product_uuid: data.community_product_uuid
          })
          .eq("product_uuid", selectedProduct.product_uuid);

        if (updateError) {
          console.error("Error updating original product:", updateError);
          // Don't throw here as the community product was already created successfully
          toast.error("Product created but failed to link to original template");
        }
      } else {
        // Step 2: If creating from scratch, create a new product record
        const { data: productData, error: productError } = await supabase
          .from("products")
          .insert({
            name: name,
            user_uuid: user.id,
            expert_uuid: expertUuid,
            status: 'draft',
            community_product_uuid: data.community_product_uuid
          })
          .select()
          .single();

        if (productError) {
          console.error("Error creating product:", productError);
          toast.error("Failed to create product record");
          throw productError;
        }

        // Step 3: Create a variant for the new product
        const { error: variantError } = await supabase
          .from("variants")
          .insert({
            user_uuid: user.id,
            name: name,
            price: productType === "paid" ? parseFloat(price) : 0,
            product_uuid: productData.product_uuid,
            files_link: filesLink || null
          });

        if (variantError) {
          console.error("Error creating variant:", variantError);
          toast.error("Product created but failed to create variant");
          // Don't throw here as the main records were created
        }
      }

      // Step 4: Create the product relationship
      const { error: relationshipError } = await supabase
        .from("community_product_relationships")
        .insert({
          community_uuid: communityUuid,
          community_product_uuid: data.community_product_uuid,
          user_uuid: user.id,
        });

      if (relationshipError) {
        console.error("Error creating product relationship:", relationshipError);
        toast.error("Product created but not linked to community");
        throw relationshipError;
      }

      // Invalidate related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['communityProducts', communityUuid] });
      queryClient.invalidateQueries({ queryKey: ['communityProductRelationships'] });
      queryClient.invalidateQueries({ queryKey: ['userProducts', user.id] }); // Refresh user products list
      
      toast.success("Product added successfully");
      onOpenChange(false);
      
      // Reset form
      setName("");
      setPrice("");
      setProductType("free");
      setFilesLink("");
      setSelectedProduct(null);
      setSelectedVariant(null);
      
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showTemplateSelector ? "Create Product from List" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {showTemplateSelector && (
            <>
              <ProductSelector
                onSelect={handleProductSelect}
                selectedProduct={selectedProduct}
              />
              
              {selectedProduct && (
                <VariantSelector
                  productUuid={selectedProduct.product_uuid}
                  onSelect={handleVariantSelect}
                  selectedVariant={selectedVariant}
                />
              )}
              
              {selectedProduct && (
                <div className="space-y-2">
                  <Label htmlFor="community-price">Set Price ($)</Label>
                  <Input
                    id="community-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set the price for this product in your community (can be different from original)
                  </p>
                </div>
              )}
            </>
          )}

          {!showTemplateSelector && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label>Product Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="free"
                      checked={productType === "free"}
                      onChange={() => setProductType("free")}
                      className="h-4 w-4"
                    />
                    <span>Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="productType"
                      value="paid"
                      checked={productType === "paid"}
                      onChange={() => setProductType("paid")}
                      className="h-4 w-4"
                    />
                    <span>Paid</span>
                  </label>
                </div>
              </div>

              {productType === "paid" && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="19.99"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="files-link">Files Link</Label>
                <Input
                  id="files-link"
                  value={filesLink}
                  onChange={(e) => setFilesLink(e.target.value)}
                  placeholder="https://example.com/files"
                />
                <p className="text-xs text-muted-foreground">
                  Link to downloadable files for this product
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
