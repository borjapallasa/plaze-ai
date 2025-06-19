
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Expert } from "@/types/expert";

interface EditExpertStatusDialogProps {
  expert: Expert;
  onUpdate: (updatedExpert: Expert) => void;
  trigger?: React.ReactNode;
}

export function EditExpertStatusDialog({ expert, onUpdate, trigger }: EditExpertStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>(expert.status || "in review");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Updating expert status to:", status);

      const { data, error } = await supabase
        .from('experts')
        .update({ status: status as any })
        .eq('expert_uuid', expert.expert_uuid)
        .select();

      if (error) {
        console.error('Error updating expert status:', error);
        toast.error(`Failed to update status: ${error.message}`);
        setIsLoading(false);
        return;
      }

      console.log("Expert status update response:", data);

      if (!data || data.length === 0) {
        console.error('No data returned after update');
        toast.error("Failed to update status: No data returned");
        setIsLoading(false);
        return;
      }

      // Create an updated expert object with the new status
      const updatedExpert: Expert = {
        ...expert,
        status: status as any
      };

      // Call the onUpdate callback to update the parent component
      onUpdate(updatedExpert);
      toast.success("Status updated successfully");
      setOpen(false);
    } catch (error) {
      console.error('Error in status update:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="ml-2">
      <Settings className="h-4 w-4 mr-1" />
      Edit Status
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Expert Status</DialogTitle>
          <DialogDescription>
            Change the approval status for this expert profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in review">In Review</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
