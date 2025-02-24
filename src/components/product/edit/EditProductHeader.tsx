
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

interface EditProductHeaderProps {
  isSaving: boolean;
  onSave: () => void;
}

export function EditProductHeader({ isSaving, onSave }: EditProductHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
        <Link to="/seller/products">
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="w-full flex justify-between items-start">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Edit Product</h1>
            <p className="text-sm text-muted-foreground mt-2">Product details and configuration</p>
          </div>
          <Button onClick={onSave} disabled={isSaving} size="sm">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
