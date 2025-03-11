
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormProps {
  productData: {
    name: string;
    description: string;
    contactEmail: string;
    price: string;
    techStack: string;
    difficultyLevel: string;
    thumbnail: string;
    productType: string;
  };
  onChange: (name: string, value: any) => void;
}

export const ProductForm = ({ productData, onChange }: ProductFormProps) => {
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
          value={productData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Your product name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Brief Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={productData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Describe what you're offering"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productType" className="block text-sm font-medium text-gray-700">
          Product Type
        </Label>
        <Select 
          value={productData.productType || "template"} 
          onValueChange={(value) => onChange("productType", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="template">Template</SelectItem>
            <SelectItem value="component">Component</SelectItem>
            <SelectItem value="plugin">Plugin</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </Label>
        <Input
          type="number"
          id="price"
          name="price"
          value={productData.price}
          onChange={(e) => onChange("price", e.target.value)}
          className="w-full"
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
          Tech Stack
        </Label>
        <Input
          type="text"
          id="techStack"
          name="techStack"
          value={productData.techStack}
          onChange={(e) => onChange("techStack", e.target.value)}
          className="w-full"
          placeholder="React, Next.js, Tailwind CSS"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700">
          Difficulty Level
        </Label>
        <Select 
          value={productData.difficultyLevel || "beginner"} 
          onValueChange={(value) => onChange("difficultyLevel", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
          Thumbnail URL (optional)
        </Label>
        <Input
          type="text"
          id="thumbnail"
          name="thumbnail"
          value={productData.thumbnail}
          onChange={(e) => onChange("thumbnail", e.target.value)}
          className="w-full"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
          Contact Email
        </Label>
        <Input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={productData.contactEmail}
          onChange={(e) => onChange("contactEmail", e.target.value)}
          className="w-full"
          placeholder="your@email.com"
        />
      </div>
    </>
  );
};
