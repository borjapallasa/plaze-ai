
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export function WelcomePanel() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" 
          alt="plaze.ai" 
          className="h-8 w-auto"
        />
        <h1 className="text-2xl font-bold text-foreground">plaze.ai</h1>
      </div>
      
      <p className="text-muted-foreground leading-relaxed">
        Explore premium content, connect with experts, and join communities built around what you love.
      </p>

      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Join thousands using Plaze to:</h2>
        <div className="space-y-3">
          {[
            "Discover expert-made digital products",
            "Join private communities around your passions", 
            "Access exclusive content and member-only perks",
            "Learn from creators through workshops and templates"
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="relative w-5 h-5 mt-0.5 flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  {/* Incomplete circle - arc that leaves space for the check */}
                  <path
                    d="M10 2 A8 8 0 1 1 6 16"
                    stroke="#22c55e"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                <Check className="absolute inset-0 w-4 h-4 text-green-500 translate-x-0.5 translate-y-0.5" />
              </div>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Card className="bg-muted/50 border-muted">
        <div className="p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Are you a creator?</h3>
            <p className="text-sm text-muted-foreground">The Operative System for Digital Creators.</p>
          </div>
          <Link to="/sell">
            <Button variant="ghost" className="mt-4 p-0 h-auto font-medium text-foreground hover:text-primary">
              Sell on Plaze →
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
