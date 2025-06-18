
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DefaultHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  action?: React.ReactNode;
}

export function DefaultHeader({
  title,
  subtitle,
  backLink,
  action
}: DefaultHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1); // Go to previous page in history
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="flex items-center gap-2 rounded-full flex-shrink-0 h-8 sm:h-10 px-3 sm:px-4 mt-1 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Button>
        
        <div className="flex flex-col gap-1 flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
