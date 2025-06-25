
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
    updateReviewStatus.mutate({ reviewId, status: 'not published' });
    setShowRejectDialog(false);
  };

  return (
    <>
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
        {/* Pending Review Badge - Full width */}
        <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center justify-center gap-2 text-sm text-orange-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Pending Review</span>
          </div>
        </div>
        
        {/* Action Buttons - Full width on mobile, right-aligned on desktop */}
        <div className="flex items-center gap-2 justify-center sm:justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRejectDialog(true)}
            disabled={updateReviewStatus.isPending}
            className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex-1 sm:flex-none"
          >
            <X className="h-3 w-3 mr-1" />
            Reject
          </Button>
          
          <Button
            size="sm"
            onClick={() => setShowApproveDialog(true)}
            disabled={updateReviewStatus.isPending}
            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
          >
            <Check className="h-3 w-3 mr-1" />
            Approve
          </Button>
        </div>
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
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
              <X className="h-5 w-5 text-red-600" />
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
    </>
  );
}
