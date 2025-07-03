import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductVariants } from "@/hooks/use-product-variants";
import { Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ProductVariant } from "@/types/Product";
import { EditVariantDialog } from "./EditVariantDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface TemplateVariablesProps {
  productUuid: string;
  techStack?: string;
  productIncludes?: string;
  platform?: any[];
  team?: any[];
  useCase?: any[];
  industries?: any[];
}

export function TemplateVariables({
  productUuid,
  techStack,
  productIncludes,
  platform,
  team,
  useCase,
  industries
}: TemplateVariablesProps) {
  const {
    data: variants = [],
    isLoading,
    refetch
  } = useProductVariants(productUuid);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleCopyFilesLink = (filesLink: string) => {
    if (filesLink) {
      navigator.clipboard.writeText(filesLink);
      toast.success("Files link copied to clipboard");
    } else {
      toast.error("No files link available");
    }
  };

  const handleOpenFilesLink = (filesLink: string) => {
    if (filesLink) {
      window.open(filesLink, '_blank');
    } else {
      toast.error("No files link available");
    }
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setIsEditDialogOpen(true);
  };

  const handleSaveVariant = async (variantId: string, updatedData: Partial<ProductVariant>) => {
    try {
      console.log("Updating variant:", variantId, updatedData);

      // Map frontend fields to database fields
      const dbUpdateData = {
        name: updatedData.name,
        price: updatedData.price,
        compare_price: updatedData.comparePrice,
        files_link: updatedData.filesLink,
        additional_details: updatedData.additionalDetails,
        tags: updatedData.tags
      };

      const { error } = await supabase
        .from('variants')
        .update(dbUpdateData)
        .eq('variant_uuid', variantId);

      if (error) {
        console.error("Error updating variant:", error);
        toast.error("Failed to update variant");
        return;
      }

      // Force refetch of the variants data
      await refetch();

      // Also invalidate the query cache as a backup
      await queryClient.invalidateQueries({
        queryKey: ['variants', productUuid]
      });

      toast.success("Variant updated successfully");
      console.log("Variant update completed successfully");
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error("Failed to update variant");
    }
  };

  const handleDeleteVariant = (variantId: string) => {
    // TODO: Implement delete functionality
    toast.info("Delete functionality coming soon");
  };

  const renderBadgeList = (items: any[], label: string) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="text-sm text-[#8E9196]">{label}</p>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
              {typeof item === 'string' ? item : item.name || item.value || 'Unknown'}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Variants */}
          {!isLoading && (
            <div className="space-y-4">
              {variants.length > 0 ? (
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="border rounded-lg overflow-hidden">
                      {/* Variant Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-base">{variant.name}</h4>
                            {variant.tags && variant.tags.length > 0 && (
                              <div className="flex gap-1">
                                {variant.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">${variant.price}</span>
                                {variant.comparePrice && variant.comparePrice > variant.price && (
                                  <span className="text-sm text-gray-500 line-through">${variant.comparePrice}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditVariant(variant)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteVariant(variant.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Files Link Section */}
                      <div className="p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#8E9196] mb-1 font-medium">Files Link</p>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono truncate flex-1">
                                {variant.filesLink || "No files link available"}
                              </code>
                              {variant.filesLink && (
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleCopyFilesLink(variant.filesLink)}
                                    className="h-8 w-8 p-0"
                                    title="Copy link"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleOpenFilesLink(variant.filesLink)}
                                    className="h-8 w-8 p-0"
                                    title="Open link"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Details */}
                        {variant.additionalDetails && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-[#8E9196] mb-2 font-medium">Additional Details</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                              {variant.additionalDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#8E9196]">
                  <p>No variants yet for this product.</p>
                </div>
              )}
            </div>
          )}

          {/* Other product details */}
          {techStack && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm text-[#8E9196]">Tech Stack</p>
              <p className="text-sm font-medium">{techStack}</p>
            </div>
          )}

          {productIncludes && (
            <div className="space-y-2">
              <p className="text-sm text-[#8E9196]">Product Includes</p>
              <p className="text-sm font-medium">{productIncludes}</p>
            </div>
          )}

          {renderBadgeList(platform, "Platform")}
          {renderBadgeList(team, "Team")}
          {renderBadgeList(useCase, "Use Case")}
          {renderBadgeList(industries, "Industries")}
        </CardContent>
      </Card>

      <EditVariantDialog 
        variant={editingVariant} 
        isOpen={isEditDialogOpen} 
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingVariant(null);
        }} 
        onSave={handleSaveVariant} 
      />
    </>
  );
}
