
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TemplateVariablesProps {
  techStack?: string;
  techStackPrice?: string;
  productIncludes?: string;
  platform?: any[];
  team?: any[];
  useCase?: any[];
  industries?: any[];
}

export function TemplateVariables({ 
  techStack, 
  techStackPrice, 
  productIncludes,
  platform,
  team,
  useCase,
  industries
}: TemplateVariablesProps) {
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
        {techStack && (
          <div className="space-y-2">
            <p className="text-sm text-[#8E9196]">Tech Stack</p>
            <p className="text-sm font-medium">{techStack}</p>
          </div>
        )}

        {techStackPrice && (
          <div className="space-y-2">
            <p className="text-sm text-[#8E9196]">Tech Stack Price</p>
            <p className="text-sm font-medium">${techStackPrice}</p>
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
