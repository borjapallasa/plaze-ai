
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { useCreateCommunityProduct } from "@/hooks/use-create-community-product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductVariantsEditor } from "@/components/product/ProductVariants";
import { ProductOrganization } from "@/components/product/ProductOrganization";
import { usePendingImages } from "@/hooks/use-pending-images";
import { ProductCreateHeader } from "@/components/product/ProductCreateHeader";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";
import { ProductStatus } from "@/hooks/use-create-product";
import { Variant } from "@/components/product/types/variants";

export default function NewCommunityProductPage() {
  const { id: communityId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createCommunityProduct, isCreating } = useCreateCommunityProduct();
  
  const [communityName, setCommunityName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Product form state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productType, setProductType] = useState<"free" | "paid">("free");
  const [productPrice, setProductPrice] = useState("");
  const [filesLink, setFilesLink] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [productStatus, setProductStatus] = useState<ProductStatus>("draft");
  
  const { pendingImages, addPendingImage } = usePendingImages();

  // Default variant for pricing display
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "",
      price: 0,
      comparePrice: 0,
      highlight: false,
      label: "Package",
      tags: [],
      createdAt: new Date().toISOString(),
      features: [],
      filesLink: ""
    }
  ]);

  useEffect(() => {
    if (variants.length === 1) {
      const updatedVariant = {
        ...variants[0],
        name: productName || variants[0].name,
        price: Number(productPrice) || variants[0].price,
        filesLink: filesLink || variants[0].filesLink
      };

      if (JSON.stringify(updatedVariant) !== JSON.stringify(variants[0])) {
        setVariants([updatedVariant]);
      }
    }
  }, [productName, productPrice, filesLink]);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      if (!communityId) return;

      try {
        const { data, error } = await supabase
          .from("communities")
          .select("name")
          .eq("community_uuid", communityId)
          .single();

        if (error) {
          console.error("Error fetching community details:", error);
          setError("Failed to load community details");
          toast.error("Failed to load community details");
          return;
        }

        if (data) {
          setCommunityName(data.name);
        }
      } catch (err) {
        console.error("Error in fetching community:", err);
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [communityId]);

  const handleStatusChange = (value: ProductStatus) => {
    setProductStatus(value);
  };

  const handleCreateProduct = async () => {
    if (!communityId) {
      toast.error("Community ID is missing");
      return;
    }

    try {
      await createCommunityProduct({
        name: productName,
        communityUuid: communityId,
        productType: productType,
        price: productType === "paid" && productPrice ? parseFloat(productPrice) : undefined,
        paymentLink: productType === "paid" ? paymentLink : undefined,
        filesLink: filesLink || undefined,
      });

      toast.success("Product added to your community successfully");
      navigate(`/community/${communityId}`);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container max-w-6xl py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading community details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="container max-w-6xl py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <ProductCreateHeader
            productStatus={productStatus}
            onStatusChange={handleStatusChange}
            onSave={handleCreateProduct}
            isSaving={isCreating}
            isValid={!!productName.trim()}
          />
          
          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <Card className="p-3 sm:p-6">
                  <div className="space-y-4">
                    <ProductBasicDetailsForm
                      productName={productName}
                      setProductName={setProductName}
                      productDescription={productDescription}
                      setProductDescription={setProductDescription}
                      productPrice={productPrice}
                      setProductPrice={setProductPrice}
                      filesLink={filesLink}
                      setFilesLink={setFilesLink}
                    />
                    
                    {/* Product type selection */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Product Type</h3>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="productType"
                            value="free"
                            checked={productType === "free"}
                            onChange={() => setProductType("free")}
                            className="h-4 w-4"
                          />
                          <span>Free</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="productType"
                            value="paid"
                            checked={productType === "paid"}
                            onChange={() => setProductType("paid")}
                            className="h-4 w-4"
                          />
                          <span>Paid</span>
                        </label>
                      </div>
                    </div>
                    
                    {productType === "paid" && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Payment Link</h3>
                        <input
                          type="url"
                          placeholder="https://your-payment-provider.com/buy/your-product"
                          value={paymentLink}
                          onChange={(e) => setPaymentLink(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Variants</h2>
                      </div>
                      <ProductVariantsEditor
                        variants={variants}
                        onVariantsChange={setVariants}
                      />
                    </div>
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
              <Card className="p-3 sm:p-6">
                <h2 className="text-lg font-medium mb-3">Community Information</h2>
                <p className="text-sm text-muted-foreground">This product will be added to:</p>
                <div className="mt-2 p-3 bg-secondary/20 rounded-md">
                  <h3 className="font-medium">{communityName}</h3>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
