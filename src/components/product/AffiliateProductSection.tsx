import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useAffiliateProducts } from "@/hooks/use-affiliate-products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Trash2, Info, Plus, Trash } from "lucide-react";

interface AffiliateProductSectionProps {
  expertUuid?: string;
  productUuid?: string;
}

export function AffiliateProductSection({ expertUuid, productUuid }: AffiliateProductSectionProps) {
  const [isAffiliateProgram, setIsAffiliateProgram] = useState(false);
  const [split, setSplit] = useState([70]); // Default 70% seller, 30% affiliate
  const [questions, setQuestions] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: affiliateProducts = [], refetch: refetchAffiliateProducts } = useAffiliateProducts(productUuid);

  // Check if product is already in affiliate program
  const isAlreadyAffiliate = affiliateProducts.length > 0;

  // Load existing split and questions if product is already in affiliate program
  useEffect(() => {
    if (affiliateProducts.length > 0) {
      const existingProduct = affiliateProducts[0];
      setSplit([Math.round(existingProduct.expert_share * 100)]);
      setQuestions(Array.isArray(existingProduct.questions) ? existingProduct.questions : []);
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
    setQuestions(Array.isArray(affiliateProduct.questions) ? affiliateProduct.questions : []);
    setShowEditDialog(true);
  };

  const handleDelete = (affiliateProduct: any) => {
    setEditingProduct(affiliateProduct);
    setShowDeleteDialog(true);
  };

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
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
          type: 'product',
          questions: questions.filter(q => q.trim() !== '')
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
          affiliate_share: affiliateShare,
          questions: questions.filter(q => q.trim() !== '')
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
                        {ap.questions && Array.isArray(ap.questions) && ap.questions.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Questions: {ap.questions.length} configured
                          </p>
                        )}
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

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Questions for Affiliates</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addQuestion}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {questions.map((question, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Enter question for affiliates"
                            value={question}
                            onChange={(e) => updateQuestion(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeQuestion(index)}
                            className="h-10 w-10 flex-shrink-0"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add questions that affiliates must answer when applying to promote this product.
                    </p>
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

      {/* Edit Dialog - Updated with partnership notice and questions */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Affiliate Program</DialogTitle>
          </DialogHeader>
          
          {/* Add notice about existing partnerships */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>Changes to the affiliate program settings won't update existing partnerships or partnership requests.</p>
              </div>
            </div>
          </div>

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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Questions for Affiliates</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter question for affiliates"
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Add questions that affiliates must answer when applying to promote this product.
              </p>
              {questions.length === 0 && (
                <p className="text-sm text-muted-foreground">No questions configured. Add questions to help you evaluate potential partners.</p>
              )}
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

      {/* Delete Dialog - Updated with Fair Play Policy */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove from Affiliate Program?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-left">This will remove your product from the affiliate marketplace and stop new partnership requests.</p>
            
            {/* Fair Play Policy Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <h4 className="font-medium text-blue-900">Fair Play Policy</h4>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Partners will still receive commissions for sales in the next 90 days</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Your product won't appear in affiliate deals anymore</span>
                </div>
              </div>
            </div>

            {editingProduct && (
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="font-medium text-center">Current Revenue Split</p>
                <p className="text-sm text-muted-foreground text-center">
                  You: {Math.round(editingProduct.expert_share * 100)}% • Partners: {Math.round(editingProduct.affiliate_share * 100)}%
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="w-full sm:w-auto">
              Keep in Program
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Removing..." : "Remove from Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Affiliate Program?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-left mb-4">
              Are you sure? This will add your product to the affiliate program and affiliates will be able to request partnerships.
            </p>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-muted/50">
                <p className="font-medium mb-2">Revenue Split:</p>
                <p className="text-sm text-muted-foreground">
                  Expert: {sellerPercentage}% | Affiliate: {affiliatePercentage}%
                </p>
              </div>
              {questions.length > 0 && (
                <div className="p-3 border rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Partnership Questions:</p>
                  <p className="text-sm text-muted-foreground">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} configured
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} disabled={isLoading}>
              {isLoading ? "Adding..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
