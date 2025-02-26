
import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { uploadImageToStorage } from "@/utils/product-image-utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProductMediaUploadProps {
  productUuid: string;
  onFileSelect?: (file: File) => void;
}

export function ProductMediaUpload({ productUuid, onFileSelect }: ProductMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileSelect = async (file: File) => {
    console.log('ProductMediaUpload: handleFileSelect called with file:', file.name);
    console.log('ProductMediaUpload: onFileSelect prop exists:', !!onFileSelect);
    console.log('ProductMediaUpload: productUuid:', productUuid);

    if (onFileSelect) {
      console.log('ProductMediaUpload: Using onFileSelect for new product');
      onFileSelect(file);
      return;
    }

    // For existing products, upload immediately
    try {
      console.log('ProductMediaUpload: Starting immediate upload for existing product');
      setIsUploading(true);

      const { publicUrl, storagePath } = await uploadImageToStorage(file, productUuid);

      console.log('ProductMediaUpload: Image uploaded, creating database record');

      // Create database record
      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_uuid: productUuid,
          storage_path: storagePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: false,
          url: publicUrl
        });

      if (dbError) {
        console.error('ProductMediaUpload: Database insert error:', dbError);
        throw dbError;
      }

      console.log('ProductMediaUpload: Database record created successfully');

      // Invalidate product images query
      queryClient.invalidateQueries({
        queryKey: ['productImages', productUuid]
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });
    } catch (error) {
      console.error('ProductMediaUpload: Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ImageUploadArea
      onFileSelect={handleFileSelect}
      isUploading={isUploading}
    />
  );
}
