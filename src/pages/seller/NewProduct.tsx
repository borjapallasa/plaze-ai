
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { useCreateProduct, ProductStatus } from "@/hooks/use-create-product";
import { ProductCreateHeader } from "@/components/product/ProductCreateHeader";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";
import { ProductDetailsForm } from "@/components/product/ProductDetailsForm";
import { ProductVariants } from "@/components/product/ProductVariants";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { Card } from "@/components/ui/card";
import { Variant } from "@/components/product/types/variants";
import { usePendingImages } from "@/hooks/use-pending-images";
import { ProductStatus as ProductStatusComponent } from "@/components/product/ProductStatus";

export default function NewProduct() {
  const navigate = useNavigate();
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productDemo, setProductDemo] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [techStack, setTechStack] = useState("");
  const [techStackPrice, setTechStackPrice] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [useCases, setUseCases] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [team, setTeam] = useState<string[]>([]);
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const { pendingImages, addPendingImage } = usePendingImages();

  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "Basic",
      price: 0,
      comparePrice: 0,
      label: "",
      highlight: false,
      tags: [],
      filesLink: "",
      additionalDetails: "",
    },
  ]);

  const handleSave = async () => {
    if (!productName.trim()) {
      return;
    }

    try {
      await createProduct({
        name: productName,
        description: productDescription,
        status,
        variants,
        images: pendingImages.map(img => img.file),
        thumbnailFile: thumbnailFile || undefined,
        demo: productDemo,
        productIncludes,
        techStack,
        techStackPrice,
        difficultyLevel,
        industries,
        useCases,
        platform,
        team,
      });

      navigate("/seller");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const isValid = productName.trim() !== "";

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <ProductCreateHeader
            productStatus={status}
            onStatusChange={setStatus}
            onSave={handleSave}
            isSaving={isCreating}
            isValid={isValid}
          />
          
          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <Card className="p-3 sm:p-6">
                  <ProductBasicDetailsForm
                    productName={productName}
                    setProductName={setProductName}
                    productDescription={productDescription}
                    setProductDescription={setProductDescription}
                    productDemo={productDemo}
                    setProductDemo={setProductDemo}
                    productIncludes={productIncludes}
                    setProductIncludes={setProductIncludes}
                  />
                </Card>

                <Card className="p-3 sm:p-6">
                  <ProductDetailsForm
                    techStack={techStack}
                    setTechStack={setTechStack}
                    techStackPrice={techStackPrice}
                    setTechStackPrice={setTechStackPrice}
                    difficultyLevel={difficultyLevel}
                    setDifficultyLevel={setDifficultyLevel}
                    industries={industries}
                    setIndustries={setIndustries}
                    useCases={useCases}
                    setUseCases={setUseCases}
                    platform={platform}
                    setPlatform={setPlatform}
                    team={team}
                    setTeam={setTeam}
                  />
                </Card>

                <Card className="p-3 sm:p-6">
                  <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Variants</h2>
                  <ProductVariants variants={variants} onVariantsChange={setVariants} />
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
              <ProductStatusComponent 
                status={status} 
                onStatusChange={setStatus}
                thumbnailFile={thumbnailFile}
                onThumbnailChange={setThumbnailFile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
