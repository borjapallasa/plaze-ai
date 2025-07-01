
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { ServiceForm } from "@/components/service/ServiceForm";
import { useCreateService } from "@/hooks/use-create-service";
import { toast } from "sonner";
import type { ServiceType, CategoryType } from "@/constants/service-categories";
import type { ServiceStatus } from "@/components/expert/types";

interface LocationState {
  name?: string;
  description?: string;
  price?: string;
  type?: ServiceType;
  category?: { value: string } | null;
  subcategory?: { value: string }[] | null;
}

export default function NewServicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createService, isCreating } = useCreateService();
  const locationState = location.state as LocationState | undefined;

  const [serviceName, setServiceName] = useState(locationState?.name || "");
  const [serviceDescription, setServiceDescription] = useState(locationState?.description || "");
  const [price, setPrice] = useState(locationState?.price || "");
  const [serviceType, setServiceType] = useState<ServiceType>(locationState?.type || "one time");
  const [features, setFeatures] = useState<string[]>([""]);
  const [category, setCategory] = useState<CategoryType | "">(
    locationState?.category ? locationState.category.value as CategoryType : ""
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    locationState?.subcategory ? locationState.subcategory.map(sub => sub.value) : []
  );
  const [status, setStatus] = useState<ServiceStatus>("draft");

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
      const cleanedFeatures = features.filter(feature => feature.trim() !== "");
      
      const serviceData = {
        name: serviceName,
        description: serviceDescription,
        price: parseFloat(price) || 0,
        type: serviceType,
        features: cleanedFeatures,
        main_category: category ? { value: category } : null,
        subcategory: selectedSubcategories.length > 0 
          ? selectedSubcategories.map(sub => ({ value: sub })) 
          : null,
        status: status as ServiceStatus
      };

      console.log("Creating service with data:", serviceData);
      
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
      <MainHeader />
      <div className="w-full max-w-[1400px] mx-auto px-4 py-4 mt-12">
        <ServiceForm
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          price={price}
          serviceType={serviceType}
          features={features}
          category={category}
          selectedSubcategories={selectedSubcategories}
          status={status}
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
          onStatusChange={setStatus}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
