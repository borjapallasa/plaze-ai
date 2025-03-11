
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicDetailsFormProps {
  name: string;
  description: string;
  placeholder: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicDetailsForm({
  name,
  description,
  placeholder,
  handleInputChange
}: BasicDetailsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="font-medium text-gray-700">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleInputChange}
          className="w-full"
          placeholder={placeholder}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium text-gray-700">
          Brief Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={handleInputChange}
          rows={3}
          className="w-full"
          placeholder="Describe what you're offering"
          required
        />
      </div>
    </>
  );
}
