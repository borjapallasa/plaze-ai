
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CommunityImage } from "@/types/community-images";

export function useCommunityImages(communityUuid: string) {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images when communityUuid changes
  useEffect(() => {
    if (communityUuid && communityUuid !== 'temp') {
      fetchImages();
    } else {
      setImages([]);
      setIsLoading(false);
    }
  }, [communityUuid]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("community_images")
        .select("*")
        .eq("community_uuid", communityUuid)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      
      // Add public URL to each image before setting state
      const imagesWithUrls = data?.map(image => {
        const { data } = supabase.storage
          .from('community-images')
          .getPublicUrl(image.storage_path);
          
        return {
          ...image,
          url: data.publicUrl
        };
      }) || [];
      
      setImages(imagesWithUrls);
    } catch (error) {
      console.error("Error fetching community images:", error);
      toast.error("Failed to load community images");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!communityUuid) {
      toast.error("No community UUID provided");
      return null;
    }

    try {
      setIsUploading(true);
      
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${communityUuid}/${Date.now()}.${fileExt}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicURLData } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);
        
      if (!publicURLData.publicUrl) throw new Error("Failed to get public URL");

      // For temporary community, just return the URL without creating a database entry
      if (communityUuid === 'temp') {
        return { url: publicURLData.publicUrl, storage_path: filePath };
      }

      // Create database entry for real communities
      const { data, error: dbError } = await supabase
        .from("community_images")
        .insert({
          community_uuid: communityUuid,
          storage_path: filePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: images.length === 0 // First image is primary
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Update local state
      setImages(prev => {
        // If this is the first image, make it primary
        if (prev.length === 0) {
          return [{ ...data, url: publicURLData.publicUrl }];
        }
        return [...prev, { ...data, url: publicURLData.publicUrl }];
      });

      toast.success("Image uploaded successfully");
      return { ...data, url: publicURLData.publicUrl };
    } catch (error) {
      console.error("Error uploading community image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const updateImage = async (id: number, updates: { file_name: string; alt_text: string }) => {
    try {
      const { error } = await supabase
        .from("community_images")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setImages(prev => 
        prev.map(img => 
          img.id === id ? { ...img, ...updates } : img
        )
      );

      toast.success("Image details updated");
    } catch (error) {
      console.error("Error updating image details:", error);
      toast.error("Failed to update image details");
      throw error;
    }
  };

  const removeImage = async (id: number, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('community-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("community_images")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // Update local state
      setImages(prev => prev.filter(img => img.id !== id));

      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing community image:", error);
      toast.error("Failed to remove image");
    }
  };

  const reorderImages = async (primaryId: number, currentPrimaryId: number) => {
    try {
      // Update the current primary image to not be primary
      if (currentPrimaryId) {
        await supabase
          .from("community_images")
          .update({ is_primary: false })
          .eq("id", currentPrimaryId);
      }

      // Set the new primary image
      const { error } = await supabase
        .from("community_images")
        .update({ is_primary: true })
        .eq("id", primaryId);

      if (error) throw error;

      // Update local state
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === primaryId
      })));

      toast.success("Primary image updated");
    } catch (error) {
      console.error("Error reordering community images:", error);
      toast.error("Failed to update primary image");
    }
  };

  return {
    images,
    isLoading,
    isUploading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages,
    fetchImages
  };
}
