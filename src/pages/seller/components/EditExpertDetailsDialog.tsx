
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/types/expert";

interface EditExpertDetailsDialogProps {
  expert: Expert;
  onUpdate: (updatedExpert: Expert) => void;
}

export function EditExpertDetailsDialog({ expert, onUpdate }: EditExpertDetailsDialogProps) {
  const [formData, setFormData] = useState({
    name: expert.name || "",
    title: expert.title || "",
    description: expert.description || "",
    location: expert.location || "",
    info: expert.info || "",
    areas: expert.areas || [],
    thumbnail: expert.thumbnail || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const areasString = e.target.value;
    // Split by commas and trim whitespace
    const areasArray = areasString.split(",").map(area => area.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, areas: areasArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("experts")
        .update({
          name: formData.name,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          info: formData.info,
          areas: formData.areas,
          thumbnail: formData.thumbnail,
        })
        .eq("expert_uuid", expert.expert_uuid)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success("Expert details updated successfully");
      onUpdate(data as Expert);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating expert details:", error);
      toast.error("Failed to update expert details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pen className="h-4 w-4" />
          Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Expert Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="e.g. UI/UX Designer"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell potential clients about yourself"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. New York, USA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areas">Expertise Areas</Label>
              <Input
                id="areas"
                name="areas"
                value={formData.areas.join(", ")}
                onChange={handleAreasChange}
                placeholder="e.g. Design, Development, Marketing (comma separated)"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="info">Additional Information</Label>
            <Textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleChange}
              placeholder="Any other information you'd like to share"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Profile Image URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/your-image.jpg"
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
