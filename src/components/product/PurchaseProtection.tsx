
import React from "react";
import { Handshake } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PurchaseProtectionProps {
  className?: string;
}

export function PurchaseProtection({ className = "" }: PurchaseProtectionProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Handshake className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1 text-sm">
            Plaze Purchase Protection
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Shop confidently on Plaze knowing if something goes wrong with an order, we've got your back for all eligible purchases — <span className="underline cursor-pointer hover:text-foreground font-medium">see program terms</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
