
import React from "react";
import { ServiceFieldsForm } from "@/components/sell/ServiceFieldsForm";
import { CommunityFieldsForm } from "@/components/sell/CommunityFieldsForm";
import { BasicDetailsForm } from "@/components/sell/BasicDetailsForm";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";
import { ServiceType, CategoryType } from "@/constants/service-categories";

interface BasicInfoStepProps {
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    servicePrice: string;
    serviceType: ServiceType;
    category: CategoryType | "";
    selectedSubcategories: string[];
    intro: string;
    type: string;
    price: string;
    thumbnail: string;
    productPrice: string;
    filesLink: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: CategoryType) => void;
  handleSubcategoriesChange: (value: string) => void;
  handleRemoveSubcategory: (value: string) => void;
  handleServiceTypeChange: (value: ServiceType) => void;
  handleCommunityTypeChange: (value: string) => void;
  handleFileSelect: (file: File) => void;
  setFormData: (updater: (prev: any) => any) => void;
}

export function BasicInfoStep({
  selectedOption,
  formData,
  handleInputChange,
  handleCategoryChange,
  handleSubcategoriesChange,
  handleRemoveSubcategory,
  handleServiceTypeChange,
  handleCommunityTypeChange,
  handleFileSelect,
  setFormData
}: BasicInfoStepProps) {
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
        {selectedOption === "products" ? (
          <ProductBasicDetailsForm
            productName={formData.name}
            setProductName={(value) => setFormData(prev => ({ ...prev, name: value }))}
            productDescription={formData.description}
            setProductDescription={(value) => setFormData(prev => ({ ...prev, description: value }))}
            productPrice={formData.productPrice}
            setProductPrice={(value) => setFormData(prev => ({ ...prev, productPrice: value }))}
            filesLink={formData.filesLink}
            setFilesLink={(value) => setFormData(prev => ({ ...prev, filesLink: value }))}
          />
        ) : (
          <>
            <BasicDetailsForm
              name={formData.name}
              description={formData.description}
              placeholder={`Your ${selectedOption === "services" ? "service" : "community"} name`}
              handleInputChange={handleInputChange}
            />

            {selectedOption === "services" && (
              <ServiceFieldsForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleServiceTypeChange={handleServiceTypeChange}
                handleCategoryChange={handleCategoryChange}
                handleSubcategoriesChange={handleSubcategoriesChange}
                handleRemoveSubcategory={handleRemoveSubcategory}
              />
            )}

            {selectedOption === "community" && (
              <CommunityFieldsForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleCommunityTypeChange={handleCommunityTypeChange}
                handleFileSelect={handleFileSelect}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
