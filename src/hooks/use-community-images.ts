
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import type { CommunityImage } from "@/types/community-images";

export function useCommunityImages(communityUuid: string, initialImages: CommunityImage[] = []) {
  const [images, setImages] = useState<CommunityImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  console.log('useCommunityImages: hook called with communityUuid =', communityUuid);
  console.log('useCommunityImages: user =', user?.id);

  // Fetch images from database
  useEffect(() => {
    const fetchImages = async () => {
      if (!communityUuid || communityUuid === 'temp') {
        console.log('useCommunityImages: Skipping fetch for temp or empty UUID');
        return;
      }

      console.log('useCommunityImages: Fetching images for community:', communityUuid);
      
      try {
        const { data, error } = await supabase
          .from("community_images")
          .select("*")
          .eq("community_uuid", communityUuid)
          .order("is_primary", { ascending: false });

        console.log('useCommunityImages: Raw fetch result:', { data, error });

        if (error) {
          console.error('useCommunityImages: Error fetching images:', error);
          toast.error("Failed to load community images");
          return;
        }
        
        // Add public URL to each image before setting state
        const imagesWithUrls = data?.map(image => {
          const { data: urlData } = supabase.storage
            .from('community-images')
            .getPublicUrl(image.storage_path);
            
          console.log('useCommunityImages: URL for image', image.id, ':', urlData?.publicUrl);
            
          return {
            ...image,
            url: urlData?.publicUrl
          };
        }) || [];
        
        console.log('useCommunityImages: Setting images:', imagesWithUrls);
        setImages(imagesWithUrls);
      } catch (error) {
        console.error("useCommunityImages: Unexpected error fetching images:", error);
        toast.error("Failed to load community images");
      }
    };

    fetchImages();
  }, [communityUuid]);

  const uploadImage = async (file: File) => {
    if (!user) {
      console.error('useCommunityImages: No authenticated user');
      toast.error("You must be logged in to upload images");
      return null;
    }

    if (!communityUuid) {
      console.error('useCommunityImages: No community UUID provided');
      toast.error("No community UUID provided");
      return null;
    }

    console.log('useCommunityImages: Starting upload for file:', file.name, 'to community:', communityUuid);
    setIsUploading(true);

    try {
      // Generate a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${communityUuid}/${Date.now()}.${fileExt}`;
      
      console.log('useCommunityImages: Uploading to storage path:', filePath);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('useCommunityImages: Storage upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('useCommunityImages: File uploaded successfully to storage');
      
      // Get public URL
      const { data: publicURLData } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);
        
      if (!publicURLData.publicUrl) {
        console.error('useCommunityImages: Failed to get public URL');
        throw new Error("Failed to get public URL");
      }

      console.log('useCommunityImages: Got public URL:', publicURLData.publicUrl);

      // For temporary community, just return the URL without creating a database entry
      if (communityUuid === 'temp') {
        console.log('useCommunityImages: Returning temp result');
        return { url: publicURLData.publicUrl, storage_path: filePath };
      }

      // Create database entry for real communities
      console.log('useCommunityImages: Creating database entry');
      const { data, error: dbError } = await supabase
        .from("community_images")
        .insert({
          community_uuid: communityUuid,
          storage_path: filePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: images.length === 0 // First image becomes primary
        })
        .select()
        .single();

      if (dbError) {
        console.error('useCommunityImages: Database insert error:', dbError);
        throw dbError;
      }

      console.log('useCommunityImages: Database entry created:', data);

      const newImage = { ...data, url: publicURLData.publicUrl };
      setImages(prev => [...prev, newImage]);
      
      toast.success("Image uploaded successfully");
      return newImage;
    } catch (error) {
      console.error("useCommunityImages: Upload error:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const updateImage = async (id: number, updates: { file_name: string; alt_text: string }) => {
    try {
      console.log('useCommunityImages: Updating image', id, 'with:', updates);
      
      const { error } = await supabase
        .from("community_images")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, ...updates } : img
      ));
      
      toast.success("Image details updated");
    } catch (error) {
      console.error("useCommunityImages: Error updating image:", error);
      toast.error("Failed to update image details");
    }
  };

  const removeImage = async (id: number, storagePath: string) => {
    try {
      console.log('useCommunityImages: Removing image', id, 'at path:', storagePath);
      
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

      setImages(prev => prev.filter(img => img.id !== id));
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("useCommunityImages: Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const reorderImages = async (primaryId: number, currentPrimaryId: number) => {
    try {
      console.log('useCommunityImages: Reordering images, new primary:', primaryId, 'current:', currentPrimaryId);
      
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

      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === primaryId
      })));

      toast.success("Primary image updated");
    } catch (error) {
      console.error("useCommunityImages: Error reordering images:", error);
      toast.error("Failed to update primary image");
    }
  };

  return {
    images,
    isUploading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages
  };
}
