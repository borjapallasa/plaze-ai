
import React from "react";
import { ServiceForm } from "@/components/service/ServiceForm";
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
          <div className="space-y-2">
            <ServiceForm
              serviceName={formData.name || ""}
              serviceDescription={formData.description || ""}
              price={formData.servicePrice || ""}
              serviceType={formData.serviceType || "one time"}
              features={[]}
              category={formData.category || ""}
              selectedSubcategories={formData.selectedSubcategories || []}
              status="draft"
              onServiceNameChange={(value) => onInputChange("name", value)}
              onServiceDescriptionChange={(value) => onInputChange("description", value)}
              onPriceChange={(value) => onInputChange("servicePrice", value)}
              onServiceTypeChange={(value) => onInputChange("serviceType", value)}
              onAddFeature={() => {}}
              onRemoveFeature={() => {}}
              onFeatureChange={() => {}}
              onCategoryChange={onCategoryChange}
              onSubcategoriesChange={onSubcategoriesChange}
              onRemoveSubcategory={onRemoveSubcategory}
              onStatusChange={() => {}}
              onSave={() => {}}
            />
          </div>
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
            name={formData.name || ""}
            description={formData.description || ""}
            communityType={formData.communityType || "free"}
            communityPrice={formData.communityPrice || ""}
            thumbnail={formData.thumbnail || ""}
            onNameChange={(value) => onInputChange("name", value)}
            onDescriptionChange={(value) => onInputChange("description", value)}
            onCommunityTypeChange={(value) => onInputChange("communityType", value)}
            onCommunityPriceChange={(value) => onInputChange("communityPrice", value)}
            onThumbnailChange={(value) => onInputChange("thumbnail", value)}
          />
        )}
      </div>
    </div>
  );
};
