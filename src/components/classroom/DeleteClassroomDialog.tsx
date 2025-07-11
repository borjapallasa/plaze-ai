
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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

interface DeleteClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroomId: string;
  classroomName: string;
  communityId?: string;
}

export function DeleteClassroomDialog({
  open,
  onOpenChange,
  classroomId,
  classroomName,
  communityId
}: DeleteClassroomDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      console.log("Attempting to delete classroom:", classroomId);

      // First delete all lessons associated with this classroom
      const { error: lessonsError } = await supabase
        .from('lessons')
        .delete()
        .eq('classroom_uuid', classroomId);

      if (lessonsError) {
        console.error("Error deleting lessons:", lessonsError);
        throw new Error("Failed to delete lessons");
      }

      // Delete all community product relationships for this classroom
      const { error: relationshipsError } = await supabase
        .from('community_product_relationships')
        .delete()
        .eq('classroom_uuid', classroomId);

      if (relationshipsError) {
        console.error("Error deleting product relationships:", relationshipsError);
        throw new Error("Failed to delete associated products");
      }

      // Finally delete the classroom itself
      const { error: classroomError } = await supabase
        .from('classrooms')
        .delete()
        .eq('classroom_uuid', classroomId);

      if (classroomError) {
        console.error("Error deleting classroom:", classroomError);
        throw new Error("Failed to delete classroom");
      }

      console.log("Successfully deleted classroom and all associated data");
    },
    onSuccess: () => {
      toast({
        title: "Classroom deleted",
        description: "The classroom and all associated content have been permanently deleted.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['classroom'] });
      queryClient.invalidateQueries({ queryKey: ['classroom-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['classroomProducts'] });
      
      onOpenChange(false);
      
      // Navigate to community page if communityId is provided, otherwise to communities list
      if (communityId) {
        navigate(`/community/${communityId}`);
      } else {
        navigate("/communities");
      }
    },
    onError: (error) => {
      console.error("Error deleting classroom:", error);
      toast({
        title: "Error", 
        description: "Failed to delete classroom. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Classroom</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the classroom "{classroomName}"?
            </p>
            <p className="font-medium text-destructive">
              This action is irreversible and will permanently delete:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All lessons in this classroom</li>
              <li>All associated products</li>
              <li>All classroom content and settings</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Classroom"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
