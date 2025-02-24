
import React, { useCallback, useState } from "react";
import { UploadCloud, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function ImageUploadArea({ onFileSelect, isUploading }: ImageUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulate upload progress
  React.useEffect(() => {
    if (isUploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      return () => {
        clearInterval(interval);
        setUploadProgress(0);
      };
    }
  }, [isUploading]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div 
      className={`
        relative rounded-lg border-2 border-dashed transition-all duration-200
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        ${isUploading ? 'pointer-events-none' : 'hover:border-primary hover:bg-accent/50'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
        className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer"
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4 px-4 w-full max-w-xs">
            <UploadCloud className="h-8 w-8 text-muted-foreground animate-bounce" />
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-primary/5 text-primary">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                Drop an image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </label>

      {/* Drag overlay indicator */}
      {isDragging && (
        <div className="absolute inset-0 rounded-lg bg-primary/10 border-2 border-primary flex items-center justify-center">
          <div className="bg-background/95 px-4 py-2 rounded-md shadow-lg">
            <p className="text-sm font-medium">Drop image here</p>
          </div>
        </div>
      )}
    </div>
  );
}
