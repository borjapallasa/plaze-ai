
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useLeaveCommunity } from "@/hooks/use-leave-community";

interface LeaveCommunityDialogProps {
  communityName?: string;
  subscriptionUuid: string;
}

export function LeaveCommunityDialog({ communityName, subscriptionUuid }: LeaveCommunityDialogProps) {
  const [open, setOpen] = useState(false);
  const leaveCommunityMutation = useLeaveCommunity();

  const handleConfirm = () => {
    leaveCommunityMutation.mutate(subscriptionUuid);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full h-10 font-medium"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Manage
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Community</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave {communityName || "this community"}? 
              You will lose access to all community content and discussions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={leaveCommunityMutation.isPending}
            >
              {leaveCommunityMutation.isPending ? "Leaving..." : "Leave Community"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
