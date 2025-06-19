
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersErrorStateProps {
  onRetry?: () => void;
}

export function UsersErrorState({ onRetry }: UsersErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <h3 className="text-lg font-semibold text-[#1A1F2C]">Error loading users</h3>
      <p className="text-[#8E9196] text-center max-w-md">
        There was an error loading the users. Please try again or contact support if the issue persists.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
