
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="text-center max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="text-primary">Thanks</span> for your{" "}
          <span className="text-primary">purchase!</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Your new template is already available to download in your purchases section. We hope you enjoy it!
        </p>

        <Link to="/personal-area">
          <Button 
            size="lg" 
            className="mt-8 text-lg px-8 py-6 h-auto rounded-full bg-black hover:bg-black/90"
          >
            Go To My Purchases
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
