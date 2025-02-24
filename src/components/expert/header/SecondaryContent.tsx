
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Share2, Save } from "lucide-react";
import type { ExpertComponentProps } from "../types";

const SecondaryContent = ({ expert }: ExpertComponentProps) => {
  return (
    <>
      <div className="flex flex-col sm:hidden items-start gap-2.5">
        <div className="flex items-center gap-2.5">
          <p className="text-lg text-muted-foreground">{expert.name || "John Doe"}</p>
          <div className="text-muted-foreground">•</div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-base text-muted-foreground">Expert since 2020</span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-base text-muted-foreground">Expert since 2020</span>
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Share2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Save className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecondaryContent;
