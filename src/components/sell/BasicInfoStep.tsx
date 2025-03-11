
import React from "react";
import { ServiceForm } from "./ServiceForm";
import { ProductForm } from "./ProductForm";
import { CommunityForm } from "./CommunityForm";
import { CategoryType } from "@/constants/service-categories";

interface BasicInfoStepProps {
  selectedOption: string | null;
  formData: any;
  onInputChange: (name: string, value: any) => void;
  onCategoryChange: (value: CategoryType) => void;
  onSubcategoriesChange: (value: string) => void;
  onRemoveSubcategory: (value: string) => void;
}

export const BasicInfoStep = ({ 
  selectedOption, 
  formData, 
  onInputChange,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory
}: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Tell us a bit about your {selectedOption === "services" ? "service" : 
                                  selectedOption === "products" ? "product" : 
                                  "community"}
        </h1>
        <p className="text-gray-600">
          This information helps us prepare your setup
        </p>
      </div>

      <div className="space-y-4">
        {selectedOption === "services" && (
          <ServiceForm 
            serviceData={{
              name: formData.name,
              description: formData.description,
              servicePrice: formData.servicePrice,
              serviceType: formData.serviceType,
              category: formData.category,
              selectedSubcategories: formData.selectedSubcategories
            }}
            onChange={onInputChange}
            onCategoryChange={onCategoryChange}
            onSubcategoriesChange={onSubcategoriesChange}
            onRemoveSubcategory={onRemoveSubcategory}
          />
        )}

        {selectedOption === "products" && (
          <ProductForm 
            productData={{
              name: formData.name,
              description: formData.description,
              contactEmail: formData.contactEmail,
              price: formData.price,
              techStack: formData.techStack,
              difficultyLevel: formData.difficultyLevel,
              thumbnail: formData.thumbnail,
              productType: formData.productType
            }}
            onChange={onInputChange}
          />
        )}

        {selectedOption === "community" && (
          <CommunityForm 
            communityData={{
              name: formData.name,
              description: formData.description,
              communityType: formData.communityType,
              communityPrice: formData.communityPrice,
              thumbnail: formData.thumbnail
            }}
            onChange={onInputChange}
          />
        )}
      </div>
    </div>
  );
};
