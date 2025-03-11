
import React from "react";
import { SellPageLayout } from "@/components/sell/SellPageLayout";
import { TypeSelection } from "@/components/sell/TypeSelection";
import { BasicInfoStep } from "@/components/sell/BasicInfoStep";
import { ConfirmationStep } from "@/components/sell/ConfirmationStep";
import { useSellForm } from "@/hooks/sell/useSellForm";

const SellPage = () => {
  const { 
    currentStep,
    selectedOption,
    formData,
    handleOptionSelect,
    handleNext,
    handleBack,
    handleInputChange,
    handleCategoryChange,
    handleSubcategoriesChange,
    handleRemoveSubcategory,
    isNextDisabled
  } = useSellForm();

  console.log("Current Step:", currentStep);
  console.log("Selected Option:", selectedOption);
  console.log("Form Data:", formData);

  return (
    <SellPageLayout
      currentStep={currentStep}
      onNext={handleNext}
      onBack={handleBack}
      isNextDisabled={isNextDisabled}
      isFinalStep={currentStep === 3}
    >
      {currentStep === 1 && (
        <TypeSelection 
          selectedOption={selectedOption} 
          onSelect={handleOptionSelect} 
        />
      )}

      {currentStep === 2 && (
        <BasicInfoStep 
          selectedOption={selectedOption}
          formData={formData}
          onInputChange={handleInputChange}
          onCategoryChange={handleCategoryChange}
          onSubcategoriesChange={handleSubcategoriesChange}
          onRemoveSubcategory={handleRemoveSubcategory}
        />
      )}

      {currentStep === 3 && (
        <ConfirmationStep 
          selectedOption={selectedOption}
          formData={formData}
        />
      )}
    </SellPageLayout>
  );
};

export default SellPage;
