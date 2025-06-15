
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductStatus } from "@/hooks/use-create-product";

interface ProductCreateHeaderProps {
  productStatus: ProductStatus;
  onStatusChange: (value: ProductStatus) => void;
  onSave: () => void;
  isSaving: boolean;
  isValid: boolean;
}

export function ProductCreateHeader({
  productStatus,
  onStatusChange,
  onSave,
  isSaving,
  isValid
}: ProductCreateHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col gap-2 sm:gap-4">
        {/* Top row with back button and title */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words">Create New Product</h1>
          </div>
        </div>
        
        {/* Description */}
        <div className="pl-11 sm:pl-14">
          <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
            Enter the details for your new product
          </p>
          
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
            <Select value={productStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[140px] md:w-[160px]">
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
              disabled={isSaving || !isValid}
              className="w-full sm:w-auto"
              size="default"
            >
              {isSaving ? "Creating..." : "Create product"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
