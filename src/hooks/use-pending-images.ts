
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
      console.log('Starting upload for', pendingImages.length, 'images');
      
      // First, upload all files to storage and collect their data
      const uploadResults = await Promise.all(
        pendingImages.map(async (pendingImage, index) => {
          const fileExt = pendingImage.file.name.split('.').pop();
          const filePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;

          console.log('Uploading file:', filePath);

          // Upload to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(filePath, pendingImage.file);

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw uploadError;
          }

          console.log('File uploaded successfully:', filePath);

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

      console.log('All files uploaded to storage:', uploadResults);

      // Prepare database records
      const imageRecords = uploadResults.map(({ filePath, file, isPrimary }) => ({
        product_uuid: productUuid,
        storage_path: filePath,
        file_name: file.name,
        content_type: file.type,
        size: file.size,
        is_primary: isPrimary,
      }));

      console.log('Inserting image records into database:', imageRecords);

      // Insert all image records in a single transaction
      const { data: insertedRecords, error: dbError } = await supabase
        .from('product_images')
        .insert(imageRecords)
        .select();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('Image records inserted successfully:', insertedRecords);

      // Update product thumbnail with first image's URL if available
      if (uploadResults.length > 0) {
        console.log('Updating product thumbnail with:', uploadResults[0].publicUrl);
        
        const { error: thumbnailError } = await supabase
          .from('products')
          .update({ thumbnail: uploadResults[0].publicUrl })
          .eq('product_uuid', productUuid);

        if (thumbnailError) {
          console.error('Thumbnail update error:', thumbnailError);
          throw thumbnailError;
        }

        console.log('Product thumbnail updated successfully');
      }

      // Clean up preview URLs
      pendingImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
      setPendingImages([]);

      toast({
        title: "Success",
        description: `Successfully uploaded ${uploadResults.length} image${uploadResults.length === 1 ? '' : 's'}`,
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      return uploadResults;

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
