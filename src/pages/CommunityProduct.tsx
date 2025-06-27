
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunityProductPage() {
  const { id } = useParams();

  // Fake data for the product
  const productData = {
    name: "NoCodeClick | AI Marketplace",
    description: "All about AI. The best templates, agencies, consultants & communities to learn.",
    newsletter: "Weekly AI newsletter 📧",
    joinTitle: "Join the marketplace!",
    options: [
      "For users",
      "For agencies, consultants and creators"
    ],
    templates: "Templates & Consultants 🚀"
  };

  const handleCheckout = () => {
    // Fake checkout functionality
    alert("Checkout functionality - this would normally process payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">ncc</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {productData.name}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {productData.description}
          </p>
        </div>

        {/* Newsletter Section */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {productData.newsletter}
          </h2>
          
          <Card className="bg-blue-600 border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg font-medium">
                  Weekly AI Newsletter
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Section */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {productData.joinTitle}
          </h2>
          
          <div className="space-y-3">
            {productData.options.map((option, index) => (
              <Card key={index} className="bg-blue-600 border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg font-medium">
                      {option}
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates Section */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {productData.templates}
          </h2>
        </div>

        {/* Checkout Button */}
        <div className="pt-6">
          <Button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-lg font-semibold"
          >
            Checkout Now
          </Button>
        </div>

        {/* Product ID for reference */}
        <div className="text-center text-sm text-gray-400 pt-4">
          Product ID: {id}
        </div>
      </div>
    </div>
  );
}
