import React from "react";
import { Link } from "react-router-dom";
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
  return <div className="w-full max-w-[1400px] mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 mb-8">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {backLink && <Link to={backLink}>
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 mt-1 hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>}
        <div className="w-full">
          
          <div className="flex items-center justify-between mt-4">
            {subtitle}
            {action && <div>{action}</div>}
          </div>
        </div>
      </div>
    </div>;
}