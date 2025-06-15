
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TemplateDescriptionProps {
  description?: string;
}

export function TemplateDescription({ description }: TemplateDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description ? (
          description.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-[#1A1F2C] leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-[#8E9196]">No description available</p>
        )}
      </CardContent>
    </Card>
  );
}
