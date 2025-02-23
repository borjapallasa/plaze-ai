
import { Card } from "@/components/ui/card";

interface ProductDemoProps {
  demo?: string;
}

export function ProductDemo({ demo }: ProductDemoProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Demo</h2>
      <Card className="p-6 mb-8">
        {demo ? (
          <div dangerouslySetInnerHTML={{ __html: demo }} />
        ) : (
          <div className="aspect-video bg-accent rounded-lg"></div>
        )}
      </Card>
    </>
  );
}
