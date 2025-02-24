
import { Loader2 } from "lucide-react";
import { MainHeader } from "@/components/MainHeader";

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container mx-auto px-4 pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    </div>
  );
}
