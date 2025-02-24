
import { MainHeader } from "@/components/MainHeader";

export const ExpertNotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground">Expert not found</p>
        </div>
      </div>
    </div>
  );
};
