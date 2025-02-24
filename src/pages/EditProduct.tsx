import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Variant } from "@/components/product/types/variants";
import { EditProductHeader } from "@/components/product/edit/EditProductHeader";
import { ProductBasicInfo } from "@/components/product/edit/ProductBasicInfo";
import { ProductTechnicalDetails } from "@/components/product/edit/ProductTechnicalDetails";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductStatus } from "@/components/product/ProductStatus";
import { ProductOrganizationDetails } from "@/components/product/edit/ProductOrganizationDetails";

const EditProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = params.id;

  useEffect(() => {
    if (!productId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId)) {
      toast({
        title: "Error",
        description: "Invalid product ID",
        variant: "destructive",
      });
      navigate("/seller/products");
    }
  }, [productId, navigate, toast]);

  const [isSaving, setIsSaving] = useState(false);
  const [localVariants, setLocalVariants] = useState<Variant[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [techStackPrice, setTechStackPrice] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [demo, setDemo] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', productId)
        .maybeSingle();
        
      if (error) {
        console.error('Product fetch error:', error);
        throw error;
      }
      return data;
    },
    enabled: !!productId
  });

  const { data: variants = [], isLoading: isLoadingVariants } = useQuery({
    queryKey: ['variants', productId],
    queryFn: async () => {
      if (!productId) throw new Error("No product ID provided");

      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', productId);
        
      if (error) {
        console.error('Variants fetch error:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!productId
  });

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setProductDescription(product.description || "");
      setTechStack(product.tech_stack || "");
      setTechStackPrice(product.tech_stack_price || "");
      setProductIncludes(product.product_includes || "");
      setDifficultyLevel(product.difficulty_level || "");
      setDemo(product.demo || "");
      setIndustries(Array.isArray(product.industries) ? product.industries.map(i => String(i)) : []);
      setUseCases(product.use_case ? [product.use_case] : []);
      setPlatform(Array.isArray(product.platform) ? product.platform.map(p => String(p)) : []);
      setTeam(Array.isArray(product.team) ? product.team.map(t => String(t)) : []);
    }
  }, [product]);

  useEffect(() => {
    if (variants.length > 0) {
      const mappedVariants = variants.map(v => ({
        id: v.variant_uuid,
        name: v.name || "",
        price: v.price?.toString() || "0",
        comparePrice: v.compare_price?.toString() || "0",
        highlight: v.highlighted || false,
        tags: Array.isArray(v.tags) ? v.tags.map(tag => String(tag)) : [],
        features: []
      }));
      setLocalVariants(mappedVariants);
    }
  }, [variants]);

  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      name: "New Variant",
      price: "0",
      comparePrice: "0",
      highlight: false,
      tags: [],
      features: []
    };
    setLocalVariants([...localVariants, newVariant]);
  };

  const handleIndustryChange = (value: string) => {
    if (!value) return;
    setIndustries(prev => prev.includes(value) ? prev.filter(ind => ind !== value) : [...prev, value]);
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

  const handleSaveChanges = async () => {
    if (!productId) {
      toast({
        title: "Error",
        description: "No product ID provided",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      console.log('Saving product with ID:', productId);

      const { error: productError } = await supabase
        .from('products')
        .update({
          name: productName,
          description: productDescription,
          tech_stack: techStack,
          tech_stack_price: techStackPrice,
          product_includes: productIncludes,
          difficulty_level: difficultyLevel,
          demo: demo,
          industries: industries,
          use_case: useCases[0],
          platform: platform,
          team: team,
          updated_at: new Date().toISOString()
        })
        .eq('product_uuid', productId);

      if (productError) {
        console.error('Product update error:', productError);
        throw productError;
      }

      if (localVariants.length > 0) {
        const { error: deleteError } = await supabase
          .from('variants')
          .delete()
          .eq('product_uuid', productId);

        if (deleteError) {
          console.error('Variant deletion error:', deleteError);
          throw deleteError;
        }

        const variantsToInsert = localVariants.map(variant => ({
          variant_uuid: variant.id,
          product_uuid: productId,
          user_uuid: session.user.id,
          name: variant.name,
          price: Number(variant.price) || 0,
          compare_price: Number(variant.comparePrice) || 0,
          highlighted: variant.highlight,
          tags: variant.tags || []
        }));

        console.log('Inserting variants:', variantsToInsert);

        const { error: insertError } = await supabase
          .from('variants')
          .insert(variantsToInsert);

        if (insertError) {
          console.error('Variant insertion error:', insertError);
          throw insertError;
        }
      }

      toast({
        title: "Success",
        description: "All changes have been saved successfully",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProduct || isLoadingVariants) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="mt-16 p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <EditProductHeader isSaving={isSaving} onSave={handleSaveChanges} />

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <div className="lg:hidden">
                  <ProductStatus />
                </div>

                <ProductBasicInfo
                  productName={productName}
                  productDescription={productDescription}
                  variants={localVariants}
                  onNameChange={setProductName}
                  onDescriptionChange={setProductDescription}
                  onVariantsChange={setLocalVariants}
                  onAddVariant={handleAddVariant}
                />

                <ProductTechnicalDetails
                  techStack={techStack}
                  techStackPrice={techStackPrice}
                  productIncludes={productIncludes}
                  difficultyLevel={difficultyLevel}
                  demo={demo}
                  onTechStackChange={setTechStack}
                  onTechStackPriceChange={setTechStackPrice}
                  onProductIncludesChange={setProductIncludes}
                  onDifficultyLevelChange={setDifficultyLevel}
                  onDemoChange={setDemo}
                />

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
                  <ProductMediaUpload productUuid={productId} />
                </Card>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              <div className="hidden lg:block">
                <ProductStatus />
              </div>
              
              <ProductOrganizationDetails
                industries={industries}
                useCases={useCases}
                platform={platform}
                team={team}
                onIndustryChange={handleIndustryChange}
                onUseCaseChange={handleUseCaseChange}
                onPlatformChange={handlePlatformChange}
                onTeamChange={handleTeamChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
