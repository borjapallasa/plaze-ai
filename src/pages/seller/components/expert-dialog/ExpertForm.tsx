
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExpertiseAreasDropdown } from "./ExpertiseAreasDropdown";
import { ProfileImageUpload } from "./ProfileImageUpload";
import type { ExpertFormData } from "./types";

interface ExpertFormProps {
  formData: ExpertFormData;
  previewUrl: string | null;
  isSubmitting: boolean;
  updateError: string | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onToggleArea: (areaValue: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ExpertForm({
  formData,
  previewUrl,
  isSubmitting,
  updateError,
  onFormChange,
  onToggleArea,
  onImageChange,
  onSubmit,
  onCancel
}: ExpertFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      {updateError && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {updateError}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onFormChange}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={onFormChange}
            placeholder="e.g. UI/UX Designer"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onFormChange}
          placeholder="Tell potential clients about yourself"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={onFormChange}
            placeholder="e.g. New York, USA"
          />
        </div>
        <ExpertiseAreasDropdown 
          selectedAreas={formData.areas} 
          onToggleArea={onToggleArea} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="info">Additional Information</Label>
        <Textarea
          id="info"
          name="info"
          value={formData.info}
          onChange={onFormChange}
          placeholder="Any other information you'd like to share"
          className="min-h-[80px]"
        />
      </div>
      
      <ProfileImageUpload
        previewUrl={previewUrl}
        thumbnailUrl={formData.thumbnail}
        onImageChange={onImageChange}
        onThumbnailUrlChange={onFormChange}
      />
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
