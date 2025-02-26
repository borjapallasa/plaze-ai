
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
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function NewProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Get current user to set as expert_uuid
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

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

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productName,
          description: productDescription,
          user_uuid: currentUser.id,
          expert_uuid: currentUser.id,
          status: 'draft'
        })
        .select()
        .single();

      if (productError) throw productError;

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
                  <p className="text-sm text-muted-foreground">Enter the basic details for your new product</p>
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

          <div className="space-y-6">
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
