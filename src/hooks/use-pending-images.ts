
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface PendingImage {
  file: File;
  previewUrl: string;
}

export function usePendingImages() {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  const addPendingImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPendingImages(prev => [...prev, { file, previewUrl }]);
  };

  const uploadPendingImages = async (productUuid: string) => {
    if (pendingImages.length === 0) return;

    const uploadPromises = pendingImages.map(async (pendingImage, index) => {
      const fileExt = pendingImage.file.name.split('.').pop();
      const filePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, pendingImage.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      return {
        product_uuid: productUuid,
        storage_path: filePath,
        file_name: pendingImage.file.name,
        content_type: pendingImage.file.type,
        size: pendingImage.file.size,
        is_primary: index === 0,
      };
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      const { error: dbError } = await supabase
        .from('product_images')
        .insert(uploadedImages);

      if (dbError) throw dbError;

      // Update product thumbnail with the primary image
      if (uploadedImages.length > 0) {
        const primaryImage = uploadedImages[0];
        const { data: { publicUrl } } = supabase.storage
          .from('product_images')
          .getPublicUrl(primaryImage.storage_path);

        const { error: thumbnailError } = await supabase
          .from('products')
          .update({ thumbnail: publicUrl })
          .eq('product_uuid', productUuid);

        if (thumbnailError) throw thumbnailError;
      }

      // Clean up preview URLs
      pendingImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
      setPendingImages([]);

    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    pendingImages,
    addPendingImage,
    uploadPendingImages
  };
}
