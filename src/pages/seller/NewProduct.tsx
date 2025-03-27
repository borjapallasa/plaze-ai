import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { Variant } from "@/components/product/types/variants";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [productUuid, setProductUuid] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [techStack, setTechStack] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "Default Variant",
      price: 0,
      comparePrice: 0,
      highlight: false,
      tags: [],
      label: "Package",
      features: [],
      createdAt: new Date().toISOString(),
    },
  ]);

  // Generate product UUID and slug on component mount
  useEffect(() => {
    const uuid = uuidv4();
    setProductUuid(uuid);
    
    // Generate a slug from the product name
    const generateSlug = () => {
      if (name) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        setProductSlug(slug);
      }
    };

    generateSlug();
  }, [name]);

  // Handle file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 5,
    onDrop: acceptedFiles => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleFileUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsLoading(true);
    const urls = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `lovable-uploads/${fileName}`;
      
      try {
        const { error: uploadError, data } = await supabase.storage
          .from('public')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
        
        urls.push(publicUrl);
        setUploadProgress(Math.round(((i + 1) / uploadedFiles.length) * 100));
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setUploadedFileUrls(urls);
    setIsLoading(false);
    setUploadProgress(0);
    
    toast({
      title: "Files Uploaded",
      description: `Successfully uploaded ${urls.length} files.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a product.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Insert the product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          product_uuid: productUuid,
          name,
          description,
          type: productType,
          tech_stack: techStack,
          product_includes: productIncludes,
          difficulty_level: difficultyLevel,
          demo: demoLink,
          slug: productSlug,
          user_uuid: session.user.id,
          status: 'active',
        })
        .select();
      
      if (productError) {
        throw productError;
      }
      
      // Insert variants
      for (const variant of variants) {
        const { error: variantError } = await supabase
          .from('variants')
          .insert({
            variant_uuid: uuidv4(),
            product_uuid: productUuid,
            name: variant.name,
            price: variant.price,
            compare_price: variant.comparePrice,
            label: variant.label,
            features: variant.features,
            highlight: variant.highlight,
          });
        
        if (variantError) {
          throw variantError;
        }
      }
      
      // Insert product images
      for (const url of uploadedFileUrls) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_image_uuid: uuidv4(),
            product_uuid: productUuid,
            url,
            position: uploadedFileUrls.indexOf(url),
          });
        
        if (imageError) {
          throw imageError;
        }
      }
      
      toast({
        title: "Product Created",
        description: "Your product has been successfully created.",
      });
      
      // Redirect to the product page
      navigate(`/product/${productSlug}/${productUuid}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextTab = () => {
    if (activeTab === "basic") {
      setActiveTab("variants");
    } else if (activeTab === "variants") {
      setActiveTab("media");
    }
  };

  const prevTab = () => {
    if (activeTab === "variants") {
      setActiveTab("basic");
    } else if (activeTab === "media") {
      setActiveTab("variants");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
          
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="variants">Pricing & Variants</TabsTrigger>
                <TabsTrigger value="media">Media & Publish</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="Describe your product"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type</Label>
                      <Select value={productType} onValueChange={setProductType} required>
                        <SelectTrigger id="productType">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="plugin">Plugin</SelectItem>
                          <SelectItem value="script">Script</SelectItem>
                          <SelectItem value="app">App</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="techStack">Tech Stack</Label>
                      <Input 
                        id="techStack" 
                        value={techStack} 
                        onChange={(e) => setTechStack(e.target.value)} 
                        placeholder="e.g. React, Node.js, MongoDB"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="productIncludes">What's Included</Label>
                      <Textarea 
                        id="productIncludes" 
                        value={productIncludes} 
                        onChange={(e) => setProductIncludes(e.target.value)} 
                        placeholder="List what's included in your product"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                      <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                        <SelectTrigger id="difficultyLevel">
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="demoLink">Demo Link</Label>
                      <Input 
                        id="demoLink" 
                        value={demoLink} 
                        onChange={(e) => setDemoLink(e.target.value)} 
                        placeholder="URL to demo or video"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={nextTab}>
                    Next: Pricing & Variants
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="variants" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <ProductVariantsEditor 
                      variants={variants} 
                      onVariantsChange={setVariants} 
                    />
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextTab}>
                    Next: Media & Publish
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <div 
                        {...getRootProps()} 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input {...getInputProps()} />
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag & drop images here, or click to select files
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          (Up to 5 images, JPEG, PNG or GIF)
                        </p>
                      </div>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Files</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden border">
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Preview ${index}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleFileUpload}
                          disabled={isLoading || uploadedFiles.length === 0}
                          className="mt-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading ({uploadProgress}%)
                            </>
                          ) : (
                            "Upload Files"
                          )}
                        </Button>
                      </div>
                    )}
                    
                    {uploadedFileUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedFileUrls.map((url, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden border">
                              <img 
                                src={url} 
                                alt={`Uploaded ${index}`}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevTab}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Product...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </main>
    </div>
  );
}
