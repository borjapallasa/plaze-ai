
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
  serviceName: string;
  isDeleting: boolean;
  showDeleteDialog: boolean;
  sellerUuid: string; // This is the expert_uuid for redirection
  setShowDeleteDialog: (show: boolean) => void;
  onDeleteService: (redirectUrl: string) => void;
}

export function DangerZone({
  serviceName,
  isDeleting,
  showDeleteDialog,
  sellerUuid,
  setShowDeleteDialog,
  onDeleteService
}: DangerZoneProps) {
  return (
    <div>
      <Separator className="my-5" />
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
            Delete Service
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Service
            </DialogTitle>
            <DialogDescription>
              This action is irreversible. This will permanently delete the service
              "{serviceName}" and all of its associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <p className="text-sm font-medium text-destructive">
              Are you sure you want to delete this service?
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
              onClick={() => onDeleteService(`/seller/${sellerUuid}`)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
