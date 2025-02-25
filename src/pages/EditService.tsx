
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MainHeader } from "@/components/MainHeader";
import { ServiceForm } from "@/components/service/ServiceForm";
import { CategoryType, ServiceType } from "@/constants/service-categories";

export default function EditService() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("one time");
  const [category, setCategory] = useState<CategoryType | "">("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('service_uuid', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setServiceName(data.name || "");
        setServiceDescription(data.description || "");
        const featuresArray = Array.isArray(data.features) 
          ? (data.features as Array<string | number>).map(feature => String(feature)) 
          : [""];
        setFeatures(featuresArray);
        setPrice(data.price?.toString() || "");
        setServiceType(data.type || "one time");
        
        const mainCategory = data.main_category ? String(data.main_category) : "";
        setCategory(mainCategory as CategoryType);
        
        const subcategories = Array.isArray(data.subcategory) 
          ? data.subcategory.map(sub => String(sub))
          : [];
        setSelectedSubcategories(subcategories);
      }

      return data;
    },
    enabled: !!id
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const cleanedFeatures = features.filter(feature => feature.trim() !== "");

      const { error } = await supabase
        .from('services')
        .update({
          name: serviceName,
          description: serviceDescription,
          features: cleanedFeatures,
          price: parseFloat(price) || 0,
          type: serviceType,
          main_category: category,
          subcategory: selectedSubcategories
        })
        .eq('service_uuid', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mt-16 p-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>
      
      <ServiceForm 
        serviceName={serviceName}
        serviceDescription={serviceDescription}
        features={features}
        price={price}
        serviceType={serviceType}
        category={category}
        selectedSubcategories={selectedSubcategories}
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
          if (selectedSubcategories.includes(value)) {
            setSelectedSubcategories(selectedSubcategories.filter(v => v !== value));
          } else {
            setSelectedSubcategories([...selectedSubcategories, value]);
          }
        }}
        onRemoveSubcategory={(value: string) => {
          setSelectedSubcategories(selectedSubcategories.filter(s => s !== value));
        }}
        onSave={handleSave}
      />
    </div>
  );
}
