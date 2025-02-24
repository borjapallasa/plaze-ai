
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UploadCloud, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
  file_name: string;
}

interface ProductMediaUploadProps {
  productUuid?: string;
}

export function ProductMediaUpload({ productUuid }: ProductMediaUploadProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const storagePath = `${productUuid}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(storagePath);

      // Create database record
      const { data, error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_uuid: productUuid,
          storage_path: storagePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: images.length === 0 // First image is primary
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setImages(prev => [...prev, {
        id: data.id,
        url: publicUrl,
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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  }, [uploadImage]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadImage(file);
    }
  }, [uploadImage]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveImage = async (imageId: number, storagePath: string) => {
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

  return (
    <div className="space-y-4">
      <div 
        className="col-span-2 aspect-[3/2] rounded-lg border-2 border-dashed relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="imageUpload"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label
          htmlFor="imageUpload"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-6 w-6 animate-bounce" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <p className="text-sm text-muted-foreground">Drop an image here or click to upload</p>
            </div>
          )}
        </label>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group aspect-square rounded-lg border bg-muted">
            <img
              src={image.url}
              alt={image.file_name}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(image.id, image.url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
