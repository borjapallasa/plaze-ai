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
  const { data: variants = [], isLoading, refetch } = useProductVariants(productUuid);
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
            <div className="space-y-2">
              <p className="text-sm text-[#8E9196]">Product Variants</p>
              {variants.length > 0 ? (
                <div className="space-y-3">
                  {variants.map((variant) => (
                    <div key={variant.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-2">{variant.name}</h4>
                          {variant.tags && variant.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {variant.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium">${variant.price}</p>
                            {variant.comparePrice && variant.comparePrice > variant.price && (
                              <p className="text-xs text-gray-500 line-through">${variant.comparePrice}</p>
                            )}
                          </div>
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

                      {/* Files Link Section */}
                      <div className="mt-3 p-3 bg-white rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#8E9196] mb-1">Files Link</p>
                            <p className="text-sm font-mono text-gray-700 truncate">
                              {variant.filesLink || "No files link available"}
                            </p>
                          </div>
                          {variant.filesLink && (
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyFilesLink(variant.filesLink)}
                                className="h-8 w-8 p-0"
                                title="Copy link"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
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
                        
                        {/* Additional Details */}
                        {variant.additionalDetails && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-[#8E9196] mb-1">Additional Details</p>
                            <p className="text-sm text-gray-700">
                              {variant.additionalDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8E9196]">No variants yet for this product.</p>
              )}
            </div>
          )}

          {techStack && (
            <div className="space-y-2">
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
