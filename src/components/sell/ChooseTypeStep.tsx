
import React from "react";
import { Card } from "@/components/ui/card";
import { ShoppingBag, UserCog, Users } from "lucide-react";

interface ChooseTypeStepProps {
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

export function ChooseTypeStep({ selectedOption, onOptionSelect }: ChooseTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          What would you use Plaze for?
        </h1>
      </div>

      <div className="space-y-4">
        <Card
          className={`p-4 flex items-center border hover:border-primary cursor-pointer transition-all ${
            selectedOption === "services"
              ? "border-primary bg-gray-50"
              : "border-gray-200"
          }`}
          onClick={() => onOptionSelect("services")}
        >
          <div className="flex-1">
            <h3 className="font-medium mb-1">Sell my services</h3>
            <p className="text-sm text-gray-600">
              Offer consulting, support, or custom services to clients
            </p>
          </div>
          <div className="ml-4 p-2 rounded-full bg-blue-50 text-blue-600">
            <UserCog size={24} />
          </div>
        </Card>

        <Card
          className={`p-4 flex items-center border hover:border-primary cursor-pointer transition-all ${
            selectedOption === "products"
              ? "border-primary bg-gray-50"
              : "border-gray-200"
          }`}
          onClick={() => onOptionSelect("products")}
        >
          <div className="flex-1">
            <h3 className="font-medium mb-1">Sell my products</h3>
            <p className="text-sm text-gray-600">
              Sell digital products, templates, or code assets
            </p>
          </div>
          <div className="ml-4 p-2 rounded-full bg-green-50 text-green-600">
            <ShoppingBag size={24} />
          </div>
        </Card>

        <Card
          className={`p-4 flex items-center border hover:border-primary cursor-pointer transition-all ${
            selectedOption === "community"
              ? "border-primary bg-gray-50"
              : "border-gray-200"
          }`}
          onClick={() => onOptionSelect("community")}
        >
          <div className="flex-1">
            <h3 className="font-medium mb-1">Run my community</h3>
            <p className="text-sm text-gray-600">
              Create and manage a community around your expertise
            </p>
          </div>
          <div className="ml-4 p-2 rounded-full bg-purple-50 text-purple-600">
            <Users size={24} />
          </div>
        </Card>
      </div>
    </div>
  );
}
