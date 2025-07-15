
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { SellLayout } from "@/components/sell/SellLayout";
import { ProductCreateHeader } from "@/components/product/ProductCreateHeader";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";
import { ProductDetailsForm } from "@/components/product/ProductDetailsForm";
import { ProductVariants } from "@/components/product/ProductVariants";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { ProductStatus } from "@/components/product/ProductStatus";
import { useCreateProduct } from "@/hooks/use-create-product";
import { Variant } from "@/components/product/types/variants";
import { toast } from "sonner";

export default function NewProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createProduct, isLoading } = useCreateProduct();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [category, setCategory] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [team, setTeam] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "active" | "inactive">("draft");

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !productDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const productData = {
        name: productName,
        description: productDescription,
        short_description: shortDescription,
        tech_stack: techStack,
        difficulty_level: difficultyLevel,
        category,
        product_includes: productIncludes,
        demo_url: demoUrl,
        video_url: videoUrl,
        additional_details: additionalDetails,
        team,
        variants,
        thumbnail,
        product_images: productImages,
        tags,
        status,
      };

      const result = await createProduct(productData);
      
      if (result.success) {
        toast.success("Product created successfully!");
        navigate(`/seller`);
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An error occurred while creating the product");
    }
  };

  const handleVariantChange = (newVariants: Variant[]) => {
    setVariants(newVariants);
  };

  return (
    <SellLayout>
      <div className="max-w-4xl mx-auto">
        <ProductCreateHeader />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <ProductBasicDetailsForm
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
          />

          <ProductDetailsForm
            techStack={techStack}
            setTechStack={setTechStack}
            difficultyLevel={difficultyLevel}
            setDifficultyLevel={setDifficultyLevel}
            category={category}
            setCategory={setCategory}
            productIncludes={productIncludes}
            setProductIncludes={setProductIncludes}
            demoUrl={demoUrl}
            setDemoUrl={setDemoUrl}
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            additionalDetails={additionalDetails}
            setAdditionalDetails={setAdditionalDetails}
            team={team}
            setTeam={setTeam}
          />

          <ProductVariants
            variants={variants}
            onVariantsChange={handleVariantChange}
          />

          <ProductMediaUpload
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            productImages={productImages}
            setProductImages={setProductImages}
          />

          <ProductStatus
            status={status}
            onStatusChange={setStatus}
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/seller")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </SellLayout>
  );
}
