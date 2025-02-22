
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function ProductPricing() {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
            <Input 
              id="price" 
              type="number" 
              className="pl-7" 
              defaultValue="39.95"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="compare-price">Compare-at price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
            <Input 
              id="compare-price" 
              type="number" 
              className="pl-7" 
              defaultValue="52.86"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="tax" defaultChecked />
        <Label htmlFor="tax">Charge tax on this product</Label>
      </div>
    </div>
  );
}
