
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductEditor } from "@/components/product/ProductEditor";
import { useToast } from "@/components/ui/use-toast";

const CATEGORIES = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "business", label: "Business" },
] as const;

const SUBCATEGORIES = {
  development: [
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile Development" },
    { value: "desktop", label: "Desktop Development" },
    { value: "database", label: "Database" },
    { value: "devops", label: "DevOps" },
  ],
  design: [
    { value: "ui", label: "UI Design" },
    { value: "ux", label: "UX Design" },
    { value: "graphic", label: "Graphic Design" },
    { value: "brand", label: "Brand Design" },
  ],
  marketing: [
    { value: "social", label: "Social Media" },
    { value: "content", label: "Content Marketing" },
    { value: "seo", label: "SEO" },
    { value: "email", label: "Email Marketing" },
  ],
  business: [
    { value: "strategy", label: "Business Strategy" },
    { value: "consulting", label: "Consulting" },
    { value: "analytics", label: "Analytics" },
    { value: "planning", label: "Planning" },
  ],
} as const;

type CategoryType = typeof CATEGORIES[number]['value'];

const SERVICE_TYPES = [
  { value: "one time", label: "One Time" },
  { value: "monthly", label: "Monthly" }
] as const;

type ServiceType = typeof SERVICE_TYPES[number]['value'];

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

  const availableSubcategories = category ? SUBCATEGORIES[category] : [];

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
                  <div className="flex items-center gap-4">
                    <Select value={serviceType} onValueChange={(value: ServiceType) => setServiceType(value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one time">One Time</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
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
          </div>

          <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <Card className="p-4 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-1.5 block">
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
                    <Label htmlFor="description" className="text-sm font-medium mb-1.5 block">
                      Description
                    </Label>
                    <ProductEditor 
                      value={serviceDescription}
                      onChange={setServiceDescription}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Features</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={handleAddFeature}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            placeholder={`Feature ${index + 1}`}
                            className="h-11"
                          />
                          {features.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-11 w-11 flex-shrink-0"
                              onClick={() => handleRemoveFeature(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price" className="text-sm font-medium mb-1.5 block">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter service price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="h-11 max-w-[240px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-sm font-medium mb-1.5 block">
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

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium mb-1.5 block">
                      Category
                    </Label>
                    <Select 
                      value={category} 
                      onValueChange={(value: CategoryType) => {
                        setCategory(value);
                        setSelectedSubcategories([]); // Reset subcategories when category changes
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategories" className="text-sm font-medium mb-1.5 block">
                      Subcategories
                    </Label>
                    <Select 
                      value=""
                      onValueChange={(value: string) => {
                        if (selectedSubcategories.includes(value)) {
                          setSelectedSubcategories(selectedSubcategories.filter(v => v !== value));
                        } else {
                          setSelectedSubcategories([...selectedSubcategories, value]);
                        }
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select subcategories" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((subcat) => (
                          <SelectItem 
                            key={subcat.value} 
                            value={subcat.value}
                            className="relative"
                          >
                            <div className="flex items-center">
                              {subcat.label}
                              {selectedSubcategories.includes(subcat.value) && (
                                <div className="ml-auto">✓</div>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedSubcategories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedSubcategories.map((sub) => {
                          const subcatLabel = availableSubcategories.find(s => s.value === sub)?.label;
                          return (
                            <div
                              key={sub}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                            >
                              {subcatLabel}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => setSelectedSubcategories(selectedSubcategories.filter(s => s !== sub))}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="p-4 sm:p-6 border border-border/40 bg-card/40">
                <h2 className="text-lg font-semibold tracking-tight mb-4">Service Organization</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Configure additional service settings, organization details, and metadata to better manage your service offerings.
                  </p>
                  <div className="border-t border-border/40 pt-4">
                    <p className="text-xs text-muted-foreground">
                      More configuration options will be available soon.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
