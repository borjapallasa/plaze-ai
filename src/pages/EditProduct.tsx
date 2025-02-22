
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainHeader } from "@/components/MainHeader";
import { ProductEditor } from "@/components/product/ProductEditor";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductStatus } from "@/components/product/ProductStatus";
import { ProductVariants } from "@/components/product/ProductVariants";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EditProduct = () => {
  return (
    <>
      <MainHeader />
      <div className="container py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/products">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Edit Product</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    defaultValue="Veilleuse LED Personnalisée Pour Enfants Lampe Arc-En-Ciel Avec Prénom"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <ProductEditor />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apps">Apps</Label>
                  <Input id="apps" placeholder="Enter required apps" />
                </div>
                <div>
                  <Label htmlFor="appsPricing">Apps Pricing</Label>
                  <Input id="appsPricing" placeholder="Enter apps pricing details" />
                </div>
                <div>
                  <Label htmlFor="included">Included</Label>
                  <Input id="included" placeholder="Enter what's included" />
                </div>
                <div>
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Input id="difficultyLevel" placeholder="Select difficulty level" />
                </div>
                <div>
                  <Label htmlFor="demo">Demo</Label>
                  <Input id="demo" placeholder="Enter demo link" type="url" />
                </div>
                <div>
                  <Label htmlFor="filesLink">Files Link</Label>
                  <Input id="filesLink" placeholder="Enter files link" type="url" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Media</h2>
              <ProductMediaUpload />
            </Card>

            <Card className="p-6">
              <ProductVariants />
            </Card>
          </div>

          <div className="space-y-6">
            <ProductStatus />
            
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Product Organization</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="team">Team</Label>
                  <Input id="team" placeholder="Select team" />
                </div>
                <div>
                  <Label htmlFor="industries">Industries</Label>
                  <Input id="industries" placeholder="Select industries" />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Input id="platform" placeholder="Select platform" />
                </div>
                <div>
                  <Label htmlFor="useCase">Use Case</Label>
                  <Input id="useCase" placeholder="Select use case" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
