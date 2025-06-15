import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductVariants } from "@/hooks/use-product-variants";
import { Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
  const { data: variants = [], isLoading } = useProductVariants(productUuid);

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

  const handleEditVariant = (variantId: string) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon");
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Variants */}
        {!isLoading && variants.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-[#8E9196]">Product Variants</p>
            <div className="space-y-3">
              {variants.map((variant) => (
                <div key={variant.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{variant.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-right">
                        <p className="text-sm font-medium">${variant.price}</p>
                        {variant.comparePrice && variant.comparePrice > variant.price && (
                          <p className="text-xs text-gray-500 line-through">${variant.comparePrice}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVariant(variant.id)}
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
                  
                  {variant.features && variant.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                      {variant.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}

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
  );
}
