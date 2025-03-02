
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface LoadMoreButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function LoadMoreButton({ onClick, visible }: LoadMoreButtonProps) {
  if (!visible) return null;
  
  return (
    <>
      <Separator className="my-6" />
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="gap-2 border-[#E5E7EB] text-[#1A1F2C] hover:bg-[#F8F9FC]"
          onClick={onClick}
        >
          See more <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
