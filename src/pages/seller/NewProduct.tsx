
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { ProductCreateHeader } from "@/components/product/ProductCreateHeader";
import { ProductBasicDetailsForm } from "@/components/product/ProductBasicDetailsForm";
import { ProductDetailsForm } from "@/components/product/ProductDetailsForm";
import { VariantPicker } from "@/components/product/VariantPicker";
import { ProductStatus } from "@/components/product/ProductStatus";
import { ProductMediaUpload } from "@/components/product/ProductMediaUpload";
import { useCreateProduct } from "@/hooks/use-create-product";
import { Variant } from "@/components/product/types/variants";
import { toast } from "sonner";

type ProductStatusType = "visible" | "not visible" | "draft";

export default function NewProduct() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productIncludes, setProductIncludes] = useState("");
  const [techStack, setTechStack] = useState("");
  const [techStackPrice, setTechStackPrice] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [useCase, setUseCase] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [salesPage, setSalesPage] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState<ProductStatusType>("draft");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);

  const createProductMutation = useCreateProduct();

  const handleSubmit = async () => {
    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!productDescription.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (variants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    try {
      const result = await createProductMutation.mutateAsync({
        name: productName,
        description: productDescription,
        includes: productIncludes,
        tech_stack: techStack,
        target_audience: targetAudience,
        use_case: useCase,
        business_model: businessModel,
        sales_page: salesPage,
        demo_video: demoVideo,
        team: team,
        status: status,
        variants: variants,
        thumbnailFile: thumbnailFile,
        productImages: productImages,
      });

      if (result?.product_uuid) {
        toast.success("Product created successfully!");
        navigate(`/product/${result.product_uuid}/edit`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  const handleVariantChange = (newVariants: Variant[]) => {
    setVariants(newVariants);
  };

  const isValid = productName.trim() && productDescription.trim() && variants.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProductCreateHeader 
            productStatus={status}
            onStatusChange={setStatus}
            onSave={handleSubmit}
            isSaving={createProductMutation.isPending}
            isValid={isValid}
          />
          
          <ProductBasicDetailsForm
            productName={productName}
            setProductName={setProductName}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            productSummary={productIncludes}
            setProductSummary={setProductIncludes}
          />

          <ProductDetailsForm
            techStack={techStack}
            setTechStack={setTechStack}
            difficulty={techStackPrice}
            setDifficulty={setTechStackPrice}
            useCase={useCase}
            setUseCase={setUseCase}
            businessModel={businessModel}
            setBusinessModel={setBusinessModel}
            salesPage={salesPage}
            setSalesPage={setSalesPage}
            demoVideo={demoVideo}
            setDemoVideo={setDemoVideo}
            team={team}
            setTeam={setTeam}
          />

          <VariantPicker
            variants={variants}
            onVariantChange={handleVariantChange}
          />

          <ProductMediaUpload
            onThumbnailChange={setThumbnailFile}
            onProductImagesChange={setProductImages}
          />

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Product Status</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatusType)}
              className="w-full border rounded-md p-2"
            >
              <option value="draft">Draft</option>
              <option value="visible">Visible</option>
              <option value="not visible">Not Visible</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createProductMutation.isPending || !isValid}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {createProductMutation.isPending ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
