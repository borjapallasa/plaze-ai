
import React, { useCallback } from "react";
import { Plus, UploadCloud } from "lucide-react";

interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function ImageUploadArea({ onFileSelect, isUploading }: ImageUploadAreaProps) {
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div 
      className="col-span-2 aspect-[3/2] rounded-lg border-2 border-dashed relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="imageUpload"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      <label
        htmlFor="imageUpload"
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-6 w-6 animate-bounce" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Plus className="h-6 w-6" />
            <p className="text-sm text-muted-foreground">Drop an image here or click to upload</p>
          </div>
        )}
      </label>
    </div>
  );
}
