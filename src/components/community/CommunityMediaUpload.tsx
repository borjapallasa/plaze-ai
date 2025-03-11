
import React, { useState, useEffect } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { ImageDetailsDialog } from "@/components/community/ImageDetailsDialog";
import { CommunityImageCard } from "@/components/community/CommunityImageCard";
import { useCommunityImages } from "@/hooks/use-community-images";
import { toast } from "sonner";

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
  const [selectedImage, setSelectedImage] = useState<null | any>(null);
  const [tempImage, setTempImage] = useState<{url: string, storage_path: string, id: number} | null>(null);
  
  const {
    images,
    isUploading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages
  } = useCommunityImages(communityUuid);

  const handleFileSelect = async (file: File) => {
    console.log("CommunityMediaUpload: File selected:", file.name);
    
    if (onFileSelect) {
      console.log("CommunityMediaUpload: Using onFileSelect callback");
      onFileSelect(file);
      return;
    }
    
    console.log("CommunityMediaUpload: Uploading image directly");
    try {
      const result = await uploadImage(file);
      console.log("CommunityMediaUpload: Upload result:", result);
      
      if (result && communityUuid === 'temp') {
        console.log("CommunityMediaUpload: Setting temp image for preview");
        setTempImage(result as {url: string, storage_path: string, id: number});
      }
    } catch (error) {
      console.error("Error in handleFileSelect:", error);
      toast.error("Failed to upload image");
    }
  };

  // Determine which images to display - use temp image for preview in creation mode
  const displayImages = communityUuid === 'temp' && tempImage 
    ? [{ id: 0, url: tempImage.url, storage_path: tempImage.storage_path, is_primary: true, file_name: 'Temporary image' }] 
    : images;

  console.log("CommunityMediaUpload: displayImages:", displayImages);

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
