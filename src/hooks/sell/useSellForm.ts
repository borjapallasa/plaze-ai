
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryType, ServiceType } from "@/constants/service-categories";

export function useSellForm() {
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
    communityType: "free" as "free" | "paid",
    communityPrice: "",
    thumbnail: "",
    price: "",
    techStack: "",
    difficultyLevel: "beginner",
    productType: "template"
  });
  const navigate = useNavigate();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, sellType: option }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Final step - navigate based on selection
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
            price: formData.price,
            techStack: formData.techStack,
            difficultyLevel: formData.difficultyLevel,
            thumbnail: formData.thumbnail,
            contactEmail: formData.contactEmail,
            productType: formData.productType
          }
        });
      } else if (selectedOption === "community") {
        navigate("/seller/communities/new", {
          state: {
            name: formData.name,
            description: formData.description,
            price: formData.communityPrice,
            type: formData.communityType,
            thumbnail: formData.thumbnail
          }
        });
      }
    } else {
      // Move to next step
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

  const handleInputChange = (name: string, value: any) => {
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

  // Calculate if next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !selectedOption;
    } else if (currentStep === 2) {
      if (!formData.name || !formData.description) return true;
      
      if (selectedOption === "services") {
        return !formData.servicePrice || !formData.category;
      } else if (selectedOption === "community") {
        return formData.communityType === "paid" && !formData.communityPrice;
      } else if (selectedOption === "products") {
        return !formData.contactEmail || !formData.price;
      }
    }
    return false;
  };

  return {
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
    isNextDisabled: isNextDisabled()
  };
}
