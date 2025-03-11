
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SUBCATEGORIES, CategoryType, SERVICE_TYPES, ServiceType } from "@/constants/service-categories";
import { CommunityMediaUpload } from "@/components/community/CommunityMediaUpload";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";

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
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
                placeholder={`Your ${selectedOption === "services" ? "service" : 
                              selectedOption === "products" ? "product" : 
                              "community"} name`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium text-gray-700">
                Brief Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full"
                placeholder="Describe what you're offering"
                required
              />
            </div>

            {selectedOption === "services" && (
              <ServiceFields
                formData={formData}
                handleInputChange={handleInputChange}
                handleServiceTypeChange={handleServiceTypeChange}
                handleCategoryChange={handleCategoryChange}
                handleSubcategoriesChange={handleSubcategoriesChange}
                handleRemoveSubcategory={handleRemoveSubcategory}
              />
            )}

            {selectedOption === "community" && (
              <CommunityFields
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

interface ServiceFieldsProps {
  formData: {
    servicePrice: string;
    serviceType: ServiceType;
    category: CategoryType | "";
    selectedSubcategories: string[];
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleServiceTypeChange: (value: ServiceType) => void;
  handleCategoryChange: (value: CategoryType) => void;
  handleSubcategoriesChange: (value: string) => void;
  handleRemoveSubcategory: (value: string) => void;
}

function ServiceFields({
  formData,
  handleInputChange,
  handleServiceTypeChange,
  handleCategoryChange,
  handleSubcategoriesChange,
  handleRemoveSubcategory
}: ServiceFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="servicePrice" className="font-medium text-gray-700">
          Price <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          id="servicePrice"
          name="servicePrice"
          value={formData.servicePrice}
          onChange={handleInputChange}
          className="w-full"
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType" className="font-medium text-gray-700">
          Service Type <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.serviceType} 
          onValueChange={handleServiceTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.category && (
        <div className="space-y-2">
          <Label htmlFor="subcategories" className="font-medium text-gray-700">
            Subcategories
          </Label>
          <Select 
            value=""
            onValueChange={handleSubcategoriesChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subcategories" />
            </SelectTrigger>
            <SelectContent>
              {SUBCATEGORIES[formData.category as CategoryType].map((subcat) => (
                <SelectItem 
                  key={subcat.value} 
                  value={subcat.value}
                  className="relative py-2.5"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{subcat.label}</span>
                    {formData.selectedSubcategories.includes(subcat.value) && (
                      <span className="text-primary">✓</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {formData.selectedSubcategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.selectedSubcategories.map((sub) => {
                const subcatLabel = SUBCATEGORIES[formData.category as CategoryType].find(s => s.value === sub)?.label;
                return (
                  <span
                    key={sub}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {subcatLabel}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(sub)}
                      className="h-4 w-4 rounded-full bg-gray-200 hover:bg-gray-300 inline-flex items-center justify-center text-gray-600"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface CommunityFieldsProps {
  formData: {
    intro: string;
    type: string;
    price: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCommunityTypeChange: (value: string) => void;
  handleFileSelect: (file: File) => void;
}

function CommunityFields({
  formData,
  handleInputChange,
  handleCommunityTypeChange,
  handleFileSelect
}: CommunityFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="intro" className="font-medium text-gray-700">
          Introduction
        </Label>
        <Textarea
          id="intro"
          name="intro"
          value={formData.intro}
          onChange={handleInputChange}
          rows={4}
          className="w-full"
          placeholder="Introduce your community to potential members"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-medium text-gray-700">
          Community Type
        </Label>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="type-free"
              name="type"
              value="free"
              checked={formData.type === "free"}
              onChange={() => handleCommunityTypeChange("free")}
              className="mr-2"
            />
            <Label htmlFor="type-free">Free</Label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="type-paid"
              name="type"
              value="paid"
              checked={formData.type === "paid"}
              onChange={() => handleCommunityTypeChange("paid")}
              className="mr-2"
            />
            <Label htmlFor="type-paid">Paid</Label>
          </div>
        </div>
      </div>

      {formData.type === "paid" && (
        <div className="space-y-2">
          <Label htmlFor="price" className="font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full"
            placeholder="0.00"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="font-medium text-gray-700">
          Thumbnail Image
        </Label>
        <div className="mt-1">
          <CommunityMediaUpload 
            communityUuid="temp" 
            onFileSelect={handleFileSelect} 
          />
        </div>
      </div>
    </>
  );
}
