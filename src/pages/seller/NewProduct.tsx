
import React, { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import { ProductOrganization } from "@/components/product/ProductOrganization";
import { Variant } from "@/components/product/types/variants";
import { useCreateProduct, ProductStatus } from "@/hooks/use-create-product";
import { usePendingImages } from "@/hooks/use-pending-images";
import { ProductCreateHeader } from "@/components/product/ProductCreateHeader";
import { NewProductForm } from "@/components/product/NewProductForm";

export default function NewProduct() {
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
  const { pendingImages, addPendingImage, uploadPendingImages } = usePendingImages();

  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "",
      price: "0",
      comparePrice: "0",
      highlight: false,
      tags: [],
      createdAt: new Date().toISOString(),
    }
  ]);

  useEffect(() => {
    if (variants.length === 1) {
      const updatedVariant = {
        ...variants[0],
        name: productName || variants[0].name,
        price: techStackPrice || variants[0].price,
        comparePrice: variants[0].comparePrice
      };
      
      if (JSON.stringify(updatedVariant) !== JSON.stringify(variants[0])) {
        setVariants([updatedVariant]);
      }
    }
  }, [productName, techStackPrice, variants]);

  const { handleSave, isSaving } = useCreateProduct();

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
          </span>
        ))}
      </div>
    );
  };

  const handleCreateProduct = async () => {
    try {
      console.log('Starting product creation with pending images:', pendingImages.length);
      await handleSave({
        name: productName,
        description: productDescription,
        techStack,
        techStackPrice,
        productIncludes,
        difficultyLevel,
        demo,
        status: productStatus,
        industries,
        useCases,
        platform,
        team,
        variants,
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <ProductCreateHeader 
            productStatus={productStatus}
            onStatusChange={handleStatusChange}
            onSave={handleCreateProduct}
            isSaving={isSaving}
            isValid={!!productName.trim()}
          />

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <NewProductForm
                productName={productName}
                setProductName={setProductName}
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                techStack={techStack}
                setTechStack={setTechStack}
                techStackPrice={techStackPrice}
                setTechStackPrice={setTechStackPrice}
                productIncludes={productIncludes}
                setProductIncludes={setProductIncludes}
                difficultyLevel={difficultyLevel}
                setDifficultyLevel={setDifficultyLevel}
                demo={demo}
                setDemo={setDemo}
                variants={variants}
                setVariants={setVariants}
                pendingImages={pendingImages}
                addPendingImage={addPendingImage}
              />
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              <ProductOrganization
                industries={industries}
                useCases={useCases}
                platform={platform}
                team={team}
                onIndustryChange={handleIndustryChange}
                onUseCaseChange={handleUseCaseChange}
                onPlatformChange={handlePlatformChange}
                onTeamChange={handleTeamChange}
                renderSelectedTags={renderSelectedTags}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
