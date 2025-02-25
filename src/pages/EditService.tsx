import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductEditor } from "@/components/product/ProductEditor";
import { useToast } from "@/components/ui/use-toast";
import { ServiceFeatures } from "@/components/service/ServiceFeatures";
import { ServiceCategories } from "@/components/service/ServiceCategories";
import { SERVICE_TYPES, CategoryType, ServiceType } from "@/constants/service-categories";

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
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <Link to="/seller/services">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1 hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-full">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Edit Service</h1>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Service details and configuration</p>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="min-w-[120px]"
                  >
                    {isSaving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <Card className="p-4 sm:p-6">
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium mb-2 block">
                      Service Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter a clear, descriptive name for your service"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-base font-medium mb-2 block">
                      Description
                    </Label>
                    <ProductEditor 
                      value={serviceDescription}
                      onChange={setServiceDescription}
                    />
                  </div>

                  <ServiceFeatures 
                    features={features}
                    onAddFeature={handleAddFeature}
                    onRemoveFeature={handleRemoveFeature}
                    onFeatureChange={handleFeatureChange}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                    <div>
                      <Label htmlFor="price" className="text-base font-medium mb-2 block">
                        Price
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Enter service price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="h-11 w-[240px]"
                      />
                    </div>
                    <div className="flex-1 max-w-[240px]">
                      <Label htmlFor="type" className="text-base font-medium mb-2 block">
                        Service Type
                      </Label>
                      <Select 
                        value={serviceType} 
                        onValueChange={(value: ServiceType) => setServiceType(value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
                <h2 className="text-lg font-semibold tracking-tight mb-4">Service Organization</h2>
                <div className="space-y-4">
                  <ServiceCategories 
                    category={category}
                    selectedSubcategories={selectedSubcategories}
                    onCategoryChange={(value: CategoryType) => {
                      setCategory(value);
                      setSelectedSubcategories([]);
                    }}
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
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
