
import { Card } from "@/components/ui/card";

interface ProductInfoProps {
  description?: string;
  techStack?: string;
  productIncludes?: string;
  difficultyLevel?: string;
  className?: string;
}

export function ProductInfo({ description, techStack, productIncludes, difficultyLevel, className }: ProductInfoProps) {
  return (
    <div className={className}>
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Additional Information</h3>
        <div className="space-y-4">
          {techStack && (
            <div>
              <h4 className="font-medium mb-2">Tech Stack</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {techStack.split(',').map((tech, index) => (
                  <li key={index}>{tech.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {productIncludes && (
            <div>
              <h4 className="font-medium mb-2">What's Included</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {productIncludes}
              </div>
            </div>
          )}

          {difficultyLevel && (
            <div>
              <h4 className="font-medium mb-2">Difficulty Level</h4>
              <span className="text-sm text-muted-foreground">
                {difficultyLevel}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
