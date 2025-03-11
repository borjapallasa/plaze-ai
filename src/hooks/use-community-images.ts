
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

export function useCommunityImages(communityUuid: string) {
  const [images, setImages] = useState<CommunityImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images when communityUuid changes
  useEffect(() => {
    if (communityUuid && communityUuid !== 'temp') {
      loadImages();
    } else {
      setImages([]);
      setIsLoading(false);
    }
  }, [communityUuid]);

  const loadImages = async () => {
    if (!communityUuid || communityUuid === 'temp') {
      setImages([]);
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
    if (!file) {
      toast.error("No file provided");
      return null;
    }
    
    setIsUploading(true);
    
    try {
      const result = await uploadCommunityImage(file, communityUuid);
      
      if (result) {
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
        toast.success("Image uploaded successfully");
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
      toast.success("Image details updated");
    } catch (error) {
      console.error("Error updating image details:", error);
      toast.error("Failed to update image details");
    }
  };

  const removeImage = async (id: number, storagePath: string) => {
    try {
      await removeCommunityImage(id, storagePath);
      // Update local state
      setImages(prev => prev.filter(img => img.id !== id));
      toast.success("Image removed successfully");
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
      toast.success("Primary image updated");
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
    refreshImages: loadImages
  };
}
