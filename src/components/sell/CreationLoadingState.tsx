
import React from "react";
import { Loader2 } from "lucide-react";

interface CreationLoadingStateProps {
  selectedOption: string | null;
}

export function CreationLoadingState({ selectedOption }: CreationLoadingStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="space-y-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <div className="space-y-2">
          <p className="text-muted-foreground">✓ Creating your user account</p>
          <p className="text-muted-foreground">✓ Setting up your seller profile</p>
          <p className="text-muted-foreground">
            {selectedOption === "products" && "Creating your product listing..."}
            {selectedOption === "services" && "Creating your service listing..."}
            {selectedOption === "community" && "Creating your community..."}
          </p>
        </div>
      </div>
    </div>
  );
}
