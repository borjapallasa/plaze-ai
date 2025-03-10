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
import type { Json } from "@/integrations/supabase/types";

interface EditExpertDialogProps {
  expert: Expert;
  onUpdate: (updatedExpert: Expert) => void;
}

export function EditExpertDialog({ expert, onUpdate }: EditExpertDialogProps) {
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

  // Helper function to convert Json array to string array
  const convertJsonArrayToStringArray = (jsonArray: Json | null): string[] => {
    if (!jsonArray) return [];
    
    // If it's already an array, map each item to a string
    if (Array.isArray(jsonArray)) {
      return jsonArray.map(item => String(item));
    }
    
    // If it's a string (possibly JSON), try to parse it
    if (typeof jsonArray === 'string') {
      try {
        const parsed = JSON.parse(jsonArray);
        if (Array.isArray(parsed)) {
          return parsed.map(item => String(item));
        }
      } catch (e) {
        console.error('Error parsing JSON string:', e);
      }
    }
    
    // Fallback to empty array
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Using maybeSingle() instead of single() to handle cases where no rows are returned
      const { data, error } = await supabase
        .from('experts')
        .update({
          name: formData.name,
          title: formData.title,
          description: formData.description
        })
        .eq('expert_uuid', expert.expert_uuid)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating expert:', error);
        toast.error(`Failed to update profile: ${error.message}`);
        return;
      }

      if (!data) {
        toast.error("No expert found with the provided ID");
        return;
      }

      // Ensure we maintain the correct types by creating a properly typed Expert object
      const updatedExpert: Expert = {
        ...expert, // Keep existing expert data
        ...data,   // Spread new data while maintaining existing types
        areas: convertJsonArrayToStringArray(data.areas), // Convert areas to string array
        name: formData.name,
        title: formData.title,
        description: formData.description
      };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Pencil className="h-4 w-4 mr-1" />
          Edit Profile
        </Button>
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
