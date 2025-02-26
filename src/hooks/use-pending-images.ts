
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PendingImage {
  file: File;
  previewUrl: string;
}

export function usePendingImages() {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const { toast } = useToast();

  const addPendingImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPendingImages(prev => [...prev, { file, previewUrl }]);
  };

  const uploadPendingImages = async (productUuid: string) => {
    if (!productUuid) {
      console.error('No product UUID provided for image upload');
      return;
    }

    if (pendingImages.length === 0) return;

    try {
      // First, upload all files to storage and collect their data
      const uploadResults = await Promise.all(
        pendingImages.map(async (pendingImage, index) => {
          const fileExt = pendingImage.file.name.split('.').pop();
          const filePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(filePath, pendingImage.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw uploadError;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product_images')
            .getPublicUrl(filePath);

          return {
            filePath,
            publicUrl,
            file: pendingImage.file,
            isPrimary: index === 0
          };
        })
      );

      // Prepare database records
      const imageRecords = uploadResults.map(({ filePath, file, isPrimary }) => ({
        product_uuid: productUuid,
        storage_path: filePath,
        file_name: file.name,
        content_type: file.type,
        size: file.size,
        is_primary: isPrimary,
      }));

      // Insert all image records in a single transaction
      const { error: dbError } = await supabase
        .from('product_images')
        .insert(imageRecords);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      // Update product thumbnail with first image's URL
      if (uploadResults.length > 0) {
        const { error: thumbnailError } = await supabase
          .from('products')
          .update({ thumbnail: uploadResults[0].publicUrl })
          .eq('product_uuid', productUuid);

        if (thumbnailError) {
          console.error('Thumbnail update error:', thumbnailError);
          throw thumbnailError;
        }
      }

      // Clean up preview URLs
      pendingImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
      setPendingImages([]);

      toast({
        title: "Success",
        description: "Images uploaded successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

    } catch (error) {
      console.error('Error in uploadPendingImages:', error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
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
