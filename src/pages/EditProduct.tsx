import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainHeader } from "@/components/MainHeader";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { ArrowLeft, Plus, X, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import RelatedProducts from "@/components/RelatedProducts";

type ProductStatus = 'draft' | 'active' | 'inactive';

const USE_CASES = [
  "E-commerce",
  "Blog", 
  "Portfolio",
  "Dashboard",
  "Social Network",
  "Analytics",
  "CMS",
  "Authentication",
];

const PLATFORMS = [
  "Web",
  "Mobile",
  "Desktop",
  "iOS",
  "Android",
  "Windows",
  "macOS",
  "Linux",
];

const TEAM_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "QA Engineer",
];

export default function EditProduct() {
  const { id } = useParams();
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
  const [localVariants, setLocalVariants] = useState<any[]>([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);

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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newItems = items.filter(i => i !== item);
                if (items === industries) setIndustries(newItems);
                if (items === useCases) setUseCases(newItems);
                if (items === platform) setPlatform(newItems);
                if (items === team) setTeam(newItems);
              }}
              className="hover:text-primary-foreground relative z-10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div 
              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            />
          </span>
        ))}
      </div>
    );
  };

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_uuid', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: variants = [], isLoading: isLoadingVariants, refetch: refetchVariants } = useQuery({
    queryKey: ['variants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  useEffect(() => {
    if (variants.length > 0) {
      setLocalVariants(variants.map(v => ({
        id: v.variant_uuid,
        name: v.name || "",
        price: v.price?.toString() || "0",
        comparePrice: v.compare_price?.toString() || "0",
        highlight: v.highlighted || false,
        tags: Array.isArray(v.tags) ? v.tags : []
      })));
    }
  }, [variants]);

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setProductDescription(product.description || "");
      setTechStack(product.tech_stack || "");
      setTechStackPrice(product.tech_stack_price || "");
      setProductIncludes(product.product_includes || "");
      setDifficultyLevel(product.difficulty_level || "");
      setDemo(product.demo || "");
      setProductStatus((product.status as ProductStatus) || "draft");
      setIndustries(Array.isArray(product.industries) ? product.industries.map(String) : []);
      setUseCases(Array.isArray(product.use_case) ? product.use_case.map(String) : []);
      setPlatform(Array.isArray(product.platform) ? product.platform.map(String) : []);
      setTeam(Array.isArray(product.team) ? product.team.map(String) : []);
    }
  }, [product]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving product with ID:', id);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

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
          status: productStatus,
          industries: industries,
          use_case: useCases,
          platform: platform,
          team: team
        })
        .eq('product_uuid', id);

      if (productError) throw productError;

      if (deletedVariantIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('variants')
          .delete()
          .in('variant_uuid', deletedVariantIds);
        
        if (deleteError) throw deleteError;
      }

      for (const variant of localVariants) {
        if (variant.id.toString().includes('temp_')) {
          const { error: insertError } = await supabase
            .from('variants')
            .insert({
              user_uuid: user.id,
              product_uuid: id,
              name: variant.name,
              price: parseFloat(variant.price),
              compare_price: parseFloat(variant.comparePrice),
              highlighted: variant.highlight,
              tags: Array.isArray(variant.tags) ? variant.tags : []
            });
          
          if (insertError) throw insertError;
        } else {
          const { error: updateError } = await supabase
            .from('variants')
            .update({
              name: variant.name,
              price: parseFloat(variant.price),
              compare_price: parseFloat(variant.comparePrice),
              highlighted: variant.highlight,
              tags: Array.isArray(variant.tags) ? variant.tags : []
            })
            .eq('variant_uuid', variant.id);
          
          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Saved",
        description: "All changes have been saved successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
        duration: 2000,
      });
      
      setDeletedVariantIds([]);
      
      refetchVariants();
      
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVariant = () => {
    const newVariant = {
      id: `temp_${Date.now()}`,
      name: "New Variant",
      price: "0",
      comparePrice: "0",
      highlight: false,
      tags: []
    };
    
    setLocalVariants(prev => [...prev, newVariant]);
  };

  const handleVariantsChange = (updatedVariants: any[]) => {
    const removedVariants = localVariants
      .filter(v => !updatedVariants.find(uv => uv.id === v.id))
      .filter(v => !v.id.toString().includes('temp_'))
      .map(v => v.id);
    
    setDeletedVariantIds(prev => [...prev, ...removedVariants]);
    setLocalVariants(updatedVariants);
  };

  if (isLoadingProduct || isLoadingVariants) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="mt-16 p-6">Loading...</div>
      </div>
    );
  }

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
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words pr-2">Edit Product</h1>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">Product details and configuration</p>
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
              <div className="space-y-3 sm:space-y-6">
                <Card className="p-3 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <ProductEditor 
                        value={productDescription}
                        onChange={setProductDescription}
                      />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-4">
                        <Label>Variants</Label>
                        <Button 
                          onClick={handleAddVariant} 
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add variant
                        </Button>
                      </div>
                      <ProductVariantsEditor
                        variants={localVariants}
                        onVariantsChange={handleVariantsChange}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Details</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="tech_stack">Tech Stack</Label>
                      <Input 
                        id="tech_stack" 
                        placeholder="Enter required tech stack"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tech_stack_price">Tech Stack Pricing</Label>
                      <Input 
                        id="tech_stack_price" 
                        placeholder="Enter tech stack pricing details"
                        value={techStackPrice}
                        onChange={(e) => setTechStackPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_includes">What's Included</Label>
                      <Input 
                        id="product_includes" 
                        placeholder="Enter what's included in the product"
                        value={productIncludes}
                        onChange={(e) => setProductIncludes(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty_level">Difficulty Level</Label>
                      <Input 
                        id="difficulty_level" 
                        placeholder="Select difficulty level"
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="demo">Demo Link</Label>
                      <Input 
                        id="demo" 
                        placeholder="Enter demo URL" 
                        type="url"
                        value={demo}
                        onChange={(e) => setDemo(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
                  <ProductMediaUpload productUuid={id} />
                </Card>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              <Card className="p-3 sm:p-6">
                <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Organization</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="industries" className="text-sm mb-1.5">Industries</Label>
                    <Select
                      value=""
                      onValueChange={handleIndustryChange}
                    >
                      <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
                        {renderSelectedTags(industries) || <SelectValue placeholder="Select industries" />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="use_case" className="text-sm mb-1.5">Use Case</Label>
                    <Select
                      value=""
                      onValueChange={handleUseCaseChange}
                    >
                      <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
                        {renderSelectedTags(useCases) || <SelectValue placeholder="Select use cases" />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {USE_CASES.map((useCase) => (
                            <SelectItem 
                              key={useCase} 
                              value={useCase}
                            >
                              {useCase}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="platform" className="text-sm mb-1.5">Platform</Label>
                    <Select
                      value=""
                      onValueChange={handlePlatformChange}
                    >
                      <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
                        {renderSelectedTags(platform) || <SelectValue placeholder="Select platforms" />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {PLATFORMS.map((p) => (
                            <SelectItem 
                              key={p} 
                              value={p}
                            >
                              {p}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="team" className="text-sm mb-1.5">Team</Label>
                    <Select
                      value=""
                      onValueChange={handleTeamChange}
                    >
                      <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
                        {renderSelectedTags(team) || <SelectValue placeholder="Select team roles" />}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {TEAM_ROLES.map((role) => (
                            <SelectItem 
                              key={role} 
                              value={role}
                            >
                              {role}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <RelatedProducts
                    productId={id || ""}
                    userUuid={product?.user_uuid || ""}
                    className="mt-6"
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
