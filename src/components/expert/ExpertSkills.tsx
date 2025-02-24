
import { Card, CardContent } from "@/components/ui/card";
import type { ExpertComponentProps } from "./types";

export const ExpertSkills = ({ expert }: ExpertComponentProps) => {
  if (!expert.description) {
    return null;
  }

  return (
    <Card className="col-span-4">
      <CardContent className="py-6">
        <p className="text-muted-foreground">
          {expert.description}
        </p>
      </CardContent>
    </Card>
  );
};
