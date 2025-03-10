
import React, { useState, useEffect } from "react";
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
import type { EditExpertDetailsDialogProps, ExpertFormData } from "./types";

export function EditExpertDetailsDialog({ expert, onUpdate }: EditExpertDetailsDialogProps) {
  // Ensure initial areas is always an array of strings
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Set initial preview when dialog opens
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(expert.thumbnail || null);
    }
  }, [isOpen, expert.thumbnail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  // Upload image file to Supabase Storage
  const uploadImage = async (file: File, expertUuid: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${expertUuid}-${Date.now()}.${fileExt}`;
      const filePath = `expert_images/${fileName}`;

      console.log("Uploading image:", filePath);
      
      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload image');
        return null;
      }

      console.log("Image uploaded successfully, getting public URL");
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error in image upload process:', error);
      toast.error('Image upload process failed');
      return null;
    }
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

      // Ensure areas is an array of strings before sending to Supabase
      const areas = Array.isArray(formData.areas) ? formData.areas.map(area => String(area)) : [];
      
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

      // Update the expert in Supabase - Using maybeSingle() instead of single()
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

      console.log("Update successful, received data:", data);
      
      // Make sure we have data before continuing
      if (!data) {
        setUpdateError("No expert record found to update");
        toast.error("No expert record found to update");
        throw new Error("No expert record found to update");
      }
      
      // Create a properly typed expert object to pass to onUpdate
      const updatedExpert = {
        ...expert,
        ...data,
        // Ensure areas is an array of strings
        areas: Array.isArray(data.areas) 
          ? data.areas.map(area => String(area))
          : typeof data.areas === 'string'
            ? JSON.parse(data.areas).map((area: unknown) => String(area))
            : [],
        thumbnail: thumbnailUrl // Ensure this is the most up-to-date thumbnail
      };

      toast.success("Expert details updated successfully");
      onUpdate(updatedExpert);
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
