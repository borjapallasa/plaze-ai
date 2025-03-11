
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
    const fetchedImages = await fetchCommunityImages(communityUuid);
    setImages(fetchedImages);
    setIsLoading(false);
  };

  const uploadImage = async (file: File) => {
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
        return newImage;
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const updateImage = async (id: number, updates: { file_name: string; alt_text: string }) => {
    await updateCommunityImage(id, updates);
    // Update local state
    setImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, ...updates } : img
      )
    );
  };

  const removeImage = async (id: number, storagePath: string) => {
    await removeCommunityImage(id, storagePath);
    // Update local state
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const reorderImages = async (primaryId: number, currentPrimaryId: number) => {
    await setPrimaryImage(primaryId, currentPrimaryId);
    // Update local state
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === primaryId
    })));
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
