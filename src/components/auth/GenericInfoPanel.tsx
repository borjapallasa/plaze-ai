
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function GenericInfoPanel() {
  const features = [
    "Connect with expert communities",
    "Access premium products and services", 
    "Join exclusive learning experiences",
    "Build your professional network"
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
            Welcome to Plaze.ai
          </h1>
          <p className="text-xl text-gray-600">
            The platform connecting experts with their communities
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Join thousands of professionals who use Plaze.ai to:
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
          Ready to get started?
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          Create your account and start connecting with expert communities today.
        </p>
        <Button variant="outline" className="group">
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
