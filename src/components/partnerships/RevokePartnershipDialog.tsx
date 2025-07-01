
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RevokePartnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  partnershipName: string;
  isLoading?: boolean;
}

export function RevokePartnershipDialog({
  open,
  onOpenChange,
  onConfirm,
  partnershipName,
  isLoading = false
}: RevokePartnershipDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-xl font-semibold text-foreground">
            Revoke Partnership
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 text-left">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to revoke the partnership with{" "}
              <span className="font-medium text-foreground">{partnershipName}</span>? 
              This action is irreversible.
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                In order to keep the partnership fair, all sales generated through your partner links 
                in the next <span className="font-medium text-foreground">90 days</span> will give your partner the 
                corresponding share.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel 
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
          >
            {isLoading ? "Revoking..." : "Revoke Partnership"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
