
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface AffiliateProductSectionProps {
  expertUuid?: string;
  productUuid?: string;
}

export function AffiliateProductSection({ expertUuid, productUuid }: AffiliateProductSectionProps) {
  const [isAffiliateProgram, setIsAffiliateProgram] = useState(false);
  const [split, setSplit] = useState([70]); // Default 70% seller, 30% affiliate
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!isAffiliateProgram) return false;
    return true;
  };

  const handleConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleDialogConfirm = () => {
    // TODO: Implement the actual affiliate program logic here
    console.log("Setting up affiliate program with split:", split[0]);
    setShowConfirmDialog(false);
  };

  const sellerPercentage = split[0];
  const affiliatePercentage = 100 - split[0];

  return (
    <>
      <Card className="p-3 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4">Affiliate program</h2>
        
        <div className="space-y-4">
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
        </div>
      </Card>

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
            <Button onClick={handleDialogConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
