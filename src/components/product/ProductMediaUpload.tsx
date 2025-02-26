
import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { uploadImageToStorage } from "@/utils/product-image-utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";

interface ProductMediaUploadProps {
  productUuid: string;
  onFileSelect?: (file: File) => void;
}

export function ProductMediaUpload({ productUuid, onFileSelect }: ProductMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query existing product images
  const { data: images = [] } = useQuery({
    queryKey: ['productImages', productUuid],
    queryFn: async () => {
      console.log('Fetching images for product:', productUuid);
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_uuid', productUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching product images:', error);
        throw error;
      }

      console.log('Fetched images:', data);
      return data || [];
    },
    enabled: !!productUuid
  });

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
          is_primary: images.length === 0, // Make first image primary by default
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

  const handleSetPrimary = async (imageId: number) => {
    try {
      // Update all images to not primary
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_uuid', productUuid);

      // Set selected image as primary
      const { data: updatedImage, error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId)
        .select('url')
        .single();

      if (error) throw error;

      // Update product thumbnail
      if (updatedImage?.url) {
        await supabase
          .from('products')
          .update({ thumbnail: updatedImage.url })
          .eq('product_uuid', productUuid);
      }

      queryClient.invalidateQueries({
        queryKey: ['productImages', productUuid]
      });

      toast({
        title: "Success",
        description: "Primary image updated",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error",
        description: "Failed to update primary image",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (imageId: number, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('product_images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({
        queryKey: ['productImages', productUuid]
      });

      toast({
        title: "Success",
        description: "Image deleted successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ImageUploadArea
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((image) => (
            <Card key={image.id} className="relative group">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={supabase.storage.from('product_images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.file_name || 'Product image'}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.is_primary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleSetPrimary(image.id)}
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(image.id, image.storage_path)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Primary
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
