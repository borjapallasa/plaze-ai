
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CommunityFormProps {
  communityData: {
    name: string;
    description: string;
    communityType: "free" | "paid";
    communityPrice: string;
    thumbnail: string;
  };
  onChange: (name: string, value: any) => void;
}

export const CommunityForm = ({ communityData, onChange }: CommunityFormProps) => {
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
          value={communityData.name}
          onChange={(e) => onChange("name", e.target.value)}
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
          value={communityData.description}
          onChange={(e) => onChange("description", e.target.value)}
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
          value={communityData.communityType} 
          onValueChange={(value: "free" | "paid") => onChange("communityType", value)}
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

      {communityData.communityType === "paid" && (
        <div className="space-y-2">
          <Label htmlFor="communityPrice" className="block text-sm font-medium text-gray-700">
            Price
          </Label>
          <Input
            type="number"
            id="communityPrice"
            name="communityPrice"
            value={communityData.communityPrice}
            onChange={(e) => onChange("communityPrice", e.target.value)}
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
          value={communityData.thumbnail}
          onChange={(e) => onChange("thumbnail", e.target.value)}
          className="w-full"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </>
  );
};
