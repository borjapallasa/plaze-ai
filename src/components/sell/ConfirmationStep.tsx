
import React from "react";
import { CATEGORIES } from "@/constants/service-categories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmationStepProps {
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    servicePrice: string;
    serviceType: string;
    category: string;
    type: string;
    price: string;
    productPrice: string;
    filesLink: string;
    contactEmail: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ConfirmationStep({ 
  selectedOption, 
  formData,
  handleInputChange 
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Review Your Information
        </h1>
        <p className="text-gray-600">
          Please review your information before proceeding
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h3 className="font-medium text-lg mb-2">Basic Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Type:</span>
              <span className="font-medium">
                {selectedOption?.charAt(0).toUpperCase() + selectedOption?.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Name:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Description:</span>
              <span className="font-medium">{formData.description}</span>
            </div>
            
            {selectedOption === "products" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-700">Price:</span>
                  <span className="font-medium">${formData.productPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Files Link:</span>
                  <span className="font-medium">{formData.filesLink}</span>
                </div>
              </>
            )}
            
            {selectedOption === "services" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-700">Price:</span>
                  <span className="font-medium">${formData.servicePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Service Type:</span>
                  <span className="font-medium">{formData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Category:</span>
                  <span className="font-medium">
                    {CATEGORIES.find(c => c.value === formData.category)?.label}
                  </span>
                </div>
              </>
            )}
            
            {selectedOption === "community" && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-700">Type:</span>
                  <span className="font-medium">
                    {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                  </span>
                </div>
                {formData.type === "paid" && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Price:</span>
                    <span className="font-medium">${formData.price}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail" className="font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="your@email.com"
          required
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          We'll use this to set up your account and send you a magic link for future logins.
        </p>
      </div>
    </div>
  );
}
