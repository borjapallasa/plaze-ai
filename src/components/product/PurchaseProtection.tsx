
import React from "react";
import { Handshake } from "lucide-react";

interface PurchaseProtectionProps {
  className?: string;
}

export function PurchaseProtection({ className = "" }: PurchaseProtectionProps) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-gray-50 rounded-lg border ${className}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Handshake className="h-8 w-8 text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">
          Plaze Purchase Protection
        </h3>
        <p className="text-sm text-gray-600">
          Shop confidently on Plaze knowing if something goes wrong with an order, we've got your back for all eligible purchases — <span className="underline cursor-pointer hover:text-gray-800">see program terms</span>
        </p>
      </div>
    </div>
  );
}
