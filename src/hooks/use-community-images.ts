import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { uploadImageToStorage, updateCommunityThumbnail, updateImagePrimaryStatus, sortImagesByPrimary } from "@/utils/community-image-utils";
import { fetchCommunityImages, insertCommunityImage, updateCommunityImage, deleteCommunityImage } from "@/services/community-images-service";

export interface CommunityImage {
  id: number;
  url: string;
  storage_path: string;
  is_primary: boolean;
  file_name: string;
  alt_text?: string;
}

export function useCommunityImages(communityUuid?: string, initialImages: CommunityImage[] = []) {
  const [images, setImages] = useState<CommunityImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadImages() {
      if (!communityUuid) return;

      try {
        const fetchedImages = await fetchCommunityImages(communityUuid);
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Error",
          description: "Failed to load existing images",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (initialImages.length === 0) {
      loadImages();
    } else {
      setImages(initialImages);
      setIsLoading(false);
    }
  }, [communityUuid, initialImages, toast]);

  const uploadImage = useCallback(async (file: File) => {
    if (!communityUuid) {
      toast({
        title: "Error",
        description: "Community ID is required to upload images",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const { publicUrl, storagePath } = await uploadImageToStorage(file, communityUuid);
      
      const newImage = await insertCommunityImage(communityUuid, {
        storage_path: storagePath,
        file_name: file.name,
        content_type: file.type,
        size: file.size,
        is_primary: images.length === 0
      });

      if (images.length === 0) {
        await updateCommunityThumbnail(communityUuid, publicUrl);
      }

      setImages(prev => [...prev, {
        id: newImage.id,
        url: publicUrl,
        storage_path: newImage.storage_path,
        is_primary: newImage.is_primary,
        file_name: newImage.file_name
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
  }, [communityUuid, images.length, toast]);

  const reorderImages = async (sourceId: number, targetId: number) => {
    try {
      const sourceImage = images.find(img => img.id === sourceId);
      const targetImage = images.find(img => img.id === targetId);

      if (!sourceImage || !targetImage) return;

      await updateImagePrimaryStatus(sourceId, true);
      await updateImagePrimaryStatus(targetId, false);

      if (communityUuid) {
        await updateCommunityThumbnail(communityUuid, sourceImage.url);
      }

      setImages(prev => {
        const updatedImages = prev.map(img => ({
          ...img,
          is_primary: img.id === sourceId
        }));
        return sortImagesByPrimary(updatedImages);
      });

      toast({
        title: "Success",
        description: "Image order updated successfully",
      });
    } catch (error) {
      console.error('Reorder error:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    }
  };

  const updateImage = async (imageId: number, updates: { file_name?: string; alt_text?: string }) => {
    try {
      await updateCommunityImage(imageId, updates);
      
      setImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, ...updates }
          : img
      ));

      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    }
  };

  const removeImage = async (imageId: number, storagePath: string) => {
    try {
      await deleteCommunityImage(imageId, storagePath);
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

  return {
    images,
    isUploading,
    isLoading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages
  };
}
