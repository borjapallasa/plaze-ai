
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useExpertImageUpload() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
          alt_text: `Profile image for expert`
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

  const setInitialPreview = (url: string | null) => {
    setPreviewUrl(url);
  };

  return {
    imageFile,
    previewUrl,
    handleImageChange,
    uploadImage,
    setInitialPreview
  };
}
