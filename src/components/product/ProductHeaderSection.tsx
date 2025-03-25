
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
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
        <Link to={`/product/${slug}/${id}`} >
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-full">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Edit Product</h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">Product details and configuration</p>
            <div className="flex items-center gap-4">
              <Select value={productStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[180px]">
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
  );
}
