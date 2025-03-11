
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
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
  );
}
