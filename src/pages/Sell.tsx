
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SellLayout } from "@/components/sell/SellLayout";
import { ChooseTypeStep } from "@/components/sell/ChooseTypeStep";
import { BasicInfoStep } from "@/components/sell/BasicInfoStep";
import { ConfirmationStep } from "@/components/sell/ConfirmationStep";
import { NavigationButtons } from "@/components/sell/NavigationButtons";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const SellPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sellType: "",
    name: "",
    description: "",
    contactEmail: "",
    firstName: "",
    lastName: "",
    intro: "",
    type: "free",
    price: "",
    thumbnail: "",
    videoUrl: "",
    productPrice: "",
    filesLink: "",
    captchaConfirmed: false
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, contactEmail: user.email }));
    }
  }, [user]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setFormData(prev => ({ ...prev, sellType: option }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (!formData.captchaConfirmed) {
        toast.error("Please confirm that you are not a robot");
        return;
      }

      if (!user) {
        if (!formData.firstName.trim()) {
          toast.error("Please enter your first name");
          return;
        }
        if (!formData.lastName.trim()) {
          toast.error("Please enter your last name");
          return;
        }
        if (!formData.contactEmail.trim()) {
          toast.error("Please enter your email address");
          return;
        }
      }

      if (selectedOption === "products") {
        navigate("/seller/products/new", {
          state: {
            name: formData.name,
            description: formData.description,
            price: formData.productPrice,
            filesLink: formData.filesLink
          }
        });
      } else if (selectedOption === "community") {
        // Removed thumbnail requirement - community can be created without photo
        navigate("/seller/communities/new", {
          state: {
            name: formData.name,
            description: formData.description,
            intro: formData.intro,
            type: formData.type,
            price: formData.type === "paid" ? formData.price : "0",
            thumbnail: formData.thumbnail, // Optional - can be empty
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
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCommunityTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleFileSelect = (file: File) => {
    console.log("File selected in SellPage:", file.name);
    const fileUrl = URL.createObjectURL(file);
    console.log("Created object URL:", fileUrl);
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
            handleCommunityTypeChange={handleCommunityTypeChange}
            handleFileSelect={handleFileSelect}
            setFormData={setFormData}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep 
            selectedOption={selectedOption}
            formData={formData}
            handleInputChange={handleInputChange}
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
