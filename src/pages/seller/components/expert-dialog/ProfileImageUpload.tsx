
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProfileImageUploadProps {
  previewUrl: string | null;
  thumbnailUrl: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileImageUpload({ 
  previewUrl, 
  thumbnailUrl, 
  onImageChange, 
  onThumbnailUrlChange 
}: ProfileImageUploadProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="thumbnail">Profile Image</Label>
      
      {previewUrl && (
        <div className="mb-4 flex justify-center">
          <img 
            src={previewUrl} 
            alt="Profile preview" 
            className="h-40 w-40 rounded-full object-cover border-2 border-border"
          />
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="imageUpload" className="sr-only">Upload Image</Label>
        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="cursor-pointer"
        />
        
        <p className="text-xs text-muted-foreground">
          You can upload a JPG, PNG or GIF file (max 10MB).
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Or enter image URL</Label>
        <Input
          id="thumbnail"
          name="thumbnail"
          value={thumbnailUrl}
          onChange={onThumbnailUrlChange}
          placeholder="https://example.com/your-image.jpg"
        />
      </div>
    </div>
  );
}
