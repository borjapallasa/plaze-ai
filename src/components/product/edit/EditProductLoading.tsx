
import { MainHeader } from "@/components/MainHeader";
import { Loader2 } from "lucide-react";

export const EditProductLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="mt-16 p-6 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    </div>
  );
};
