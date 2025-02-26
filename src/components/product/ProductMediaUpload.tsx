
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadArea } from "./ImageUploadArea";
import { ImageGrid } from "./ImageGrid";
import { useProductImages, type ProductImage } from "@/hooks/use-product-images";
import { Download, Pencil, Trash } from "lucide-react";

interface ProductMediaUploadProps {
  productUuid?: string;
  onFileSelect?: (file: File) => void | Promise<void>;
}

export function ProductMediaUpload({ productUuid, onFileSelect }: ProductMediaUploadProps) {
  const { images, isUploading, uploadImage, updateImage, removeImage, reorderImages } = useProductImages(productUuid);
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFileName, setEditedFileName] = useState("");
  const [editedAltText, setEditedAltText] = useState("");

  const handleSaveEdit = async () => {
    if (!previewImage) return;
    await updateImage(previewImage.id, { 
      file_name: editedFileName,
      alt_text: editedAltText
    });
    setIsEditing(false);
  };

  const handleDownload = (image: ProductImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditClick = (image: ProductImage) => {
    setEditedFileName(image.file_name);
    setEditedAltText(image.alt_text || image.file_name);
    setIsEditing(true);
  };

  const handleImageSelect = async (file: File) => {
    if (onFileSelect) {
      await onFileSelect(file);
    } else if (productUuid) {
      await uploadImage(file);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUploadArea 
        onFileSelect={handleImageSelect}
        isUploading={isUploading}
      />

      <ImageGrid 
        images={images}
        onImageClick={setPreviewImage}
        onRemoveImage={removeImage}
        onReorderImages={reorderImages}
      />

      <Dialog open={!!previewImage} onOpenChange={() => {
        setPreviewImage(null);
        setIsEditing(false);
      }}>
        <DialogContent className="max-w-3xl">
          {previewImage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  {isEditing ? (
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fileName">File name</Label>
                        <Input
                          id="fileName"
                          value={editedFileName}
                          onChange={(e) => setEditedFileName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="altText">Alt text</Label>
                        <Input
                          id="altText"
                          value={editedAltText}
                          onChange={(e) => setEditedAltText(e.target.value)}
                          className="w-full"
                          placeholder="Describe the image for accessibility"
                        />
                      </div>
                    </div>
                  ) : (
                    <span>{previewImage.file_name}</span>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                <img
                  src={previewImage.url}
                  alt={previewImage.alt_text || previewImage.file_name}
                  className="w-full h-full object-contain"
                />
              </div>

              <DialogFooter className="flex-row justify-between sm:justify-between">
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveEdit}>Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditClick(previewImage)}
                      className="gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit details
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(previewImage)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      removeImage(previewImage.id, previewImage.storage_path);
                      setPreviewImage(null);
                    }}
                    className="gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
