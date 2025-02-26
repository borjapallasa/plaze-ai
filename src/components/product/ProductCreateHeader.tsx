
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
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
        <Link to="/seller/products">
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-full">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Create New Product</h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">Enter the details for your new product</p>
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
                disabled={isSaving || !isValid}
              >
                {isSaving ? "Creating..." : "Create product"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
