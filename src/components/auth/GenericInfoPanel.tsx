
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function GenericInfoPanel() {
  const features = [
    "Launch expert-led communities in minutes",
    "Sell premium digital products with built-in upsells & affiliate tools", 
    "Unlock new revenue through partner collaborations",
    "Share knowledge with members through gated content",
    "Scale without the tech hassle"
  ];

  return (
    <div className="space-y-8">
      {/* Logo and Title */}
      <div className="space-y-4">
        <img 
          src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" 
          alt="Plaze.ai" 
          className="h-12 w-auto"
        />
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Plaze
          </h1>
          <p className="text-xl text-gray-600">
            The all-in-one platform where experts build communities, sell digital products, and grow faster together.
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Join thousands of creators, educators, and professionals using Plaze to:
        </h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          Ready to build your creator business?
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          Sign up and start creating your community, product, or both — in just a few clicks.
        </p>
        <Button variant="outline" className="group">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
