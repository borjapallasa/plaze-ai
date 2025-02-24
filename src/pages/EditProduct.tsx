import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductStatus } from "@/components/product/ProductStatus";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <ProductEditor />
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="tech_stack_price">Tech Stack Pricing</Label>
                      <Input 
                        id="tech_stack_price" 
                        placeholder="Enter tech stack pricing details"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_includes">What's Included</Label>
                      <Input 
                        id="product_includes" 
                        placeholder="Enter what's included in the product"
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty_level">Difficulty Level</Label>
                      <Input 
                        id="difficulty_level" 
                        placeholder="Select difficulty level"
                      />
                    </div>
                    <div>
                      <Label htmlFor="demo">Demo Link</Label>
                      <Input 
                        id="demo" 
                        placeholder="Enter demo URL" 
                        type="url"
                      />
                    </div>
                    <div>
                      <Label htmlFor="public_link">Public Link</Label>
                      <Input 
                        id="public_link" 
                        placeholder="Enter public link" 
                        type="url"
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
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add variant
                    </Button>
                  </div>
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
                    <Input id="type" placeholder="Select product type" />
                  </div>
                  <div>
                    <Label htmlFor="use_case">Use Case</Label>
                    <Input id="use_case" placeholder="Select use case" />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Input 
                      id="platform" 
                      placeholder="Enter platform details (e.g., Web, Mobile)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <Input 
                      id="team" 
                      placeholder="Enter team configuration"
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
