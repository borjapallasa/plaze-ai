import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { ServiceForm } from "@/components/service/ServiceForm";
import { useCreateService } from "@/hooks/use-create-service";
import { toast } from "sonner";
import type { ServiceType, CategoryType } from "@/constants/service-categories";
import type { ServiceStatus } from "@/components/expert/types";

export default function NewServicePage() {
  const navigate = useNavigate();
  const { createService, isCreating } = useCreateService();

  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("one time");
  const [features, setFeatures] = useState<string[]>([""]);
  const [category, setCategory] = useState<CategoryType | "">("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const handleCategoryChange = (value: CategoryType | "") => {
    setCategory(value);
    setSelectedSubcategories([]);
  };

  const handleSubcategoriesChange = (value: string) => {
    if (!selectedSubcategories.includes(value)) {
      setSelectedSubcategories([...selectedSubcategories, value]);
    }
  };

  const handleRemoveSubcategory = (value: string) => {
    setSelectedSubcategories(selectedSubcategories.filter(item => item !== value));
  };

  const handleSave = async () => {
    if (!serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }

    try {
      const serviceData = {
        name: serviceName,
        description: serviceDescription,
        price: parseFloat(price) || 0,
        type: serviceType,
        features,
        main_category: category ? { value: category } : null,
        subcategory: selectedSubcategories.length > 0 
          ? selectedSubcategories.map(sub => ({ value: sub })) 
          : null,
        status: "draft" as ServiceStatus
      };

      const result = await createService(serviceData);
      if (result?.service_uuid) {
        toast.success("Service created successfully");
        navigate(`/service/${result.service_uuid}/edit`);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <ServiceForm
        serviceName={serviceName}
        serviceDescription={serviceDescription}
        price={price}
        serviceType={serviceType}
        features={features}
        category={category}
        selectedSubcategories={selectedSubcategories}
        isSaving={isCreating}
        onServiceNameChange={setServiceName}
        onServiceDescriptionChange={setServiceDescription}
        onPriceChange={setPrice}
        onServiceTypeChange={setServiceType}
        onAddFeature={handleAddFeature}
        onRemoveFeature={handleRemoveFeature}
        onFeatureChange={handleFeatureChange}
        onCategoryChange={handleCategoryChange}
        onSubcategoriesChange={handleSubcategoriesChange}
        onRemoveSubcategory={handleRemoveSubcategory}
        onSave={handleSave}
      />
    </div>
  );
}
