
import React from "react";

interface ConfirmationStepProps {
  selectedOption: string | null;
  formData: any;
}

export const ConfirmationStep = ({ selectedOption, formData }: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-semibold">Confirm your details</h1>
        <p className="text-gray-600 mt-2">
          Review your information before proceeding
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Type</h3>
          <p className="text-gray-700 capitalize">{selectedOption}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Name</h3>
          <p className="text-gray-700">{formData.name}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">{formData.description}</p>
        </div>

        {selectedOption === "services" && (
          <>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Price</h3>
              <p className="text-gray-700">${formData.servicePrice}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Service Type</h3>
              <p className="text-gray-700 capitalize">{formData.serviceType}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Category</h3>
              <p className="text-gray-700">{formData.category}</p>
            </div>
            {formData.selectedSubcategories.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Subcategories</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedSubcategories.map((subcategory: string) => (
                    <span key={subcategory} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                      {subcategory}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedOption === "products" && (
          <>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Email</h3>
              <p className="text-gray-700">{formData.contactEmail}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Price</h3>
              <p className="text-gray-700">${formData.price}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Product Type</h3>
              <p className="text-gray-700 capitalize">{formData.productType}</p>
            </div>
            {formData.techStack && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tech Stack</h3>
                <p className="text-gray-700">{formData.techStack}</p>
              </div>
            )}
            {formData.difficultyLevel && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Difficulty Level</h3>
                <p className="text-gray-700 capitalize">{formData.difficultyLevel}</p>
              </div>
            )}
            {formData.thumbnail && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Thumbnail</h3>
                <img 
                  src={formData.thumbnail} 
                  alt="Product thumbnail" 
                  className="h-20 w-20 object-cover rounded-md border"
                />
              </div>
            )}
          </>
        )}

        {selectedOption === "community" && (
          <>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Community Type</h3>
              <p className="text-gray-700 capitalize">{formData.communityType}</p>
            </div>
            {formData.communityType === "paid" && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Price</h3>
                <p className="text-gray-700">${formData.communityPrice}</p>
              </div>
            )}
            {formData.thumbnail && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Thumbnail</h3>
                <img 
                  src={formData.thumbnail} 
                  alt="Community thumbnail" 
                  className="h-20 w-20 object-cover rounded-md border"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
