
import React from "react";
import { Handshake } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PurchaseProtectionProps {
  className?: string;
}

export function PurchaseProtection({ className = "" }: PurchaseProtectionProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Subtle blue left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/20"></div>
      
      {/* Light blue background tint */}
      <div className="absolute inset-0 bg-blue-50/30"></div>
      
      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {/* Enhanced icon with subtle background */}
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100/60 rounded-full">
              <Handshake className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1.5 text-sm">
              Plaze Purchase Protection
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shop confidently on Plaze knowing if something goes wrong with an order, we've got your back for all eligible purchases — <span className="underline cursor-pointer hover:text-foreground font-medium text-blue-700 hover:text-blue-800 transition-colors">see program terms</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
