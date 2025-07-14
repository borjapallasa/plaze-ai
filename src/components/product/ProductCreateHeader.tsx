
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Header with back button and title */}
      <div className="mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 mt-1"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-semibold">Create New Product</h1>
              <p className="text-sm text-muted-foreground mt-1">Add your product details and configuration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Save Controls */}
      <Card className="p-3 sm:p-6 mb-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Status</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={productStatus} onValueChange={onStatusChange}>
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
            <Button
              onClick={onSave}
              disabled={isSaving || !isValid}
              className="sm:w-auto"
            >
              {isSaving ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
