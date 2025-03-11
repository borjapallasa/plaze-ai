
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

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

export function ImageDetailsDialog({ open, onClose, image, onSave }: ImageDetailsDialogProps) {
  const [fileName, setFileName] = useState(image?.file_name || "");
  const [altText, setAltText] = useState(image?.alt_text || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
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
