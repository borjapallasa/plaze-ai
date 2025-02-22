
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";

const ThankYou = () => {
  return (
    <>
      <MainHeader />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-4">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-primary">Thanks</span> for your{" "}
            <span className="text-primary">purchase!</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground">
            Your new product is already available to download in your transactions section. We hope you enjoy it!
          </p>

          <Link to="/personal-area">
            <Button 
              size="lg" 
              className="mt-4"
            >
              Go To My Transactions
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
