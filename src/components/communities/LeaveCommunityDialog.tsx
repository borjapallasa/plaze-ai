
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

interface LeaveCommunityDialogProps {
  communityName?: string;
  onConfirmLeave: () => void;
}

export function LeaveCommunityDialog({ communityName, onConfirmLeave }: LeaveCommunityDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirmLeave();
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex-1 text-xs h-8"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-3 w-3 mr-1" />
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
            <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Leave Community
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
