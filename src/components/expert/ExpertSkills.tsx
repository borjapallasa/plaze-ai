
import { Card, CardContent } from "@/components/ui/card";
import type { ExpertComponentProps } from "./types";

export const ExpertSkills = ({ expert }: ExpertComponentProps) => {
  return (
    <Card className="col-span-4">
      <CardContent className="p-6 space-y-6">
        <p className="text-muted-foreground">
          {expert.description || "Senior UX Designer with a passion for creating intuitive and engaging digital experiences. Combining analytical thinking with creative design to solve complex user problems."}
        </p>
        <ul className="space-y-2 text-muted-foreground">
          {expert.areas?.map((area, index) => (
            <li key={index} className="flex items-center gap-2 leading-normal">
              <span className="flex-shrink-0">🎯</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
