import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5 flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-muted-foreground">{item}</span>
            </div>)}
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
    </div>;
}