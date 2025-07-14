
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type ProductStatus = "draft" | "active" | "inactive";

interface ProductStatusProps {
  status: ProductStatus;
  onStatusChange: (status: ProductStatus) => void;
  thumbnailFile: File | null;
  onThumbnailChange: (file: File | null) => void;
}

export function ProductStatus({
  status,
  onStatusChange,
  thumbnailFile,
  onThumbnailChange,
}: ProductStatusProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onThumbnailChange(file || null);
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Product Status</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {thumbnailFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {thumbnailFile.name}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
