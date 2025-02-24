
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageUploadArea } from "./ImageUploadArea";
import { ImageGrid } from "./ImageGrid";
import { useProductImages } from "@/hooks/use-product-images";

interface ProductMediaUploadProps {
  productUuid?: string;
}

export function ProductMediaUpload({ productUuid }: ProductMediaUploadProps) {
  const { images, isUploading, uploadImage, removeImage } = useProductImages(productUuid);
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);

  return (
    <div className="space-y-4">
      <ImageUploadArea 
        onFileSelect={uploadImage}
        isUploading={isUploading}
      />

      <ImageGrid 
        images={images}
        onImageClick={setPreviewImage}
        onRemoveImage={removeImage}
      />

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          {previewImage && (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
              <img
                src={previewImage.url}
                alt={previewImage.file_name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
