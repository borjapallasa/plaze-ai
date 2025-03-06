
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface DangerZoneProps {
  productName: string;
  isDeleting: boolean;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  onDeleteProduct: () => void;
}

export function DangerZone({
  productName,
  isDeleting,
  showDeleteDialog,
  setShowDeleteDialog,
  onDeleteProduct
}: DangerZoneProps) {
  return (
    <div className="mt-6 pt-4 border-t">
      <h3 className="text-base font-medium mb-2">Danger Zone</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Permanent actions that cannot be undone
      </p>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              This action is irreversible. This will permanently delete the product
              "{productName}" and all of its associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <p className="text-sm font-medium text-destructive">
              Are you sure you want to delete this product?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={onDeleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
