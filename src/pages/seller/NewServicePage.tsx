
import React from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { ServiceForm } from "@/components/service/ServiceForm";

export default function NewServicePage() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Service creation functionality to be implemented
    console.log("Service creation not yet implemented");
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
            isLoading={false}
            submitButtonText="Create Service"
          />
        </div>
      </div>
    </div>
  );
}
