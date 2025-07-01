
import React from 'react';
import { Button } from '@/components/ui/button';

export interface ServiceFormProps {
  isLoading?: boolean;
  submitButtonText?: string;
}

export function ServiceForm({ isLoading = false, submitButtonText = "Create Service" }: ServiceFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Service Form</h2>
        <p className="text-muted-foreground">Service creation functionality coming soon</p>
      </div>
      <Button disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : submitButtonText}
      </Button>
    </div>
  );
}
