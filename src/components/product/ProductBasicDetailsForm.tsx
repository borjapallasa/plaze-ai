
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicDetailsFormProps {
  productName: string;
  setProductName: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
  productPrice?: string;
  setProductPrice?: (value: string) => void;
  filesLink?: string;
  setFilesLink?: (value: string) => void;
}

export function ProductBasicDetailsForm({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  productPrice,
  setProductPrice,
  filesLink,
  setFilesLink,
}: ProductBasicDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      
      {productPrice !== undefined && setProductPrice && (
        <div>
          <Label htmlFor="price">Price</Label>
          <Input 
            id="price"
            type="number"
            placeholder="0.00"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
      )}
      
      {filesLink !== undefined && setFilesLink && (
        <div>
          <Label htmlFor="filesLink">Files Link</Label>
          <Input
            id="filesLink"
            placeholder="Enter link to product files (Google Drive, Dropbox, etc.)"
            value={filesLink}
            onChange={(e) => setFilesLink(e.target.value)}
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your product briefly"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
}
