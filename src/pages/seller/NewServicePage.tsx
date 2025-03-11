
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { NewServiceForm } from "@/components/service/NewServiceForm";
import { useCreateService } from "@/hooks/use-create-service";
import { toast } from "sonner";
import type { ServiceType, CategoryType } from "@/constants/service-categories";
import type { ServiceStatus } from "@/components/expert/types";

export default function NewServicePage() {
  const navigate = useNavigate();
  const { createService, isCreating } = useCreateService();

  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("one time");
  const [category, setCategory] = useState<CategoryType | "">("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [status, setStatus] = useState<ServiceStatus>("draft");

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
        price: parseFloat(price) || 0,
        type: serviceType,
        main_category: category ? { value: category } : null,
        subcategory: selectedSubcategories.length > 0 
          ? selectedSubcategories.map(sub => ({ value: sub })) 
          : null,
        status: status as ServiceStatus
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
      <MainHeader />
      <div className="w-full max-w-[1400px] mx-auto px-4 py-4 mt-12">
        <NewServiceForm
          serviceName={serviceName}
          price={price}
          serviceType={serviceType}
          category={category}
          selectedSubcategories={selectedSubcategories}
          status={status}
          isSaving={isCreating}
          onServiceNameChange={setServiceName}
          onPriceChange={setPrice}
          onServiceTypeChange={setServiceType}
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
