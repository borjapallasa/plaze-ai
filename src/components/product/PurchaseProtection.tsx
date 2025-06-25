
import React from "react";
import { Handshake } from "lucide-react";

interface PurchaseProtectionProps {
  className?: string;
}

export function PurchaseProtection({ className = "" }: PurchaseProtectionProps) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Handshake className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Plaze Purchase Protection
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Shop confidently on Plaze knowing if something goes wrong with an order, we've got your back for all eligible purchases — <span className="underline cursor-pointer hover:text-gray-800">see program terms</span>
          </p>
        </div>
      </div>
    </div>
  );
}
