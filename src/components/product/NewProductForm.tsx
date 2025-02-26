
import React from "react";
import { Card } from "@/components/ui/card";
import { ProductBasicDetailsForm } from "./ProductBasicDetailsForm";
import { ProductMediaUpload } from "./ProductMediaUpload";
import { ProductDetailsForm } from "./ProductDetailsForm";
import { ProductVariantsEditor } from "./ProductVariants";
import { Variant } from "./types/variants";
import { PendingImage } from "@/hooks/use-pending-images";

interface NewProductFormProps {
  productName: string;
  setProductName: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
  techStack: string;
  setTechStack: (value: string) => void;
  techStackPrice: string;
  setTechStackPrice: (value: string) => void;
  productIncludes: string;
  setProductIncludes: (value: string) => void;
  difficultyLevel: string;
  setDifficultyLevel: (value: string) => void;
  demo: string;
  setDemo: (value: string) => void;
  variants: Variant[];
  setVariants: (variants: Variant[]) => void;
  pendingImages: PendingImage[];
  addPendingImage: (file: File) => void;
}

export function NewProductForm({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  techStack,
  setTechStack,
  techStackPrice,
  setTechStackPrice,
  productIncludes,
  setProductIncludes,
  difficultyLevel,
  setDifficultyLevel,
  demo,
  setDemo,
  variants,
  setVariants,
  pendingImages,
  addPendingImage,
}: NewProductFormProps) {
  return (
    <div className="space-y-3 sm:space-y-6">
      <Card className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <ProductBasicDetailsForm
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
          />
        </div>
      </Card>

      <Card className="p-3 sm:p-6">
        <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
        <ProductMediaUpload productUuid="" onFileSelect={addPendingImage} />
        {pendingImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pendingImages.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg border overflow-hidden">
                <img
                  src={image.previewUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <ProductDetailsForm
            techStack={techStack}
            setTechStack={setTechStack}
            techStackPrice={techStackPrice}
            setTechStackPrice={setTechStackPrice}
            productIncludes={productIncludes}
            setProductIncludes={setProductIncludes}
            difficultyLevel={difficultyLevel}
            setDifficultyLevel={setDifficultyLevel}
            demo={demo}
            setDemo={setDemo}
          />
        </div>
      </Card>

      <Card className="p-3 sm:p-6">
        <div className="pt-2">
          <ProductVariantsEditor 
            variants={variants}
            onVariantsChange={setVariants}
          />
        </div>
      </Card>
    </div>
  );
}
