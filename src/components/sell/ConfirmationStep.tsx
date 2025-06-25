
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface ConfirmationStepProps {
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    type: string;
    price: string;
    productPrice: string;
    filesLink: string;
    contactEmail: string;
    firstName: string;
    lastName: string;
    captchaConfirmed: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ConfirmationStep({ 
  selectedOption, 
  formData,
  handleInputChange 
}: ConfirmationStepProps) {
  const { user } = useAuth();

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

      {/* Only show name and email inputs if user is not authenticated */}
      {!user && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                className="w-full"
              />
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
      )}

      {/* Show current user email if authenticated */}
      {user && (
        <div className="space-y-2">
          <Label className="font-medium text-gray-700">
            Account Email
          </Label>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              You're signed in as: <span className="font-medium">{user.email}</span>
            </p>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="captchaConfirmed"
              name="captchaConfirmed"
              checked={formData.captchaConfirmed}
              onCheckedChange={(checked) => {
                const event = {
                  target: {
                    name: 'captchaConfirmed',
                    type: 'checkbox',
                    checked: checked === true
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleInputChange(event);
              }}
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <Label 
                htmlFor="captchaConfirmed" 
                className="text-sm font-medium text-blue-900 cursor-pointer"
              >
                Human Verification
              </Label>
            </div>
            <p className="text-sm text-blue-700">
              Please confirm that you are not a robot by checking this box. This helps us prevent spam and automated submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
