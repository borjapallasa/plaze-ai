
import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
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
    if (onFileSelect) {
      // For new products, just add to pending images
      onFileSelect(file);
      return;
    }

    // For existing products, upload immediately
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      // Create database record
      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_uuid: productUuid,
          storage_path: filePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: false,
        });

      if (dbError) {
        throw dbError;
      }

      // Invalidate product images query
      queryClient.invalidateQueries(['productImages', productUuid]);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
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
