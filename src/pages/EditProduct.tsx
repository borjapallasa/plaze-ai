import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductStatus } from "@/components/product/ProductStatus";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const EditProduct = () => {
  const { id } = useParams();
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productComparePrice, setProductComparePrice] = useState("");
  const [techStack, setTechStack] = useState("");
  const [techStackPrice, setTechStackPrice] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [demo, setDemo] = useState("");
  const [publicLink, setPublicLink] = useState("");
  const [type, setType] = useState("");
  const [useCase, setUseCase] = useState("");
  const [platform, setPlatform] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newTeam, setNewTeam] = useState("");
  
  const { data: product, isLoading } = useQuery({
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

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setProductDescription(product.description || "");
      setProductPrice(product.price ? product.price.toString() : "");
      setProductComparePrice(product.compare_at_price ? product.compare_at_price.toString() : "");
      setTechStack(product.tech_stack || "");
      setTechStackPrice(product.tech_stack_price || "");
      setProductIncludes(product.product_includes || "");
      setDifficultyLevel(product.difficulty_level || "");
      setDemo(product.demo || "");
      setPublicLink(product.public_link || "");
      setType(product.type || "");
      setUseCase(product.use_case || "");
      
      const platformArray = product.platform as unknown as (string | number)[];
      setPlatform(platformArray ? platformArray.map(item => String(item)) : []);
      
      const teamArray = product.team as unknown as (string | number)[];
      setTeam(teamArray ? teamArray.map(item => String(item)) : []);
    }
  }, [product]);

  const handleAddPlatform = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPlatform.trim()) {
      setPlatform([...platform, newPlatform.trim()]);
      setNewPlatform("");
    }
  };

  const handleAddTeam = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTeam.trim()) {
      setTeam([...team, newTeam.trim()]);
      setNewTeam("");
    }
  };

  const handleRemovePlatform = (platformToRemove: string) => {
    setPlatform(platform.filter(p => p !== platformToRemove));
  };

  const handleRemoveTeam = (teamToRemove: string) => {
    setTeam(team.filter(t => t !== teamToRemove));
  };

  const handleAddVariant = () => {
    setShowVariantForm(true);
  };

  if (isLoading) {
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
                <p className="text-sm text-muted-foreground mt-2">Product details and configuration</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <div className="lg:hidden">
                  <ProductStatus />
                </div>

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
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="compare-price">Compare-at price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                          <Input
                            id="compare-price"
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            value={productComparePrice}
                            onChange={(e) => setProductComparePrice(e.target.value)}
                          />
                        </div>
                      </div>
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
                    <div>
                      <Label htmlFor="public_link">Public Link</Label>
                      <Input 
                        id="public_link" 
                        placeholder="Enter public link" 
                        type="url"
                        value={publicLink}
                        onChange={(e) => setPublicLink(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Media</h2>
                  <ProductMediaUpload productUuid={id} />
                </Card>

                <Card className="p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Variants</h2>
                    {!showVariantForm && (
                      <Button 
                        onClick={handleAddVariant} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add variant
                      </Button>
                    )}
                  </div>
                  {showVariantForm && (
                    <ProductVariantsEditor
                      variants={[
                        {
                          id: "1",
                          name: productName,
                          price: productPrice,
                          comparePrice: productComparePrice,
                          highlight: true,
                          tags: [],
                        },
                      ]}
                    />
                  )}
                </Card>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              <div className="hidden lg:block">
                <ProductStatus />
              </div>
              <Card className="p-3 sm:p-6">
                <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Organization</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input 
                      id="type" 
                      placeholder="Select product type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="use_case">Use Case</Label>
                    <Input 
                      id="use_case" 
                      placeholder="Select use case"
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {platform.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {p}
                          <button
                            onClick={() => handleRemovePlatform(p)}
                            className="hover:text-primary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input 
                      id="platform" 
                      placeholder="Enter platform and press Enter"
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value)}
                      onKeyPress={handleAddPlatform}
                    />
                  </div>
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {team.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {t}
                          <button
                            onClick={() => handleRemoveTeam(t)}
                            className="hover:text-primary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input 
                      id="team" 
                      placeholder="Enter team member role and press Enter"
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      onKeyPress={handleAddTeam}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
