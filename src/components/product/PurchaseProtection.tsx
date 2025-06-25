
import React from "react";
import { Handshake } from "lucide-react";

interface PurchaseProtectionProps {
  className?: string;
}

export function PurchaseProtection({ className = "" }: PurchaseProtectionProps) {
  return (
    <div className={`flex items-start gap-2.5 p-3 bg-white rounded-lg border border-green-200 shadow-sm ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Handshake className="h-5 w-5 text-green-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-green-900 mb-0.5 text-sm">
          Plaze Purchase Protection
        </h3>
        <p className="text-xs text-green-700 leading-relaxed">
          Shop confidently on Plaze knowing if something goes wrong with an order, we've got your back for all eligible purchases — <span className="underline cursor-pointer hover:text-green-800 font-medium">see program terms</span>
        </p>
      </div>
    </div>
  );
}
