
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
      <div className="flex items-start gap-3 sm:gap-4">
        <Link to="/" className="flex-shrink-0 mt-1">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold">Create New Product</h1>
              <p className="text-sm text-muted-foreground mt-1">Enter the details for your new product</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-row sm:items-center">
              <Select value={productStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full sm:w-[140px]">
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
