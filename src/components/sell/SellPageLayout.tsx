
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SellPageLayoutProps {
  currentStep: number;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled: boolean;
  isFinalStep: boolean;
}

export const SellPageLayout = ({
  currentStep,
  children,
  onNext,
  onBack,
  isNextDisabled,
  isFinalStep
}: SellPageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
          <Button variant="outline" className="text-sm" onClick={() => window.location.href = "/"}>
            Save & exit
          </Button>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="border-b">
        <div className="max-w-3xl mx-auto py-4 px-4 md:px-0">
          <div className="flex items-center justify-between">
            <Tabs value={currentStep.toString()} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger 
                  value="1" 
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                  disabled
                >
                  Choose Type
                </TabsTrigger>
                <TabsTrigger 
                  value="2" 
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                  disabled
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger 
                  value="3" 
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                  disabled
                >
                  Confirmation
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-3xl mx-auto w-full">
        <div className="w-full space-y-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 border-t bg-white">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={onNext} 
            disabled={isNextDisabled}
          >
            {isFinalStep ? "Continue" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};
