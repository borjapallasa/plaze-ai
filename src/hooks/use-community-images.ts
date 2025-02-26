import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CommunityImage } from "@/types/community-images";
import { useToast } from "@/components/ui/use-toast";

export function useCommunityImages(communityUuid: string | undefined) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['communityImages', communityUuid],
    queryFn: async () => {
      if (!communityUuid) return [];
      
      const { data, error } = await supabase
        .from('community_images')
        .select('*')
        .eq('community_uuid', communityUuid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to include the public URL
      return (data || []).map(image => ({
        ...image,
        url: supabase.storage
          .from('community_images')
          .getPublicUrl(image.storage_path)
          .data.publicUrl
      })) as CommunityImage[];
    },
    enabled: !!communityUuid,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  const uploadImage = async (file: File) => {
    if (!communityUuid) return;
    
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${communityUuid}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('community_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community_images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('community_images')
        .insert({
          community_uuid: communityUuid,
          storage_path: filePath,
          url: publicUrl,
          file_name: file.name,
          is_primary: images.length === 0 // Make first image primary
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
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

  const updateImage = async (imageId: number, updates: { file_name: string; alt_text: string }) => {
    try {
      const { error } = await supabase
        .from('community_images')
        .update(updates)
        .eq('id', imageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });
      
      toast({
        title: "Success",
        description: "Image details updated successfully",
      });
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: "Error",
        description: "Failed to update image details",
        variant: "destructive",
      });
    }
  };

  const removeImage = async (imageId: number, storagePath: string) => {
    try {
      // First remove from storage
      const { error: storageError } = await supabase.storage
        .from('community_images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Then remove from database
      const { error: dbError } = await supabase
        .from('community_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const reorderImages = async (imageId: number, currentPrimaryId: number) => {
    try {
      // Remove primary status from current primary image
      if (currentPrimaryId) {
        await supabase
          .from('community_images')
          .update({ is_primary: false })
          .eq('id', currentPrimaryId);
      }

      // Set new primary image
      const { error } = await supabase
        .from('community_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });
      
      toast({
        title: "Success",
        description: "Primary image updated successfully",
      });
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        title: "Error",
        description: "Failed to update primary image",
        variant: "destructive",
      });
    }
  };

  return {
    images,
    isLoading,
    isUploading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages
  };
}
