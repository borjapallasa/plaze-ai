
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ProductImage {
  id: number;
  url: string;
  storage_path: string;
  is_primary: boolean;
  file_name: string;
}

export function useProductImages(productUuid?: string) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchImages() {
      if (!productUuid) return;

      try {
        const { data, error } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_uuid', productUuid);

        if (error) throw error;

        const imagesWithUrls = await Promise.all(data.map(async (image) => {
          const { data: { publicUrl } } = supabase.storage
            .from('product_images')
            .getPublicUrl(image.storage_path);

          return {
            id: image.id,
            url: publicUrl,
            storage_path: image.storage_path,
            is_primary: image.is_primary,
            file_name: image.file_name
          };
        }));

        setImages(imagesWithUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Error",
          description: "Failed to load existing images",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [productUuid, toast]);

  const uploadImage = useCallback(async (file: File) => {
    if (!productUuid) {
      toast({
        title: "Error",
        description: "Product ID is required to upload images",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const storagePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(storagePath);

      const { data, error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_uuid: productUuid,
          storage_path: storagePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: images.length === 0
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setImages(prev => [...prev, {
        id: data.id,
        url: publicUrl,
        storage_path: data.storage_path,
        is_primary: data.is_primary,
        file_name: data.file_name
      }]);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [productUuid, images, toast]);

  const updateImage = async (imageId: number, updates: { file_name?: string }) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .update(updates)
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, ...updates }
          : img
      ));

      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    }
  };

  const removeImage = async (imageId: number, storagePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('product_images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      setImages(prev => prev.filter(img => img.id !== imageId));

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  return {
    images,
    isUploading,
    isLoading,
    uploadImage,
    updateImage,
    removeImage
  };
}
