
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
import { CATEGORIES, SUBCATEGORIES } from "@/constants/service-categories";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface EditExpertDetailsDialogProps {
  expert: Expert;
  onUpdate: (updatedExpert: Expert) => void;
}

// Flatten all subcategories into a single array for easier selection
const allExpertiseAreas = [
  ...CATEGORIES.map(cat => ({ value: cat.value, label: cat.label, group: "General Categories" })),
  ...Object.entries(SUBCATEGORIES).flatMap(([category, subcats]) => 
    subcats.map(subcat => ({ 
      value: subcat.value, 
      label: subcat.label, 
      group: CATEGORIES.find(c => c.value === category)?.label || category 
    }))
  )
];

export function EditExpertDetailsDialog({ expert, onUpdate }: EditExpertDetailsDialogProps) {
  // Ensure initial areas is always an array
  const initialAreas = Array.isArray(expert.areas) ? expert.areas : [];
  
  const [formData, setFormData] = useState({
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(expert.thumbnail || null);
  const [updateError, setUpdateError] = useState<string | null>(null);

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
      onUpdate(data as Expert);
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

  // Group expertise areas by category for better organization in the dropdown
  const groupedAreas = allExpertiseAreas.reduce((acc, area) => {
    if (!acc[area.group]) {
      acc[area.group] = [];
    }
    acc[area.group].push(area);
    return acc;
  }, {} as Record<string, typeof allExpertiseAreas>);

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
          {updateError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {updateError}
            </div>
          )}
          
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
              <Label>Expertise Areas</Label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                    >
                      Select Areas of Expertise
                      <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium">
                        {formData.areas.length}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[220px] max-h-[300px] overflow-y-auto">
                    {Object.entries(groupedAreas).map(([group, areas]) => (
                      <React.Fragment key={group}>
                        <DropdownMenuLabel>{group}</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {areas.map((area) => (
                            <DropdownMenuCheckboxItem
                              key={area.value}
                              checked={formData.areas.includes(area.value)}
                              onCheckedChange={() => toggleArea(area.value)}
                            >
                              {area.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                      </React.Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Display selected areas as badges */}
              {formData.areas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.areas.map(area => {
                    const areaInfo = allExpertiseAreas.find(a => a.value === area);
                    return (
                      <Badge 
                        key={area} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {areaInfo?.label || area}
                        <button 
                          type="button" 
                          onClick={() => toggleArea(area)}
                          className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                        >
                          <span className="sr-only">Remove</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
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
