import React, { useState } from "react";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowDown, ArrowUp, Download, Edit, Trash2, Check } from "lucide-react";

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

export function CommunityMediaUpload({ 
  communityUuid,
  onFileSelect,
  initialImages = []
}: CommunityMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<null | any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query existing community images
  const { data: images = initialImages } = useQuery({
    queryKey: ['communityImages', communityUuid],
    queryFn: async () => {
      console.log('Fetching images for community:', communityUuid);
      const { data, error } = await supabase
        .from('community_images')
        .select('*')
        .eq('community_uuid', communityUuid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community images:', error);
        throw error;
      }

      return data.map(img => ({
        id: img.id,
        url: supabase.storage.from('community_images').getPublicUrl(img.storage_path).data.publicUrl,
        storage_path: img.storage_path,
        is_primary: img.is_primary,
        file_name: img.file_name
      }));
    },
    enabled: !!communityUuid && !initialImages.length
  });

  const handleFileSelect = async (file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${communityUuid}/${crypto.randomUUID()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('community_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('community_images')
        .getPublicUrl(filePath);

      // Create database record
      const { error: dbError } = await supabase
        .from('community_images')
        .insert({
          community_uuid: communityUuid,
          storage_path: filePath,
          file_name: file.name,
          content_type: file.type,
          size: file.size,
          is_primary: images.length === 0 // Make first image primary by default
        });

      if (dbError) throw dbError;

      // If this is the first image, update community thumbnail
      if (images.length === 0) {
        const { error: updateError } = await supabase
          .from('communities')
          .update({ thumbnail: publicUrl })
          .eq('community_uuid', communityUuid);

        if (updateError) throw updateError;
      }

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      // Update all images to not primary
      await supabase
        .from('community_images')
        .update({ is_primary: false })
        .eq('community_uuid', communityUuid);

      // Set selected image as primary
      const { error } = await supabase
        .from('community_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      // Get the storage path of the new primary image
      const { data: primaryImage } = await supabase
        .from('community_images')
        .select('storage_path')
        .eq('id', imageId)
        .single();

      if (primaryImage) {
        const { data: { publicUrl } } = supabase.storage
          .from('community_images')
          .getPublicUrl(primaryImage.storage_path);

        // Update community thumbnail
        await supabase
          .from('communities')
          .update({ thumbnail: publicUrl })
          .eq('community_uuid', communityUuid);
      }

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Primary image updated",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error",
        description: "Failed to update primary image",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (imageId: number, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('community_images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('community_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Image deleted successfully",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleMoveImage = async (imageId: number, direction: 'up' | 'down') => {
    try {
      const currentIndex = images.findIndex(img => img.id === imageId);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= images.length) return;

      const targetImage = images[newIndex];
      
      // Swap is_primary status if one of the images is primary
      if (images[currentIndex].is_primary || targetImage.is_primary) {
        await handleSetPrimary(direction === 'up' ? imageId : targetImage.id);
      }

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Image order updated",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error moving image:', error);
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    }
  };

  const handleUpdateImageDetails = async (imageId: number, updates: { file_name: string; alt_text: string }) => {
    try {
      const { error } = await supabase
        .from('community_images')
        .update(updates)
        .eq('id', imageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['communityImages', communityUuid] });

      toast({
        title: "Success",
        description: "Image details updated",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      console.error('Error updating image details:', error);
      toast({
        title: "Error",
        description: "Failed to update image details",
        variant: "destructive",
      });
    }
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
                  <div className="flex flex-col gap-2">
                    {index > 0 && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleMoveImage(image.id, 'up')}
                        className="h-8 w-8"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    )}
                    {index < images.length - 1 && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleMoveImage(image.id, 'down')}
                        className="h-8 w-8"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!image.is_primary && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleSetPrimary(image.id)}
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
                      onClick={() => handleDelete(image.id, image.storage_path)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
        onSave={handleUpdateImageDetails}
      />
    </div>
  );
}
