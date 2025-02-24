
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
              <span className="flex-shrink-0">🎨</span>
              <span>{area}</span>
            </li>
          )) || (
            <>
              <li className="flex items-center gap-2 leading-normal">
                <span className="flex-shrink-0">🎨</span>
                <span>User Interface Design - Creating beautiful and functional interfaces that delight users</span>
              </li>
              <li className="flex items-center gap-2 leading-normal">
                <span className="flex-shrink-0">🔍</span>
                <span>User Research - Conducting in-depth research to understand user needs and behaviors</span>
              </li>
              <li className="flex items-center gap-2 leading-normal">
                <span className="flex-shrink-0">📊</span>
                <span>Information Architecture - Organizing content in a clear and logical manner</span>
              </li>
              <li className="flex items-center gap-2 leading-normal">
                <span className="flex-shrink-0">🤝</span>
                <span>Stakeholder Management - Collaborating effectively with cross-functional teams</span>
              </li>
              <li className="flex items-center gap-2 leading-normal">
                <span className="flex-shrink-0">📱</span>
                <span>Responsive Design - Creating seamless experiences across all devices</span>
              </li>
            </>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
