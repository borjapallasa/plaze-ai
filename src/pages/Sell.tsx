
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceType, CategoryType } from "@/constants/service-categories";
import { SellLayout } from "@/components/sell/SellLayout";
import { ChooseTypeStep } from "@/components/sell/ChooseTypeStep";
import { BasicInfoStep } from "@/components/sell/BasicInfoStep";
import { ConfirmationStep } from "@/components/sell/ConfirmationStep";
import { NavigationButtons } from "@/components/sell/NavigationButtons";

const SellPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sellType: "",
    name: "",
    description: "",
    contactEmail: "",
    servicePrice: "",
    serviceType: "one time" as ServiceType,
    category: "" as CategoryType | "",
    selectedSubcategories: [] as string[],
    intro: "",
    type: "free",
    price: "",
    thumbnail: "",
    videoUrl: "",
    productPrice: "",
    filesLink: ""
  });
  const navigate = useNavigate();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, sellType: option }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (selectedOption === "services") {
        navigate("/seller/services/new", { 
          state: { 
            name: formData.name,
            description: formData.description,
            price: formData.servicePrice,
            type: formData.serviceType,
            category: formData.category ? { value: formData.category } : null,
            subcategory: formData.selectedSubcategories.length > 0 
              ? formData.selectedSubcategories.map(sub => ({ value: sub })) 
              : null
          } 
        });
      } else if (selectedOption === "products") {
        navigate("/seller/products/new", {
          state: {
            name: formData.name,
            description: formData.description,
            price: formData.productPrice,
            filesLink: formData.filesLink
          }
        });
      } else if (selectedOption === "community") {
        navigate("/seller/communities/new", {
          state: {
            name: formData.name,
            description: formData.description,
            intro: formData.intro,
            type: formData.type,
            price: formData.type === "paid" ? formData.price : "0",
            thumbnail: formData.thumbnail,
            videoUrl: formData.videoUrl
          }
        });
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: CategoryType) => {
    setFormData(prev => ({ 
      ...prev, 
      category: value,
      selectedSubcategories: []
    }));
  };

  const handleSubcategoriesChange = (value: string) => {
    if (!formData.selectedSubcategories.includes(value)) {
      setFormData(prev => ({
        ...prev,
        selectedSubcategories: [...prev.selectedSubcategories, value]
      }));
    }
  };

  const handleRemoveSubcategory = (value: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSubcategories: prev.selectedSubcategories.filter(item => item !== value)
    }));
  };

  const handleServiceTypeChange = (value: ServiceType) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  };

  const handleCommunityTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleFileSelect = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, thumbnail: fileUrl }));
  };

  return (
    <SellLayout currentStep={currentStep}>
      <div className="w-full space-y-8">
        {currentStep === 1 && (
          <ChooseTypeStep 
            selectedOption={selectedOption} 
            onOptionSelect={handleOptionSelect} 
          />
        )}

        {currentStep === 2 && (
          <BasicInfoStep 
            selectedOption={selectedOption}
            formData={formData}
            handleInputChange={handleInputChange}
            handleCategoryChange={handleCategoryChange}
            handleSubcategoriesChange={handleSubcategoriesChange}
            handleRemoveSubcategory={handleRemoveSubcategory}
            handleServiceTypeChange={handleServiceTypeChange}
            handleCommunityTypeChange={handleCommunityTypeChange}
            handleFileSelect={handleFileSelect}
            setFormData={setFormData}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep 
            selectedOption={selectedOption}
            formData={formData}
          />
        )}

        <NavigationButtons
          currentStep={currentStep}
          selectedOption={selectedOption}
          formData={formData}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
    </SellLayout>
  );
};

export default SellPage;
