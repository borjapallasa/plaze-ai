
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pen, Upload } from "lucide-react";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(expert.thumbnail || null);

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

  const uploadImage = async (file: File, expertUuid: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${expertUuid}-${Date.now()}.${fileExt}`;
    const filePath = `expert_images/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload image');
        return null;
      }

      const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      // Store image metadata in expert_images table
      const { error: metadataError } = await supabase
        .from('expert_images')
        .insert({
          expert_uuid: expertUuid,
          storage_path: filePath,
          file_name: fileName,
          content_type: file.type,
          size: file.size,
          is_primary: true,
          alt_text: `Profile image for ${formData.name}`
        });

      if (metadataError) {
        console.error('Error storing image metadata:', metadataError);
        toast.error('Failed to store image metadata');
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Error in image upload process:', error);
      toast.error('Image upload process failed');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      // Upload image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, expert.expert_uuid);
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        }
      }

      const { data, error } = await supabase
        .from("experts")
        .update({
          name: formData.name,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          info: formData.info,
          areas: formData.areas,
          thumbnail: thumbnailUrl,
        })
        .eq("expert_uuid", expert.expert_uuid)
        .select()
        .single();

      if (error) {
        throw error;
      }

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
          
          <div className="space-y-3">
            <Label htmlFor="thumbnail">Profile Image</Label>
            
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="h-40 w-40 rounded-full object-cover border-2 border-border"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="imageUpload" className="sr-only">Upload Image</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              
              <p className="text-xs text-muted-foreground">
                You can upload a JPG, PNG or GIF file (max 10MB).
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Or enter image URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/your-image.jpg"
              />
            </div>
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
