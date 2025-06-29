
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CircleCheckBig } from "lucide-react";

export function WelcomePanel() {
  return <div className="space-y-8">
      <div className="flex items-center gap-3">
        <img src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" alt="plaze.ai" className="h-8 w-auto" />
        
      </div>
      
      <p className="text-muted-foreground leading-relaxed">
        Explore premium content, connect with experts, and join communities built around what you love.
      </p>

      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Join thousands using Plaze to:</h2>
        <div className="space-y-3">
          {["Discover expert-made digital products", "Join private communities around your passions", "Access exclusive content and member-only perks", "Learn from creators through workshops and templates"].map((item, index) => <div key={index} className="flex items-start gap-3">
              <CircleCheckBig className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </div>)}
        </div>
      </div>

      <Card className="border-muted" style={{ backgroundColor: '#EEF2FF' }}>
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
    </div>;
}
