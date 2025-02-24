
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { ExpertComponentProps } from "./types";

export const ExpertStats = ({ expert }: ExpertComponentProps) => {
  return (
    <Card className="col-span-1">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Stats</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Projects Completed</p>
            <p className="text-2xl font-bold">{expert.completed_projects || "150+"}+</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            <p className="text-2xl font-bold">{expert.client_satisfaction || 98}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Response Rate</p>
            <p className="text-2xl font-bold">{expert.response_rate || 100}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
