
import React from "react";
import { Card } from "@/components/ui/card";
import { CATEGORIES, SUBCATEGORIES, CategoryType, SERVICE_TYPES } from "@/constants/service-categories";

interface ConfirmationStepProps {
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    servicePrice?: string;
    serviceType?: string;
    category?: CategoryType | "";
    selectedSubcategories?: string[];
    contactEmail?: string;
    communityType?: "free" | "paid";
    communityPrice?: string;
    thumbnail?: string;
  };
}

export const ConfirmationStep = ({ selectedOption, formData }: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Ready to create your {selectedOption === "services" ? "service" : 
                          selectedOption === "products" ? "product" : 
                          "community"}?
        </h1>
        <p className="text-gray-600">
          Here's a summary of what you're about to create:
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">Type</h3>
          <p className="text-gray-700">
            {selectedOption === "services" ? "Service" : 
             selectedOption === "products" ? "Product" : 
             "Community"}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Name</h3>
          <p className="text-gray-700">{formData.name || "Not specified"}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Description</h3>
          <p className="text-gray-700">{formData.description || "Not specified"}</p>
        </div>

        {selectedOption === "services" && (
          <>
            <div>
              <h3 className="font-medium text-gray-900">Price</h3>
              <p className="text-gray-700">${formData.servicePrice || "0.00"}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Service Type</h3>
              <p className="text-gray-700">
                {SERVICE_TYPES.find(t => t.value === formData.serviceType)?.label || "One Time"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Category</h3>
              <p className="text-gray-700">
                {formData.category 
                  ? CATEGORIES.find(c => c.value === formData.category)?.label 
                  : "Not specified"}
              </p>
            </div>
            {formData.selectedSubcategories && formData.selectedSubcategories.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900">Subcategories</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.selectedSubcategories.map(sub => (
                    <span key={sub} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {formData.category && 
                        CATEGORIES.find(c => c.value === formData.category) &&
                        SUBCATEGORIES[formData.category as CategoryType].find(s => s.value === sub)?.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : selectedOption === "community" ? (
          <>
            <div>
              <h3 className="font-medium text-gray-900">Community Type</h3>
              <p className="text-gray-700">{formData.communityType === "free" ? "Free" : "Paid"}</p>
            </div>
            {formData.communityType === "paid" && (
              <div>
                <h3 className="font-medium text-gray-900">Price</h3>
                <p className="text-gray-700">${formData.communityPrice || "0.00"}</p>
              </div>
            )}
            {formData.thumbnail && (
              <div>
                <h3 className="font-medium text-gray-900">Thumbnail</h3>
                <p className="text-gray-700">{formData.thumbnail}</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <h3 className="font-medium text-gray-900">Contact Email</h3>
            <p className="text-gray-700">{formData.contactEmail || "Not specified"}</p>
          </div>
        )}
      </Card>

      <p className="text-sm text-gray-600 text-center">
        Click "Next" to continue to the detailed creation process.
      </p>
    </div>
  );
};
