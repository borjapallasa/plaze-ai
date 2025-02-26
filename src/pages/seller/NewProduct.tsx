
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { ProductDetailsForm } from "@/components/product/ProductDetailsForm";
import { ProductOrganization } from "@/components/product/ProductOrganization";
import { Variant } from "@/components/product/types/variants";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePendingImages } from "@/hooks/use-pending-images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductStatus = 'draft' | 'active' | 'inactive';

export default function NewProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [techStackPrice, setTechStackPrice] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [demo, setDemo] = useState("");
  const [productStatus, setProductStatus] = useState<ProductStatus>("draft");
  const [industries, setIndustries] = useState<string[]>([]);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const { pendingImages, addPendingImage, uploadPendingImages } = usePendingImages();
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "",
      price: "0",
      comparePrice: "0",
      highlight: false,
      tags: [],
      createdAt: new Date().toISOString(),
    }
  ]);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  const { data: expertData } = useQuery({
    queryKey: ['expertUuid', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .eq('user_uuid', currentUser.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser?.id
  });

  const handleStatusChange = (value: ProductStatus) => {
    setProductStatus(value);
  };

  const handleIndustryChange = (value: string) => {
    if (!value) return;
    setIndustries(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  const handleUseCaseChange = (value: string) => {
    if (!value) return;
    setUseCases(prev => prev.includes(value) ? prev.filter(uc => uc !== value) : [...prev, value]);
  };

  const handlePlatformChange = (value: string) => {
    if (!value) return;
    setPlatform(prev => prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]);
  };

  const handleTeamChange = (value: string) => {
    if (!value) return;
    setTeam(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
  };

  const renderSelectedTags = (items: string[]) => {
    if (items.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1.5 max-w-full">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-md text-sm relative isolate cursor-pointer group"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a product",
        variant: "destructive",
      });
      return;
    }

    if (!expertData?.expert_uuid) {
      toast({
        title: "Error",
        description: "Expert profile not found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          status: productStatus,
          name: productName,
          description: productDescription,
          tech_stack: techStack,
          tech_stack_price: techStackPrice,
          product_includes: productIncludes,
          difficulty_level: difficultyLevel,
          demo: demo,
          industries: industries,
          use_case: useCases,
          platform: platform,
          team: team,
          user_uuid: currentUser.id,
          expert_uuid: expertData.expert_uuid, // Using the expert_uuid from the experts table
        })
        .select()
        .single();

      if (productError) throw productError;

      if (variants.length > 0) {
        const variantsToInsert = variants.map(variant => ({
          name: variant.name,
          price: Number(variant.price) || 0,
          compare_price: Number(variant.comparePrice) || 0,
          highlighted: variant.highlight,
          tags: variant.tags,
          product_uuid: product.product_uuid,
          user_uuid: currentUser.id,
          created_at: variant.createdAt,
        }));

        const { error: variantsError } = await supabase
          .from('variants')
          .insert(variantsToInsert);

        if (variantsError) throw variantsError;
      }

      await uploadPendingImages(product.product_uuid);

      toast({
        title: "Success",
        description: "Product created successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      navigate(`/seller/products/product/${product.product_uuid}`);
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
              <Link to="/seller/products">
                <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="w-full">
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Create New Product</h1>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">Enter the details for your new product</p>
                  <div className="flex items-center gap-4">
                    <Select value={productStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving || !productName.trim()}
                    >
                      {isSaving ? "Creating..." : "Create product"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <ProductDetailsForm
                  techStack={techStack}
                  setTechStack={setTechStack}
                  techStackPrice={techStackPrice}
                  setTechStackPrice={setTechStackPrice}
                  productIncludes={productIncludes}
                  setProductIncludes={setProductIncludes}
                  difficultyLevel={difficultyLevel}
                  setDifficultyLevel={setDifficultyLevel}
                  demo={demo}
                  setDemo={setDemo}
                  productName={productName}
                  setProductName={setProductName}
                  productDescription={productDescription}
                  setProductDescription={setProductDescription}
                />

                <Card className="p-3 sm:p-6">
                  <div className="pt-2">
                    <ProductVariantsEditor 
                      variants={variants}
                      onVariantsChange={setVariants}
                    />
                  </div>
                </Card>

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
                  <ProductMediaUpload productUuid="" onFileSelect={addPendingImage} />
                  {pendingImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {pendingImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg border overflow-hidden">
                          <img
                            src={image.previewUrl}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              <ProductOrganization
                industries={industries}
                useCases={useCases}
                platform={platform}
                team={team}
                onIndustryChange={handleIndustryChange}
                onUseCaseChange={handleUseCaseChange}
                onPlatformChange={handlePlatformChange}
                onTeamChange={handleTeamChange}
                renderSelectedTags={renderSelectedTags}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
