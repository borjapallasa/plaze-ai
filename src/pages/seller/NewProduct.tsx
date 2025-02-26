
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [variants, setVariants] = useState([]);

  // Get current user to set as expert_uuid
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
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
            className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-md text-sm"
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

    try {
      setIsSaving(true);

      // Create the product with the correct field names from the database schema
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
          expert_uuid: currentUser.id,
        })
        .select()
        .single();

      if (productError) throw productError;

      // If we have variants, create them
      if (variants.length > 0) {
        const { error: variantsError } = await supabase
          .from('variants')
          .insert(
            variants.map(variant => ({
              ...variant,
              product_uuid: product.product_uuid,
              user_uuid: currentUser.id
            }))
          );

        if (variantsError) throw variantsError;
      }

      toast({
        title: "Success",
        description: "Product created successfully",
        className: "bg-[#F2FCE2] border-green-100 text-green-800",
      });

      // Navigate to the edit page of the newly created product
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
                <Card className="p-3 sm:p-6">
                  <div className="space-y-4">
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
                      <ProductVariantsEditor 
                        variants={variants}
                        onVariantsChange={setVariants}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Details</h2>
                  <div className="space-y-4">
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
                  <ProductMediaUpload productUuid={""} />
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
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Blog">Blog</SelectItem>
                          <SelectItem value="Portfolio">Portfolio</SelectItem>
                          <SelectItem value="Dashboard">Dashboard</SelectItem>
                          <SelectItem value="Social Network">Social Network</SelectItem>
                          <SelectItem value="Analytics">Analytics</SelectItem>
                          <SelectItem value="CMS">CMS</SelectItem>
                          <SelectItem value="Authentication">Authentication</SelectItem>
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
                          <SelectItem value="Web">Web</SelectItem>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="iOS">iOS</SelectItem>
                          <SelectItem value="Android">Android</SelectItem>
                          <SelectItem value="Windows">Windows</SelectItem>
                          <SelectItem value="macOS">macOS</SelectItem>
                          <SelectItem value="Linux">Linux</SelectItem>
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
                          <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                          <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                          <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                          <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                          <SelectItem value="Product Manager">Product Manager</SelectItem>
                          <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                          <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
