
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle } from "lucide-react";
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
import { useUpdateReviewStatus } from "@/hooks/use-update-review-status";

interface ReviewActionsProps {
  reviewId: string;
  status: string;
}

export function ReviewActions({ reviewId, status }: ReviewActionsProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const updateReviewStatus = useUpdateReviewStatus();

  // Only show actions for pending reviews
  if (status !== 'pending') {
    return null;
  }

  const handleApprove = () => {
    updateReviewStatus.mutate({ reviewId, status: 'published' });
    setShowApproveDialog(false);
  };

  const handleReject = () => {
    updateReviewStatus.mutate({ reviewId, status: 'rejected' });
    setShowRejectDialog(false);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowApproveDialog(true)}
        disabled={updateReviewStatus.isPending}
        className="text-green-600 border-green-200 hover:bg-green-50"
      >
        <Check className="h-3 w-3 mr-1" />
        Approve
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowRejectDialog(true)}
        disabled={updateReviewStatus.isPending}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        <X className="h-3 w-3 mr-1" />
        Reject
      </Button>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Approve Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this review? This action will publish the review and make it visible to all users. 
              <strong className="block mt-2 text-red-600">This action is irreversible.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Reject Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this review? This action will prevent the review from being published and it will not be visible to users.
              <strong className="block mt-2 text-red-600">This action is irreversible.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
