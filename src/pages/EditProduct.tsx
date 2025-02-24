
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Variant } from "@/components/product/types/variants";
import { useProduct } from "@/hooks/useProduct";
import { useVariants } from "@/hooks/useVariants";
import { EditProductLoading } from "@/components/product/edit/EditProductLoading";
import { EditProductLayout } from "@/components/product/edit/EditProductLayout";
import { saveProductChanges } from "@/services/productService";

const EditProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = params.product_uuid;

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

  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { data: variants = [], isLoading: isLoadingVariants } = useVariants(productId);

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
      await saveProductChanges(
        productId,
        {
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
        },
        localVariants
      );

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
    return <EditProductLoading />;
  }

  return (
    <EditProductLayout
      isSaving={isSaving}
      onSave={handleSaveChanges}
      productId={productId || ""}
      productName={productName}
      productDescription={productDescription}
      variants={localVariants}
      onNameChange={setProductName}
      onDescriptionChange={setProductDescription}
      onVariantsChange={setLocalVariants}
      onAddVariant={handleAddVariant}
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
      industries={industries}
      useCases={useCases}
      platform={platform}
      team={team}
      onIndustryChange={handleIndustryChange}
      onUseCaseChange={handleUseCaseChange}
      onPlatformChange={handlePlatformChange}
      onTeamChange={handleTeamChange}
    />
  );
};

export default EditProduct;
