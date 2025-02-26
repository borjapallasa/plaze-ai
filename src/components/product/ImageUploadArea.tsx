
import React from "react";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

export interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  accept?: string;
  className?: string;
}

export function ImageUploadArea({ 
  onFileSelect, 
  isUploading, 
  accept = "image/*",
  className 
}: ImageUploadAreaProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files?.length) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors",
        isUploading && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !isUploading && document.getElementById('fileInput')?.click()}
    >
      <UploadCloud className="h-8 w-8 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">
          {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: PNG, JPG, GIF up to 10MB
        </p>
      </div>
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept={accept}
        disabled={isUploading}
      />
    </div>
  );
}
