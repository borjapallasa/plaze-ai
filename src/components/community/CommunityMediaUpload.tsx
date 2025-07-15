
import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { ImageDetailsDialog } from "@/components/community/ImageDetailsDialog";
import { CommunityImageCard } from "@/components/community/CommunityImageCard";
import { useCommunityImages } from "@/hooks/use-community-images";

interface CommunityMediaUploadProps {
  communityUuid: string;
  onFileSelect?: (file: File) => void;
}

export function CommunityMediaUpload({ 
  communityUuid, 
  onFileSelect
}: CommunityMediaUploadProps) {
  const [selectedImage, setSelectedImage] = useState<null | any>(null);
  const [tempImage, setTempImage] = useState<{url: string, storage_path: string} | null>(null);
  
  const {
    images,
    isUploading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages
  } = useCommunityImages(communityUuid);

  console.log('CommunityMediaUpload: communityUuid =', communityUuid);
  console.log('CommunityMediaUpload: images =', images);
  console.log('CommunityMediaUpload: isUploading =', isUploading);

  const handleFileSelect = async (file: File) => {
    console.log("CommunityMediaUpload: File selected:", file.name, "Size:", file.size);
    
    if (onFileSelect) {
      console.log("CommunityMediaUpload: Calling parent onFileSelect handler");
      onFileSelect(file);
      
      // For temp mode, we won't actually upload to Supabase, just pass the file up
      // and create a local preview
      if (communityUuid === 'temp') {
        const objectUrl = URL.createObjectURL(file);
        setTempImage({ url: objectUrl, storage_path: 'temp' });
      }
      return;
    }
    
    try {
      console.log("CommunityMediaUpload: Uploading image to Supabase for community:", communityUuid);
      const result = await uploadImage(file);
      console.log("CommunityMediaUpload: Upload result:", result);
      
      if (result && communityUuid === 'temp') {
        setTempImage(result as {url: string, storage_path: string});
      }
    } catch (error) {
      console.error("CommunityMediaUpload: Error uploading image:", error);
    }
  };

  // Determine which images to display - use temp image for preview in creation mode
  // or use images from the hook
  const displayImages = communityUuid === 'temp' && tempImage 
    ? [{ id: 0, url: tempImage.url, storage_path: tempImage.storage_path, is_primary: true, file_name: 'Temporary image' }] 
    : images;

  console.log('CommunityMediaUpload: displayImages =', displayImages);

  return (
    <div className="space-y-4">
      <ImageUploadArea
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
        accept="image/*"
      />

      {displayImages && displayImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {displayImages.map((image, index) => (
            <CommunityImageCard
              key={image.id || index}
              image={image}
              communityUuid={communityUuid}
              onEditClick={setSelectedImage}
              onRemoveClick={removeImage}
              onSetPrimaryClick={communityUuid !== 'temp' ? reorderImages : undefined}
              currentPrimaryId={displayImages.find(img => img.is_primary)?.id || 0}
            />
          ))}
        </div>
      )}

      <ImageDetailsDialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
        onSave={updateImage}
      />
    </div>
  );
}
