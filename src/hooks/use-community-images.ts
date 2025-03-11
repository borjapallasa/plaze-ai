
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CommunityImage } from "@/types/community-images";
import {
  fetchCommunityImages,
  uploadCommunityImage,
  updateCommunityImage,
  removeCommunityImage,
  setPrimaryImage
} from "@/services/community-images-service";

export function useCommunityImages(
  communityUuid: string, 
  initialImages: Array<{
    id: number;
    url: string;
    storage_path: string;
    is_primary: boolean;
    file_name: string;
  }> = []
) {
  const [images, setImages] = useState<CommunityImage[]>(initialImages as CommunityImage[]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images when communityUuid changes
  useEffect(() => {
    if (communityUuid && communityUuid !== 'temp') {
      loadImages();
    } else {
      // For 'temp' mode, we'll use the initialImages if available or an empty array
      setImages(initialImages as CommunityImage[]);
      setIsLoading(false);
    }
  }, [communityUuid]);

  const loadImages = async () => {
    if (!communityUuid || communityUuid === 'temp') {
      setImages(initialImages as CommunityImage[]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const fetchedImages = await fetchCommunityImages(communityUuid);
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error loading community images:", error);
      toast.error("Failed to load community images");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    console.log("Uploading image for community:", communityUuid);
    
    try {
      const result = await uploadCommunityImage(file, communityUuid);
      
      if (result) {
        console.log("Upload successful:", result);
        
        if (communityUuid === 'temp') {
          return result;
        }
        
        // Update local state
        const newImage = { ...result, url: result.url } as CommunityImage;
        
        // If this is the first image, make it primary
        if (images.length === 0) {
          await setPrimaryImage(newImage.id, 0);
          newImage.is_primary = true;
        }
        
        setImages(prev => [...prev, newImage]);
        return newImage;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const updateImage = async (id: number, updates: { file_name: string; alt_text: string }) => {
    try {
      await updateCommunityImage(id, updates);
      // Update local state
      setImages(prev => 
        prev.map(img => 
          img.id === id ? { ...img, ...updates } : img
        )
      );
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image details");
    }
  };

  const removeImage = async (id: number, storagePath: string) => {
    try {
      await removeCommunityImage(id, storagePath);
      // Update local state
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const reorderImages = async (primaryId: number, currentPrimaryId: number) => {
    try {
      await setPrimaryImage(primaryId, currentPrimaryId);
      // Update local state
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === primaryId
      })));
    } catch (error) {
      console.error("Error setting primary image:", error);
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
    fetchImages: loadImages
  };
}
