import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { X, Info } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { MainHeader } from "@/components/MainHeader";
import { toast } from "sonner";
import { ProductMainInfoPanel } from "@/components/product/ProductMainInfoPanel";
import { ProductTechnicalDetails } from "@/components/product/ProductTechnicalDetails";
import { ProductMediaSection } from "@/components/product/ProductMediaSection";
import { ProductOrganization } from "@/components/product/ProductOrganization";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { DangerZone } from "@/components/product/DangerZone";
import { useExpertQuery } from "@/hooks/expert/useExpertQuery";
import { CommunityProductSection } from "@/components/product/CommunityProductSection";
import { AffiliateProductSection } from "@/components/product/AffiliateProductSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductStatus = 'draft' | 'active' | 'inactive';

const USE_CASES = [
  "E-commerce",
  "Blog", 
  "Portfolio",
  "Dashboard",
  "Social Network",
  "Analytics",
  "CMS",
  "Authentication",
];

const PLATFORMS = [
  "Web",
  "Mobile",
  "Desktop",
  "iOS",
  "Android",
  "Windows",
  "macOS",
  "Linux",
];

const TEAM_ROLES = [
  "Frontend Developer",
  "Backend Developer", 
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "QA Engineer",
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
  const [localVariants, setLocalVariants] = useState<any[]>([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);

  const handleBackClick = () => {
    navigate(-1);
  };

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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newItems = items.filter(i => i !== item);
                if (items === industries) setIndustries(newItems);
                if (items === useCases) setUseCases(newItems);
                if (items === platform) setPlatform(newItems);
                if (items === team) setTeam(newItems);
              }}
              className="hover:text-primary-foreground relative z-10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div
              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            />
          </span>
        ))}
      </div>
    );
  };

  const { data: product, isLoading: isLoadingProduct } = useQuery({
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

  const { data: expertData } = useExpertQuery(product?.expert_uuid);

  const { data: variants = [], isLoading: isLoadingVariants, refetch: refetchVariants } = useQuery({
    queryKey: ['variants', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('variants')
        .select('*')
        .eq('product_uuid', id)
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  useEffect(() => {
    if (variants.length > 0) {
      setLocalVariants(variants.map(v => ({
        id: v.variant_uuid,
        name: v.name || "",
        price: v.price?.toString() || "0",
        comparePrice: v.compare_price?.toString() || "",
        highlight: v.highlighted || false,
        tags: Array.isArray(v.tags) ? v.tags : [],
        filesLink: v.files_link || "",
        additionalDetails: v.additional_details || ""
      })));
    }
  }, [variants]);

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setProductDescription(product.description || "");
      setTechStack(product.tech_stack || "");
      setTechStackPrice(product.tech_stack_price || "");
      setProductIncludes(product.product_includes || "");
      setDifficultyLevel(product.difficulty_level || "");
      setDemo(product.demo || "");
      setProductStatus((product.status as ProductStatus) || "draft");
      setIndustries(Array.isArray(product.industries) ? product.industries.map(String) : []);
      setUseCases(Array.isArray(product.use_case) ? product.use_case.map(String) : []);
      setPlatform(Array.isArray(product.platform) ? product.platform.map(String) : []);
      setTeam(Array.isArray(product.team) ? product.team.map(String) : []);
    }
  }, [product]);

  const handleAddVariant = () => {
    const newVariant = {
      id: `temp_${Date.now()}`,
      name: "New Variant",
      price: "0",
      comparePrice: "0",
      highlight: false,
      tags: [],
      filesLink: "",
      additionalDetails: ""
    };

    setLocalVariants(prev => [...prev, newVariant]);
  };

  const handleVariantsChange = (updatedVariants: any[]) => {
    console.log('handleVariantsChange called with:', updatedVariants);
    console.log('Current localVariants:', localVariants);

    // Get current variant IDs for comparison
    const currentIds = localVariants.map(v => v?.id).filter(Boolean);
    const updatedIds = updatedVariants.map(v => v?.id).filter(Boolean);

    console.log('Current variant IDs:', currentIds);
    console.log('Updated variant IDs:', updatedIds);

    // Find variants that were removed
    const removedIds = currentIds.filter(id => !updatedIds.includes(id));
    console.log('Removed variant IDs:', removedIds);

    // Only track database variants for deletion (not temp ones)
    const databaseVariantsToDelete = removedIds.filter(id => 
      id && !id.toString().startsWith('temp_')
    );

    console.log('Database variants to delete:', databaseVariantsToDelete);

    // Update deletedVariantIds if we have variants to delete
    if (databaseVariantsToDelete.length > 0) {
      setDeletedVariantIds(prev => {
        const updated = [...new Set([...prev, ...databaseVariantsToDelete])];
        console.log('Updated deletedVariantIds:', updated);
        return updated;
      });
    }

    // Update local variants
    setLocalVariants(updatedVariants);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving product with ID:', id);
      console.log('Deleted variant IDs to remove from database:', deletedVariantIds);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No authenticated user found');

      // Update product information
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: productName,
          description: productDescription,
          tech_stack: techStack,
          tech_stack_price: techStackPrice,
          product_includes: productIncludes,
          difficulty_level: difficultyLevel,
          demo: demo,
          status: productStatus,
          industries: industries,
          use_case: useCases,
          platform: platform,
          team: team
        })
        .eq('product_uuid', id);

      if (productError) throw productError;

      // Delete removed variants from database
      if (deletedVariantIds.length > 0) {
        console.log('Deleting variants from database:', deletedVariantIds);
        const { error: deleteError } = await supabase
          .from('variants')
          .delete()
          .in('variant_uuid', deletedVariantIds);

        if (deleteError) {
          console.error('Error deleting variants:', deleteError);
          throw deleteError;
        }
        console.log('Successfully deleted variants from database');
      }

      // Process remaining variants (insert new ones, update existing ones)
      for (const variant of localVariants) {
        if (!variant || !variant.id) {
          console.warn('Skipping variant without ID:', variant);
          continue;
        }

        if (variant.id.toString().includes('temp_')) {
          // Insert new variant
          console.log('Inserting new variant:', variant);
          const { error: insertError } = await supabase
            .from('variants')
            .insert({
              user_uuid: user.id,
              product_uuid: id,
              name: variant.name,
              price: parseFloat(variant.price) || 0,
              compare_price: parseFloat(variant.comparePrice) || 0,
              highlighted: variant.highlight,
              tags: Array.isArray(variant.tags) ? variant.tags : [],
              files_link: variant.filesLink,
              additional_details: variant.additionalDetails
            });

          if (insertError) {
            console.error('Error inserting variant:', insertError);
            throw insertError;
          }
        } else {
          // Update existing variant
          console.log('Updating existing variant:', variant);
          const { error: updateError } = await supabase
            .from('variants')
            .update({
              name: variant.name,
              price: parseFloat(variant.price) || 0,
              compare_price: parseFloat(variant.comparePrice) || 0,
              highlighted: variant.highlight,
              tags: Array.isArray(variant.tags) ? variant.tags : [],
              files_link: variant.filesLink,
              additional_details: variant.additionalDetails
            })
            .eq('variant_uuid', variant.id);

          if (updateError) {
            console.error('Error updating variant:', updateError);
            throw updateError;
          }
        }
      }

      toast.success("All changes have been saved successfully");

      // Clear deleted variant IDs after successful save
      setDeletedVariantIds([]);

      // Refetch variants to get updated data
      refetchVariants();

    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (redirectUrl: string) => {
    if (!id) return;

    try {
      setIsDeleting(true);

      const { error: variantsError } = await supabase
        .from('variants')
        .delete()
        .eq('product_uuid', id);

      if (variantsError) throw variantsError;

      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('product_uuid', id);

      if (productError) throw productError;

      toast.error("Your product has been permanently deleted");

      navigate(redirectUrl);

    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");

    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getProductType = () => {
    const isActive = productStatus === 'active';
    const hasCommunityProduct = !!product?.community_product_uuid;

    if (isActive && hasCommunityProduct) {
      return { 
        label: "Dual Product", 
        variant: "default" as const,
        description: "This product is active in both marketplace and community"
      };
    } else if (isActive && !hasCommunityProduct) {
      return { 
        label: "Marketplace Only", 
        variant: "secondary" as const,
        description: "This product is only available in the marketplace"
      };
    } else if (!isActive && hasCommunityProduct) {
      return { 
        label: "Community Only", 
        variant: "outline" as const,
        description: "This product is only available in the community"
      };
    }
    return null;
  };

  if (isLoadingProduct || isLoadingVariants) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader />
        <div className="mt-16 p-6">Loading...</div>
      </div>
    );
  }

  const productType = getProductType();

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16">
        <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          {/* Header with back button and title */}
          <div className="mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 mt-1"
                onClick={handleBackClick}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 min-w-0">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl sm:text-2xl font-semibold">Edit Product</h1>
                  <p className="text-sm text-muted-foreground mt-1">Product details and configuration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              <div className="space-y-3 sm:space-y-6">
                <ProductMainInfoPanel
                  productName={productName}
                  setProductName={setProductName}
                  productDescription={productDescription}
                  setProductDescription={setProductDescription}
                  localVariants={localVariants}
                  onAddVariant={handleAddVariant}
                  onVariantsChange={handleVariantsChange}
                />

                <ProductTechnicalDetails
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
                />

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

                <ProductMediaSection productUuid={id} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3 sm:space-y-6">
              {/* Status and Save Controls */}
              <Card className="p-3 sm:p-6">
                <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Status</h2>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Select value={productStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="sm:w-auto"
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Product Type Container */}
              {productType && (
                <Card className="p-3 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-700">Product Type</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-center">{productType.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 cursor-default">
                      <span className="text-sm font-semibold text-gray-900">
                        {productType.label}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-3 sm:p-6">
                <h2 className="text-lg font-medium mb-3 sm:mb-4">Related Products</h2>
                <div className="space-y-4">
                  <RelatedProducts
                    productId={id || ""}
                    userUuid={product?.user_uuid || ""}
                    className=""
                  />
                </div>
              </Card>

              <CommunityProductSection 
                expertUuid={expertData?.expert_uuid}
                productUuid={id}
              />

              <AffiliateProductSection 
                expertUuid={expertData?.expert_uuid}
                productUuid={id}
              />

              <Card className="p-3 sm:p-6">
                <DangerZone
                  productName={productName}
                  isDeleting={isDeleting}
                  showDeleteDialog={showDeleteDialog}
                  sellerUuid={product?.expert_uuid || ""}
                  setShowDeleteDialog={setShowDeleteDialog}
                  onDeleteProduct={handleDeleteProduct}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
