
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ExistingProductSelector } from "@/components/community/ExistingProductSelector";
import { CommunityProduct } from "@/types/Product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

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
  const [selectedTemplate, setSelectedTemplate] = useState<CommunityProduct | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [productType, setProductType] = useState<"free" | "paid">("free");
  const [paymentLink, setPaymentLink] = useState("");
  const [filesLink, setFilesLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleTemplateSelect = (product: CommunityProduct) => {
    setSelectedTemplate(product);
    setName(product.name || "");
    setProductType(product.product_type as "free" | "paid" || "free");
    setPrice(product.price ? product.price.toString() : "");
    setFilesLink(product.files_link || "");
    setPaymentLink(product.payment_link || "");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
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
          name,
          community_uuid: communityUuid,
          product_type: productType,
          price: productType === "paid" ? parseFloat(price) : null,
          payment_link: productType === "paid" ? paymentLink : null,
          files_link: filesLink || null,
          expert_uuid: expertUuid,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community product:", error);
        toast.error("Failed to create product");
        throw error;
      }

      // Step 2: Create the product relationship to make it appear in the classroom
      const { error: relationshipError } = await supabase
        .from("community_product_relationships")
        .insert({
          community_uuid: communityUuid,
          community_product_uuid: data.community_product_uuid,
          user_uuid: user.id,
        });

      if (relationshipError) {
        console.error("Error creating product relationship:", relationshipError);
        toast.error("Product created but not linked to classroom");
        throw relationshipError;
      }

      toast.success("Product added successfully");
      onOpenChange(false);
      
      // Reset form
      setName("");
      setPrice("");
      setProductType("free");
      setPaymentLink("");
      setFilesLink("");
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showTemplateSelector ? "Create Product from Template" : "Create New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {showTemplateSelector && expertUuid && (
            <div className="space-y-2">
              <ExistingProductSelector
                expertUuid={expertUuid}
                onSelect={handleTemplateSelect}
                selectedProduct={selectedTemplate}
              />
            </div>
          )}

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

          {productType === "paid" && (
            <>
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

              <div className="space-y-2">
                <Label htmlFor="payment-link">Payment Link</Label>
                <Input
                  id="payment-link"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://buy.stripe.com/your-product"
                />
                <p className="text-xs text-muted-foreground">
                  Link to where customers can purchase this product
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
