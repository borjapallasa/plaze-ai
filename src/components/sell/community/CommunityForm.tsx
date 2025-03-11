
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadArea } from "@/components/product/ImageUploadArea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommunityFormProps {
  formData: {
    name: string;
    description: string;
    intro: string;
    type: "free" | "paid";
    price: string;
    thumbnail?: string;
  };
  onChange: (field: string, value: any) => void;
  onImageUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function CommunityForm({ formData, onChange, onImageUpload, isUploading }: CommunityFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-medium">
          Community Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter your community name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-base font-medium">
          Community Type <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => onChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select community type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "paid" && (
        <div className="space-y-2">
          <Label htmlFor="price" className="text-base font-medium">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="intro" className="text-base font-medium">
          Video Introduction URL
        </Label>
        <Input
          id="intro"
          placeholder="Enter YouTube or Vimeo video URL"
          value={formData.intro}
          onChange={(e) => onChange("intro", e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Add a video URL to introduce your community to potential members
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your community..."
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">
          Thumbnail Image
        </Label>
        <ImageUploadArea
          onFileSelect={onImageUpload}
          isUploading={isUploading}
          accept="image/*"
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <img 
              src={formData.thumbnail} 
              alt="Community thumbnail" 
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
