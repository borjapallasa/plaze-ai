
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useAffiliateProducts } from "@/hooks/use-affiliate-products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

interface AffiliateProductSectionProps {
  expertUuid?: string;
  productUuid?: string;
}

export function AffiliateProductSection({ expertUuid, productUuid }: AffiliateProductSectionProps) {
  const [isAffiliateProgram, setIsAffiliateProgram] = useState(false);
  const [split, setSplit] = useState([70]); // Default 70% seller, 30% affiliate
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: affiliateProducts = [], refetch: refetchAffiliateProducts } = useAffiliateProducts(productUuid);

  // Check if product is already in affiliate program
  const isAlreadyAffiliate = affiliateProducts.length > 0;

  // Load existing split if product is already in affiliate program
  useEffect(() => {
    if (affiliateProducts.length > 0) {
      const existingProduct = affiliateProducts[0];
      setSplit([Math.round(existingProduct.expert_share * 100)]);
    }
  }, [affiliateProducts]);

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!isAffiliateProgram) return false;
    return true;
  };

  const handleConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleEdit = (affiliateProduct: any) => {
    setEditingProduct(affiliateProduct);
    setSplit([Math.round(affiliateProduct.expert_share * 100)]);
    setShowEditDialog(true);
  };

  const handleDelete = (affiliateProduct: any) => {
    setEditingProduct(affiliateProduct);
    setShowDeleteDialog(true);
  };

  const handleDialogConfirm = async () => {
    if (!productUuid) {
      toast.error("Missing product information");
      return;
    }

    try {
      setIsLoading(true);

      const expertShare = split[0] / 100;
      const affiliateShare = (100 - split[0]) / 100;

      const { error } = await supabase
        .from('affiliate_products')
        .insert({
          product_uuid: productUuid,
          expert_share: expertShare,
          affiliate_share: affiliateShare,
          status: 'active',
          type: 'product'
        });

      if (error) {
        console.error('Error creating affiliate product:', error);
        toast.error("Failed to enable affiliate program");
        return;
      }

      toast.success("Affiliate program enabled successfully");
      setShowConfirmDialog(false);
      setIsAffiliateProgram(false);
      refetchAffiliateProducts();

    } catch (error) {
      console.error('Error enabling affiliate program:', error);
      toast.error("Failed to enable affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditConfirm = async () => {
    if (!editingProduct) return;

    try {
      setIsLoading(true);

      const expertShare = split[0] / 100;
      const affiliateShare = (100 - split[0]) / 100;

      const { error } = await supabase
        .from('affiliate_products')
        .update({
          expert_share: expertShare,
          affiliate_share: affiliateShare
        })
        .eq('affiliate_products_uuid', editingProduct.affiliate_products_uuid);

      if (error) {
        console.error('Error updating affiliate product:', error);
        toast.error("Failed to update affiliate program");
        return;
      }

      toast.success("Affiliate program updated successfully");
      setShowEditDialog(false);
      setEditingProduct(null);
      refetchAffiliateProducts();

    } catch (error) {
      console.error('Error updating affiliate program:', error);
      toast.error("Failed to update affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!editingProduct) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('affiliate_products')
        .delete()
        .eq('affiliate_products_uuid', editingProduct.affiliate_products_uuid);

      if (error) {
        console.error('Error deleting affiliate product:', error);
        toast.error("Failed to disable affiliate program");
        return;
      }

      toast.success("Affiliate program disabled successfully");
      setShowDeleteDialog(false);
      setEditingProduct(null);
      refetchAffiliateProducts();

    } catch (error) {
      console.error('Error disabling affiliate program:', error);
      toast.error("Failed to disable affiliate program");
    } finally {
      setIsLoading(false);
    }
  };

  const sellerPercentage = split[0];
  const affiliatePercentage = 100 - split[0];

  return (
    <>
      <Card className="p-3 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4">Affiliate program</h2>
        
        <div className="space-y-4">
          {/* Display existing affiliate products */}
          {affiliateProducts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Affiliate program enabled:</Label>
              <div className="space-y-2">
                {affiliateProducts.map((ap) => (
                  <div key={ap.affiliate_products_uuid} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">Status: {ap.status}</p>
                        <p className="text-sm text-muted-foreground">
                          Expert: {Math.round(ap.expert_share * 100)}% | Affiliate: {Math.round(ap.affiliate_share * 100)}%
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(ap)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(ap)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
            </div>
          )}

          {/* Show toggle only if not already in affiliate program */}
          {!isAlreadyAffiliate && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="affiliate-program-toggle" className="text-base font-medium">
                  Include in affiliate program
                </Label>
                <Switch
                  id="affiliate-program-toggle"
                  checked={isAffiliateProgram}
                  onCheckedChange={setIsAffiliateProgram}
                />
              </div>

              {isAffiliateProgram && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-3">
                    <Label>Split</Label>
                    <div className="space-y-3">
                      <Slider
                        value={split}
                        onValueChange={setSplit}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Seller: {sellerPercentage}%</span>
                        <span>Affiliate: {affiliatePercentage}%</span>
                      </div>
                    </div>
                  </div>

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
            </>
          )}

          {/* Show message if already in affiliate program */}
          {isAlreadyAffiliate && !isAffiliateProgram && (
            <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
              This product is already part of the affiliate program. Use the edit button to modify settings.
            </div>
          )}
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Affiliate Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Split</Label>
              <div className="space-y-3">
                <Slider
                  value={split}
                  onValueChange={setSplit}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Seller: {split[0]}%</span>
                  <span>Affiliate: {100 - split[0]}%</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditConfirm} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Affiliate Program</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to disable the affiliate program for this product? This action cannot be undone.</p>
            {editingProduct && (
              <div className="mt-4 p-3 border rounded-lg bg-muted/50">
                <p className="font-medium">Current Split:</p>
                <p className="text-sm text-muted-foreground">
                  Expert: {Math.round(editingProduct.expert_share * 100)}% | Affiliate: {Math.round(editingProduct.affiliate_share * 100)}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading}>
              {isLoading ? "Disabling..." : "Disable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Affiliate Program</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>This will enable affiliate program for this product with a {sellerPercentage}%/{affiliatePercentage}% seller/affiliate split</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} disabled={isLoading}>
              {isLoading ? "Enabling..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
