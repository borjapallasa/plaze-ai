
import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";

interface CommunityMediaUploadProps {
  communityUuid: string;
  onFileSelect?: (file: File) => void;
  initialImages?: Array<{
    id: number;
    url: string;
    storage_path: string;
    is_primary: boolean;
    file_name: string;
  }>;
}

export function CommunityMediaUpload({ 
  communityUuid,
  onFileSelect,
  initialImages = []
}: CommunityMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query existing community images
  const { data: images = initialImages } = useQuery({
    queryKey: ['communityImages', communityUuid],
    queryFn: async () => {
      console.log('Fetching images for community:', communityUuid);
      const { data, error } = await supabase
        .from('community_images')
        .select('*')
        .eq('community_uuid', communityUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community images:', error);
        throw error;
      }

      return data.map(img => ({
        id: img.id,
        url: supabase.storage.from('community_images').getPublicUrl(img.storage_path).data.publicUrl,
        storage_path: img.storage_path,
        is_primary: img.is_primary,
        file_name: img.file_name
      }));
    },
    enabled: !!communityUuid && !initialImages.length
  });

  const handleFileSelect = async (file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${communityUuid}/${crypto.randomUUID()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('community_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community_images')
        .getPublicUrl(filePath);

      // Create database record
      const { error: dbError } = await supabase
        .from('community_images')
        .insert({
          community_uuid: communityUuid,
          storage_path: filePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: images.length === 0 // Make first image primary by default
        });

      if (dbError) throw dbError;

      // If this is the first image, update community thumbnail
      if (images.length === 0) {
        const { error: updateError } = await supabase
          .from('communities')
          .update({ thumbnail: publicUrl })
          .eq('community_uuid', communityUuid);

        if (updateError) throw updateError;
      }

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        className: "bg-green-50 border-green-200",
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

  const handleSetPrimary = async (imageId: number) => {
    try {
      // Update all images to not primary
      await supabase
        .from('community_images')
        .update({ is_primary: false })
        .eq('community_uuid', communityUuid);

      // Set selected image as primary
      const { error } = await supabase
        .from('community_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      // Get the storage path of the new primary image
      const { data: primaryImage } = await supabase
        .from('community_images')
        .select('storage_path')
        .eq('id', imageId)
        .single();

      if (primaryImage) {
        const { data: { publicUrl } } = supabase.storage
          .from('community_images')
          .getPublicUrl(primaryImage.storage_path);

        // Update community thumbnail
        await supabase
          .from('communities')
          .update({ thumbnail: publicUrl })
          .eq('community_uuid', communityUuid);
      }

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Primary image updated",
        className: "bg-green-50 border-green-200",
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
        .from('community_images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('community_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Image deleted successfully",
        className: "bg-green-50 border-green-200",
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
                  src={image.url}
                  alt={image.file_name || 'Community image'}
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
