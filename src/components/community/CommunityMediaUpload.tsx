
import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Edit, Trash2, Check } from "lucide-react";
import { useCommunityImages } from "@/hooks/use-community-images";

interface CommunityMediaUploadProps {
  communityUuid: string;
  onFileSelect?: (file: File) => void;
}

interface ImageDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  image: {
    id: number;
    file_name: string;
    alt_text?: string;
    url: string;
  } | null;
  onSave: (id: number, updates: { file_name: string; alt_text: string }) => Promise<void>;
}

function ImageDetailsDialog({ open, onClose, image, onSave }: ImageDetailsDialogProps) {
  const [fileName, setFileName] = useState(image?.file_name || "");
  const [altText, setAltText] = useState(image?.alt_text || "");
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (image) {
      setFileName(image.file_name || "");
      setAltText(image.alt_text || "");
    }
  }, [image]);

  const handleSave = async () => {
    if (!image) return;
    setIsSaving(true);
    try {
      await onSave(image.id, { file_name: fileName, alt_text: altText });
      onClose();
    } catch (error) {
      console.error("Error saving image details:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!image) return;
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = image.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
            {image && (
              <img
                src={image.url}
                alt={image.file_name}
                className="object-contain w-full h-full"
              />
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fileName">File name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="altText">Alt text</Label>
              <Input
                id="altText"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this image"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommunityMediaUpload({ communityUuid, onFileSelect }: CommunityMediaUploadProps) {
  const [selectedImage, setSelectedImage] = useState<null | any>(null);
  const {
    images,
    isUploading,
    uploadImage,
    updateImage,
    removeImage,
    reorderImages
  } = useCommunityImages(communityUuid);

  const handleFileSelect = async (file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
      return;
    }
    await uploadImage(file);
  };

  return (
    <div className="space-y-4">
      <ImageUploadArea
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <Card key={image.id} className="relative group">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.file_name || 'Community image'}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.is_primary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => reorderImages(image.id, images.find(img => img.is_primary)?.id || 0)}
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setSelectedImage(image)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeImage(image.id, image.storage_path)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Primary
                </div>
              )}
            </Card>
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
