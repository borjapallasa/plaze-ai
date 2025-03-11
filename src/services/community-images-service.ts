
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CommunityImage } from "@/types/community-images";

/**
 * Fetches all images for a specific community
 */
export const fetchCommunityImages = async (communityUuid: string): Promise<CommunityImage[]> => {
  if (!communityUuid || communityUuid === 'temp') {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from("community_images")
      .select("*")
      .eq("community_uuid", communityUuid)
      .order("is_primary", { ascending: false });

    if (error) throw error;
    
    // Add public URL to each image before returning
    const imagesWithUrls = data?.map(image => {
      const { data: urlData } = supabase.storage
        .from('community-images')
        .getPublicUrl(image.storage_path);
        
      return {
        ...image,
        url: urlData?.publicUrl
      };
    }) || [];
    
    return imagesWithUrls;
  } catch (error) {
    console.error("Error fetching community images:", error);
    toast.error("Failed to load community images");
    return [];
  }
};

/**
 * Uploads an image to Supabase storage and optionally creates a database entry
 */
export const uploadCommunityImage = async (
  file: File,
  communityUuid: string
): Promise<{ url: string; storage_path: string } | null> => {
  if (!communityUuid) {
    toast.error("No community UUID provided");
    return null;
  }

  try {
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
        is_primary: false // Will be updated if this is the first image
      })
      .select()
      .single();

    if (dbError) throw dbError;

    toast.success("Image uploaded successfully");
    return { ...data, url: publicURLData.publicUrl };
  } catch (error) {
    console.error("Error uploading community image:", error);
    toast.error("Failed to upload image");
    return null;
  }
};

/**
 * Updates an image's metadata
 */
export const updateCommunityImage = async (
  id: number, 
  updates: { file_name: string; alt_text: string }
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("community_images")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    toast.success("Image details updated");
  } catch (error) {
    console.error("Error updating image details:", error);
    toast.error("Failed to update image details");
    throw error;
  }
};

/**
 * Removes an image from storage and database
 */
export const removeCommunityImage = async (
  id: number, 
  storagePath: string
): Promise<void> => {
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

    toast.success("Image removed successfully");
  } catch (error) {
    console.error("Error removing community image:", error);
    toast.error("Failed to remove image");
  }
};

/**
 * Sets the primary image for a community
 */
export const setPrimaryImage = async (
  primaryId: number, 
  currentPrimaryId: number
): Promise<void> => {
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

    toast.success("Primary image updated");
  } catch (error) {
    console.error("Error reordering community images:", error);
    toast.error("Failed to update primary image");
  }
};
