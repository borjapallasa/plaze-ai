
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TemplateHeroImageProps {
  thumbnail?: string;
  productName: string;
}

export function TemplateHeroImage({ thumbnail, productName }: TemplateHeroImageProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-[16/9] rounded-lg overflow-hidden bg-blue-600">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <FileText className="h-16 w-16" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
