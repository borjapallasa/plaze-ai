
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ExpertForm } from "./ExpertForm";
import { useExpertImageUpload } from "./useExpertImageUpload";
import type { EditExpertDetailsDialogProps, ExpertFormData } from "./types";

export function EditExpertDetailsDialog({ expert, onUpdate }: EditExpertDetailsDialogProps) {
  // Ensure initial areas is always an array
  const initialAreas = Array.isArray(expert.areas) ? expert.areas : [];
  
  const [formData, setFormData] = useState<ExpertFormData>({
    name: expert.name || "",
    title: expert.title || "",
    description: expert.description || "",
    location: expert.location || "",
    info: expert.info || "",
    areas: initialAreas,
    thumbnail: expert.thumbnail || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { 
    imageFile, 
    previewUrl, 
    handleImageChange, 
    uploadImage, 
    setInitialPreview 
  } = useExpertImageUpload();
  
  // Set initial preview when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setInitialPreview(expert.thumbnail || null);
    }
  }, [isOpen, expert.thumbnail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle toggling expertise areas
  const toggleArea = (areaValue: string) => {
    setFormData(prev => {
      const areas = [...prev.areas];
      const index = areas.indexOf(areaValue);
      
      if (index !== -1) {
        // Remove if already selected
        areas.splice(index, 1);
      } else {
        // Add if not already selected
        areas.push(areaValue);
      }
      
      return { ...prev, areas };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError(null);
    
    try {
      let thumbnailUrl = formData.thumbnail;

      // Upload image if selected
      if (imageFile) {
        console.log("Uploading image file:", imageFile.name);
        const uploadedUrl = await uploadImage(imageFile, expert.expert_uuid);
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
          console.log("Image uploaded successfully:", thumbnailUrl);
        }
      }

      // Ensure areas is an array before sending to Supabase
      const areas = Array.isArray(formData.areas) ? formData.areas : [];
      
      // Prepare the update data
      const updateData = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        info: formData.info,
        areas: areas,
        thumbnail: thumbnailUrl,
      };
      
      console.log("Updating expert with data:", updateData);
      console.log("Expert UUID:", expert.expert_uuid);

      // Update the expert in Supabase
      const { data, error } = await supabase
        .from("experts")
        .update(updateData)
        .eq("expert_uuid", expert.expert_uuid)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Error updating expert details:", error);
        setUpdateError(`Failed to update expert details: ${error.message}`);
        toast.error(`Failed to update expert details: ${error.message}`);
        throw error;
      }

      if (!data) {
        console.error("No data returned after update");
        setUpdateError("Failed to update expert details: No data returned");
        toast.error("Failed to update expert details: No data returned");
        throw new Error("No data returned after update");
      }

      // Ensure areas is an array in the returned data
      if (data.areas) {
        try {
          // If areas is a string, try to parse it as JSON
          if (typeof data.areas === 'string') {
            data.areas = JSON.parse(data.areas);
          }
          // If it's not an array after parsing, make it an empty array
          if (!Array.isArray(data.areas)) {
            data.areas = [];
          }
        } catch (e) {
          console.error('Error parsing areas in returned data:', e);
          data.areas = [];
        }
      } else {
        data.areas = [];
      }

      console.log("Update successful, received data:", data);
      toast.success("Expert details updated successfully");
      onUpdate(data);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating expert details:", error);
      if (!updateError) {
        setUpdateError("Failed to update expert details");
        toast.error("Failed to update expert details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
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
        <ExpertForm
          formData={formData}
          previewUrl={previewUrl}
          isSubmitting={isSubmitting}
          updateError={updateError}
          onFormChange={handleChange}
          onToggleArea={toggleArea}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
