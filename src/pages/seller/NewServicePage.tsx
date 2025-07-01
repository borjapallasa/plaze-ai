
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { ServiceForm } from "@/components/service/ServiceForm";
import { useCreateService, ServiceData } from "@/hooks/use-create-service";
import { ServiceStatus } from "@/types/service";

export default function NewServicePage() {
  const navigate = useNavigate();
  const { createService, isLoading } = useCreateService();

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    price: number;
    type: "monthly" | "one time";
    features: string[];
    main_category: { value: string };
    subcategory: { value: string }[];
    status: ServiceStatus;
  }) => {
    try {
      const serviceData: ServiceData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        type: formData.type,
        features: formData.features,
        category: formData.main_category.value,
        tags: formData.subcategory.map(sub => sub.value),
        status: formData.status
      };

      const service = await createService(serviceData);
      if (service?.service_uuid) {
        navigate(`/service/${service.service_uuid}/edit`);
      }
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create New Service</h1>
            <p className="text-muted-foreground mt-2">
              Set up your service offering for potential clients
            </p>
          </div>

          <ServiceForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitButtonText="Create Service"
          />
        </div>
      </div>
    </div>
  );
}
