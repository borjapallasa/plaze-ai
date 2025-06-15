
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductStatus = 'draft' | 'active' | 'inactive';

interface ProductHeaderSectionProps {
  productStatus: ProductStatus;
  onStatusChange: (value: ProductStatus) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ProductHeaderSection({
  productStatus,
  onStatusChange,
  onSave,
  isSaving
}: ProductHeaderSectionProps) {
  const { slug, id } = useParams(); // Extract dynamic segments

  return (
    <div className="mb-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <Link to={`/product/${slug}/${id}`} className="flex-shrink-0 mt-1">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <div className="flex-1 min-w-0">
          {/* Title and subtitle */}
          <div className="mb-4 sm:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold">Edit Product</h1>
                <p className="text-sm text-muted-foreground mt-1">Product details and configuration</p>
              </div>
              
              {/* Desktop controls - hidden on mobile */}
              <div className="hidden sm:flex sm:flex-row sm:items-center gap-3">
                <Select value={productStatus} onValueChange={onStatusChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile controls - completely separate from the flex container above */}
      <div className="sm:hidden space-y-3 mt-2">
        <Select value={productStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
