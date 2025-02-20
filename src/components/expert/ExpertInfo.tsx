
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export const ExpertInfo = () => {
  return (
    <Card className="col-span-1">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Info</h2>
        </div>
        <p className="text-muted-foreground">
          Expert in UI/UX design with over 10 years of experience. Specialized in creating
          intuitive and beautiful user interfaces for web and mobile applications.
        </p>
      </CardContent>
    </Card>
  );
};
