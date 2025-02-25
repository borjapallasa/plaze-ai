
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
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("one time");

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
        setFeatures(JSON.stringify(data.features || [], null, 2));
        setPrice(data.price?.toString() || "");
        setServiceType(data.type || "one time");
      }

      return data;
    },
    enabled: !!id
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      let parsedFeatures;
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "Please check your features format",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('services')
        .update({
          name: serviceName,
          description: serviceDescription,
          features: parsedFeatures,
          price: parseFloat(price) || 0,
          type: serviceType
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
              <Link to="/seller/services">
                <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-full">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Edit Service</h1>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">Service details and configuration</p>
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <Card className="p-3 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter service name"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <ProductEditor 
                      value={serviceDescription}
                      onChange={setServiceDescription}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Features (JSON format)</Label>
                    <textarea
                      id="features"
                      className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder='Enter features in JSON format, e.g.: ["Feature 1", "Feature 2"]'
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Service Type</Label>
                    <Select value={serviceType} onValueChange={(value: ServiceType) => setServiceType(value)}>
                      <SelectTrigger>
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
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="p-3 sm:p-6">
                <h2 className="text-lg font-medium mb-4">Service Organization</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Additional service configuration options will be available here.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
