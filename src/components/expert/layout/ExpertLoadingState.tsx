
import { MainHeader } from "@/components/MainHeader";
import { Loader2 } from "lucide-react";

export const ExpertLoadingState = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    </div>
  );
};
