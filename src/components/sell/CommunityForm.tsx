
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CommunityFormProps {
  name: string;
  description: string;
  communityType: "free" | "paid";
  communityPrice: string;
  thumbnail: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCommunityTypeChange: (value: "free" | "paid") => void;
  onCommunityPriceChange: (value: string) => void;
  onThumbnailChange: (value: string) => void;
}

export const CommunityForm = ({
  name,
  description,
  communityType,
  communityPrice,
  thumbnail,
  onNameChange,
  onDescriptionChange,
  onCommunityTypeChange,
  onCommunityPriceChange,
  onThumbnailChange
}: CommunityFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Your community name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Brief Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Describe what your community is about"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="communityType" className="block text-sm font-medium text-gray-700">
          Community Type
        </Label>
        <Select 
          value={communityType} 
          onValueChange={(value: "free" | "paid") => onCommunityTypeChange(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select community type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {communityType === "paid" && (
        <div className="space-y-2">
          <Label htmlFor="communityPrice" className="block text-sm font-medium text-gray-700">
            Price
          </Label>
          <Input
            type="number"
            id="communityPrice"
            name="communityPrice"
            value={communityPrice}
            onChange={(e) => onCommunityPriceChange(e.target.value)}
            className="w-full"
            placeholder="0.00"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
          Thumbnail URL (optional)
        </Label>
        <Input
          type="text"
          id="thumbnail"
          name="thumbnail"
          value={thumbnail}
          onChange={(e) => onThumbnailChange(e.target.value)}
          className="w-full"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </>
  );
};
