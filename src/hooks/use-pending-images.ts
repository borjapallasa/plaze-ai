
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface PendingImage {
  file: File;
  previewUrl: string;
}

export function usePendingImages() {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const { toast } = useToast();

  const addPendingImage = (file: File) => {
    console.log('usePendingImages: Adding pending image:', file.name);
    const previewUrl = URL.createObjectURL(file);
    setPendingImages(prevImages => {
      const newImages = [...prevImages, { file, previewUrl }];
      console.log('usePendingImages: New pending images state:', newImages);
      return newImages;
    });
  };

  const uploadPendingImages = async (productUuid: string) => {
    console.log('uploadPendingImages called with productUuid:', productUuid);
    console.log('Current pending images:', pendingImages);

    if (!productUuid) {
      console.error('usePendingImages: No product UUID provided for image upload');
      return;
    }

    if (pendingImages.length === 0) {
      console.log('usePendingImages: No pending images to upload');
      return;
    }

    try {
      console.log('usePendingImages: Starting upload for', pendingImages.length, 'images');
      
      // First, upload all files to storage and collect their data
      const uploadResults = await Promise.all(
        pendingImages.map(async (pendingImage, index) => {
          const fileExt = pendingImage.file.name.split('.').pop();
          const filePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;

          console.log('usePendingImages: Uploading file:', filePath);

          // Upload to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(filePath, pendingImage.file);

          if (uploadError) {
            console.error('usePendingImages: Storage upload error:', uploadError);
            throw uploadError;
          }

          console.log('usePendingImages: File uploaded successfully:', filePath);

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

      console.log('usePendingImages: All files uploaded to storage:', uploadResults);

      // Prepare database records
      const imageRecords = uploadResults.map(({ filePath, file, isPrimary }) => ({
        product_uuid: productUuid,
        storage_path: filePath,
        file_name: file.name,
        content_type: file.type,
        size: file.size,
        is_primary: isPrimary,
      }));

      console.log('usePendingImages: Inserting image records into database:', imageRecords);

      // Insert all image records in a single transaction
      const { data: insertedRecords, error: dbError } = await supabase
        .from('product_images')
        .insert(imageRecords)
        .select();

      if (dbError) {
        console.error('usePendingImages: Database insert error:', dbError);
        throw dbError;
      }

      console.log('usePendingImages: Image records inserted successfully:', insertedRecords);

      // Update product thumbnail with first image's URL if available
      if (uploadResults.length > 0) {
        console.log('usePendingImages: Updating product thumbnail with:', uploadResults[0].publicUrl);
        
        const { error: thumbnailError } = await supabase
          .from('products')
          .update({ thumbnail: uploadResults[0].publicUrl })
          .eq('product_uuid', productUuid);

        if (thumbnailError) {
          console.error('usePendingImages: Thumbnail update error:', thumbnailError);
          throw thumbnailError;
        }

        console.log('usePendingImages: Product thumbnail updated successfully');
      }

      // Clean up preview URLs and reset pending images
      pendingImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
      setPendingImages([]);

      toast({
        title: "Success",
        description: `Successfully uploaded ${uploadResults.length} image${uploadResults.length === 1 ? '' : 's'}`,
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      return uploadResults;

    } catch (error) {
      console.error('usePendingImages: Error in uploadPendingImages:', error);
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
