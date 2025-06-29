import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
export function GenericInfoPanel() {
  const navigate = useNavigate();
  const features = ["Discover expert-made digital products", "Join private communities around your passions", "Access exclusive content and member-only perks", "Learn from creators through workshops and templates"];
  const handleSellOnPlaze = () => {
    navigate("/sell");
  };
  return <div className="space-y-8">
      {/* Logo and Title */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            
            <img src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" alt="Plaze.ai" className="h-10 w-auto" />
          </div>
          
        </div>
      </div>

      {/* Subheading */}
      <div className="space-y-4">
        <p className="text-lg text-gray-700">
          Explore premium content, connect with experts, and join communities built around what you love.
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Join thousands using Plaze to:
        </h3>
        <ul className="space-y-3">
          {features.map((feature, index) => <li key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>)}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          Are you a creator?
        </h4>
        <p className="text-gray-600 text-sm mb-4">
          The Operative System for Digital Creators.
        </p>
        <Button variant="outline" className="group mb-4" onClick={handleSellOnPlaze}>
          Sell on Plaze
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {/* Soft Seller CTA */}
        
      </div>
    </div>;
}