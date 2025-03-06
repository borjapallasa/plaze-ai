
import React, { useState } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { ServiceForm } from "@/components/service/ServiceForm";
import { ServiceFeatures } from "@/components/service/ServiceFeatures";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { CategoryType } from "@/constants/service-categories";
import type { ServiceType } from "@/components/expert/types";
import { useCreateService } from "@/hooks/use-create-service";

export default function NewServicePage() {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("one time");
  const [category, setCategory] = useState<CategoryType | "">("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const { handleSave, isSaving } = useCreateService();

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleCreateService = async () => {
    try {
      await handleSave({
        name: serviceName,
        description: serviceDescription,
        features,
        price: Number(price),
        type: serviceType,
        main_category: category ? { value: category } : null,
        subcategory: selectedSubcategories.map(sub => ({ value: sub })),
        status: "draft"
      });
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="space-y-6">
          <Card className="p-6">
            <ServiceForm
              serviceName={serviceName}
              serviceDescription={serviceDescription}
              price={price}
              serviceType={serviceType}
              onServiceNameChange={setServiceName}
              onServiceDescriptionChange={setServiceDescription}
              onPriceChange={setPrice}
              onServiceTypeChange={setServiceType}
            />
          </Card>

          <Card className="p-6">
            <ServiceFeatures
              features={features}
              onAddFeature={handleAddFeature}
              onRemoveFeature={handleRemoveFeature}
              onFeatureChange={handleFeatureChange}
            />
          </Card>

          <Card className="p-6">
            <ServiceCategories
              category={category}
              selectedSubcategories={selectedSubcategories}
              onCategoryChange={setCategory}
              onSubcategoriesChange={(value) => {
                if (!selectedSubcategories.includes(value)) {
                  setSelectedSubcategories([...selectedSubcategories, value]);
                }
              }}
              onRemoveSubcategory={(value) => {
                setSelectedSubcategories(selectedSubcategories.filter(
                  (sub) => sub !== value
                ));
              }}
            />
          </Card>

          <div className="flex justify-end">
            <button
              onClick={handleCreateService}
              disabled={isSaving || !serviceName.trim()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? "Creating..." : "Create Service"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
