
import React from "react";

interface ProductFormProps {
  productData: {
    name: string;
    description: string;
    contactEmail: string;
  };
  onChange: (name: string, value: any) => void;
}

export const ProductForm = ({ productData, onChange }: ProductFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={productData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Your product name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Brief Description
        </label>
        <textarea
          id="description"
          name="description"
          value={productData.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="Describe what you're offering"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
          Contact Email
        </label>
        <input
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={productData.contactEmail}
          onChange={(e) => onChange("contactEmail", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          placeholder="your@email.com"
        />
      </div>
    </>
  );
};
