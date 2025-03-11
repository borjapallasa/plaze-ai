
import React from "react";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";
import { ServiceForm } from "@/components/service/ServiceForm";
import { CommunityForm } from "./community/CommunityForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BasicInfoStepProps {
  selectedOption: string;
  formData: any;
  onChange: (name: string, value: any) => void;
  onCategoryChange?: (value: any) => void;
  onSubcategoriesChange?: (value: string) => void;
  onRemoveSubcategory?: (value: string) => void;
}

export function BasicInfoStep({
  selectedOption,
  formData,
  onChange,
  onCategoryChange,
  onSubcategoriesChange,
  onRemoveSubcategory,
}: BasicInfoStepProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleCommunityImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);

      onChange('thumbnail', publicUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your community thumbnail has been updated.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (selectedOption === "products") {
    return (
      <ProductBasicDetailsForm
        productName={formData.name}
        setProductName={(value) => onChange("name", value)}
        productDescription={formData.description}
        setProductDescription={(value) => onChange("description", value)}
      />
    );
  }

  if (selectedOption === "services") {
    return (
      <ServiceForm
        name={formData.name}
        description={formData.description}
        price={formData.servicePrice}
        type={formData.serviceType}
        category={formData.category}
        selectedSubcategories={formData.selectedSubcategories}
        onNameChange={(value) => onChange("name", value)}
        onDescriptionChange={(value) => onChange("description", value)}
        onPriceChange={(value) => onChange("servicePrice", value)}
        onTypeChange={(value) => onChange("serviceType", value)}
        onCategoryChange={onCategoryChange}
        onSubcategoriesChange={onSubcategoriesChange}
        onRemoveSubcategory={onRemoveSubcategory}
      />
    );
  }

  if (selectedOption === "community") {
    return (
      <CommunityForm
        formData={{
          name: formData.name || "",
          description: formData.description || "",
          intro: formData.intro || "",
          type: formData.type || "free",
          price: formData.price || "",
          thumbnail: formData.thumbnail
        }}
        onChange={onChange}
        onImageUpload={handleCommunityImageUpload}
        isUploading={isUploading}
      />
    );
  }

  return null;
}
