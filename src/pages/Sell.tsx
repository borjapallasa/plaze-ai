
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  UserCog, 
  Users,
  Home
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SellPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === "services") {
      navigate("/seller/services/new");
    } else if (selectedOption === "products") {
      navigate("/seller/products/new");
    } else if (selectedOption === "community") {
      navigate("/seller/communities/new");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center">
          <Home className="h-6 w-6" />
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-sm">
            Questions?
          </Button>
          <Button variant="outline" className="text-sm">
            Save & exit
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-3xl mx-auto w-full">
        <div className="w-full space-y-8">
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
              onClick={() => handleOptionSelect("services")}
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
              onClick={() => handleOptionSelect("products")}
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
              onClick={() => handleOptionSelect("community")}
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
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 border-t bg-white">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedOption}
          >
            Next
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SellPage;
