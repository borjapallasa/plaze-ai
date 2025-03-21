
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MainHeader } from "@/components/MainHeader";
import { ServiceForm } from "@/components/service/ServiceForm";
import { DangerZone } from "@/components/service/DangerZone";
import { CategoryType, ServiceType } from "@/constants/service-categories";
import { useAuth } from "@/lib/auth";
import type { ServiceStatus } from "@/components/expert/types";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("one time");
  const [category, setCategory] = useState<CategoryType | "">("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [status, setStatus] = useState<ServiceStatus>("draft");
  const [expertUuid, setExpertUuid] = useState<string | null>(null);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      console.log("Fetching service with ID:", id);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('service_uuid', id)
        .single();

      if (error) {
        console.error("Error fetching service:", error);
        throw error;
      }
      
      console.log("Service data:", data);
      
      if (data) {
        setServiceName(data.name || "");
        setServiceDescription(data.description || "");
        
        // Handle features array properly
        let featuresArray: string[] = [""];
        if (data.features) {
          try {
            if (Array.isArray(data.features)) {
              featuresArray = data.features.map(f => String(f));
            } else if (typeof data.features === 'string') {
              featuresArray = JSON.parse(data.features);
            }
            if (featuresArray.length === 0) featuresArray = [""];
          } catch (e) {
            console.error("Error parsing features:", e);
          }
        }
        setFeatures(featuresArray);
        
        setPrice(data.price?.toString() || "");
        setServiceType((data.type as ServiceType) || "one time");
        setStatus((data.status as ServiceStatus) || "draft");
        setExpertUuid(data.expert_uuid || null);
        
        // Handle main category
        let mainCategory = "";
        if (data.main_category) {
          if (typeof data.main_category === 'object' && data.main_category !== null) {
            mainCategory = (data.main_category as any).value || "";
          } else {
            mainCategory = String(data.main_category);
          }
        }
        setCategory(mainCategory as CategoryType);
        
        // Handle subcategories
        let subcategories: string[] = [];
        if (data.subcategory) {
          try {
            if (Array.isArray(data.subcategory)) {
              subcategories = data.subcategory.map(sub => {
                if (typeof sub === 'object' && sub !== null) {
                  return (sub as any).value || "";
                }
                return String(sub);
              }).filter(Boolean);
            } else if (typeof data.subcategory === 'string') {
              subcategories = JSON.parse(data.subcategory);
            }
          } catch (e) {
            console.error("Error parsing subcategories:", e);
          }
        }
        setSelectedSubcategories(subcategories);
      }

      return data;
    },
    enabled: !!id
  });

  // First, check if we have a valid user
  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save a service");
      return;
    }

    if (!id) {
      toast.error("Service ID is missing");
      return;
    }

    if (!serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Verify that we have an expert profile
      if (!expertUuid) {
        const { data: expertData, error: expertError } = await supabase
          .from("experts")
          .select("expert_uuid")
          .eq("user_uuid", user.id)
          .single();

        if (expertError) {
          console.error("Error fetching expert:", expertError);
          toast.error("Could not verify your expert profile");
          return;
        }

        if (!expertData?.expert_uuid) {
          toast.error("Expert profile not found");
          return;
        }
        
        setExpertUuid(expertData.expert_uuid);
      }
      
      const cleanedFeatures = features.filter(feature => feature.trim() !== "");
      
      // Prepare data with proper JSON structure for Supabase
      const serviceData = {
        service_uuid: id, // Include the primary key
        user_uuid: user.id, // Ensure user_uuid is included for RLS policies
        expert_uuid: expertUuid,
        name: serviceName,
        description: serviceDescription,
        features: cleanedFeatures,
        price: parseFloat(price) || 0,
        type: serviceType,
        main_category: category ? { value: category } : null,
        subcategory: selectedSubcategories.length > 0 
          ? selectedSubcategories.map(sub => ({ value: sub })) 
          : [],
        status: status
      };

      console.log("Updating service with ID:", id);
      console.log("Updating service with data:", JSON.stringify(serviceData));
      
      // Use upsert with all required fields
      const { data, error } = await supabase
        .from('services')
        .upsert(serviceData)
        .select();

      if (error) {
        console.error('Error updating service:', error);
        toast.error("Failed to update service: " + error.message);
        return;
      }

      console.log("Update response:", data);
      toast.success("Your service has been updated successfully");
      
      // Refresh the page data to confirm changes were saved
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error("Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    if (newFeatures.length === 0) {
      setFeatures([""]);
    } else {
      setFeatures(newFeatures);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleDeleteService = async (redirectUrl: string) => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('service_uuid', id);
      
      if (error) throw error;

      toast.success("Your service has been permanently deleted");
      
      navigate(redirectUrl);
      
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="w-full max-w-[1400px] mx-auto px-4 py-8 mt-12">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="w-full max-w-[1400px] mx-auto px-4 py-4 mt-12">
        <ServiceForm 
          serviceName={serviceName}
          serviceDescription={serviceDescription}
          features={features}
          price={price}
          serviceType={serviceType}
          category={category}
          selectedSubcategories={selectedSubcategories}
          status={status}
          isSaving={isSaving}
          onServiceNameChange={setServiceName}
          onServiceDescriptionChange={setServiceDescription}
          onAddFeature={handleAddFeature}
          onRemoveFeature={handleRemoveFeature}
          onFeatureChange={handleFeatureChange}
          onPriceChange={setPrice}
          onServiceTypeChange={setServiceType}
          onCategoryChange={setCategory}
          onSubcategoriesChange={(value: string) => {
            if (!selectedSubcategories.includes(value)) {
              setSelectedSubcategories([...selectedSubcategories, value]);
            }
          }}
          onRemoveSubcategory={(value: string) => {
            setSelectedSubcategories(selectedSubcategories.filter(s => s !== value));
          }}
          onStatusChange={setStatus}
          onSave={handleSave}
          dangerZone={
            <DangerZone 
              serviceName={serviceName}
              isDeleting={isDeleting}
              showDeleteDialog={showDeleteDialog}
              sellerUuid={service?.expert_uuid || ""}
              setShowDeleteDialog={setShowDeleteDialog}
              onDeleteService={handleDeleteService}
            />
          }
        />
      </div>
    </div>
  );
}
