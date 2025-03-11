
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StepIndicator } from "@/components/sell/StepIndicator";

interface SellLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

export function SellLayout({ currentStep, children }: SellLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 md:p-6 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center">
          <Home className="h-6 w-6" />
        </Link>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-sm">
                Questions?
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about the onboarding process, please check our FAQ or contact support.
                </p>
                <Button variant="outline" className="w-full" onClick={() => window.open('mailto:support@plaze.com')}>
                  Contact Support
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="text-sm" onClick={() => navigate("/")}>
            Save & exit
          </Button>
        </div>
      </header>

      <div className="border-b">
        <div className="max-w-3xl mx-auto py-4 px-4 md:px-0">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
