
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface DeleteClassroomProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relationshipUuid: string | null;
  onSuccess?: () => void;
}

export function DeleteClassroomProductDialog({
  open,
  onOpenChange,
  relationshipUuid,
  onSuccess
}: DeleteClassroomProductDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (uuid: string) => {
      console.log("Attempting to delete relationship:", uuid);

      const { error } = await supabase
        .from('community_product_relationships')
        .delete()
        .eq('community_product_relationship_uuid', uuid);

      if (error) {
        console.error("Error deleting classroom product relationship:", error);
        throw error;
      }

      console.log("Successfully deleted classroom product relationship");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product removed from classroom successfully",
      });
      
      // Invalidate all classroom products queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['classroomProducts'] });
      
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error deleting classroom product:", error);
      toast({
        title: "Error", 
        description: "Failed to remove product from classroom. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = () => {
    if (!relationshipUuid) {
      toast({
        title: "Error",
        description: "Missing relationship information. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    deleteMutation.mutate(relationshipUuid);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Product from Classroom</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this product from the classroom? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {deleteMutation.isPending ? "Removing..." : "Remove Product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
