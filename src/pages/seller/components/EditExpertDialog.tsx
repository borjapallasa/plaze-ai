
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Expert } from "@/types/expert";

interface EditExpertDialogProps {
  expert: Expert;
  onUpdate: (updatedExpert: Expert) => void;
  trigger?: React.ReactNode;
}

export function EditExpertDialog({ expert, onUpdate, trigger }: EditExpertDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: expert.name || "",
    title: expert.title || "",
    description: expert.description || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatePayload = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
      };

      console.log("Update payload:", updatePayload);

      // First check if the expert exists
      const { data: existingExpert, error: checkError } = await supabase
        .from('experts')
        .select('*')
        .eq('expert_uuid', expert.expert_uuid)
        .single();

      if (checkError) {
        console.error('Error checking expert existence:', checkError);
        toast.error(`Failed to verify expert: ${checkError.message}`);
        setIsLoading(false);
        return;
      }

      console.log("Existing expert found:", existingExpert);

      // Perform the update operation
      const { data, error } = await supabase
        .from('experts')
        .update(updatePayload)
        .eq('expert_uuid', expert.expert_uuid)
        .select();

      if (error) {
        console.error('Error updating expert:', error);
        toast.error(`Failed to update profile: ${error.message}`);
        setIsLoading(false);
        return;
      }

      console.log("Expert update response:", data);

      if (!data || data.length === 0) {
        console.error('No data returned after update');
        toast.error("Failed to update profile: No data returned");
        setIsLoading(false);
        return;
      }

      // Create an updated expert object by merging the original expert with the form data
      const updatedExpert: Expert = {
        ...expert,
        name: formData.name,
        title: formData.title,
        description: formData.description
      };

      // Call the onUpdate callback to update the parent component
      onUpdate(updatedExpert);
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="ml-2">
      <Pencil className="h-4 w-4 mr-1" />
      Edit Profile
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expert Profile</DialogTitle>
          <DialogDescription>
            Make changes to your expert profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Professional title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your expertise"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
