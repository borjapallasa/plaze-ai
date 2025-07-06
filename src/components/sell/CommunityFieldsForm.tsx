
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CommunityMediaUpload } from "@/components/community/CommunityMediaUpload";

interface CommunityFieldsFormProps {
  formData: {
    intro: string;
    type: string;
    price: string;
    thumbnail: string;
    videoUrl?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCommunityTypeChange: (value: string) => void;
  handleFileSelect: (file: File) => void;
}

export function CommunityFieldsForm({
  formData,
  handleInputChange,
  handleCommunityTypeChange,
  handleFileSelect
}: CommunityFieldsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="intro" className="font-medium text-gray-700">
          Introduction
        </Label>
        <Textarea
          id="intro"
          name="intro"
          value={formData.intro}
          onChange={handleInputChange}
          rows={4}
          className="w-full"
          placeholder="Introduce your community to potential members"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-gray-700">
          Community Type
        </Label>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="type-free"
              name="type"
              value="free"
              checked={formData.type === "free"}
              onChange={() => handleCommunityTypeChange("free")}
              className="mr-2"
            />
            <Label htmlFor="type-free">Free</Label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="type-paid"
              name="type"
              value="paid"
              checked={formData.type === "paid"}
              onChange={() => handleCommunityTypeChange("paid")}
              className="mr-2"
            />
            <Label htmlFor="type-paid">Paid</Label>
          </div>
        </div>
      </div>

      {formData.type === "paid" && (
        <div className="space-y-2">
          <Label htmlFor="price" className="font-medium text-gray-700">
            Price
          </Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full"
            placeholder="0.00"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="font-medium text-gray-700">
          Thumbnail Image (Optional)
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          You can add a thumbnail image now or later from your community settings
        </p>
        <div className="mt-1">
          <CommunityMediaUpload 
            communityUuid="temp" 
            onFileSelect={(file) => {
              console.log("File selected in CommunityFieldsForm:", file.name);
              handleFileSelect(file);
            }}
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <img 
                src={formData.thumbnail} 
                alt="Community thumbnail preview" 
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
