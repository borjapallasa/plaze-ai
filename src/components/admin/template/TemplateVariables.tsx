
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductVariants } from "@/hooks/use-product-variants";

interface TemplateVariablesProps {
  productUuid: string;
  techStack?: string;
  techStackPrice?: string;
  productIncludes?: string;
  platform?: any[];
  team?: any[];
  useCase?: any[];
  industries?: any[];
}

export function TemplateVariables({ 
  productUuid,
  techStack, 
  techStackPrice, 
  productIncludes,
  platform,
  team,
  useCase,
  industries
}: TemplateVariablesProps) {
  const { data: variants = [], isLoading } = useProductVariants(productUuid);

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
                    <div className="text-right">
                      <p className="text-sm font-medium">${variant.price}</p>
                      {variant.comparePrice && variant.comparePrice > variant.price && (
                        <p className="text-xs text-gray-500 line-through">${variant.comparePrice}</p>
                      )}
                    </div>
                  </div>
                  {variant.features && variant.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {variant.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
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
