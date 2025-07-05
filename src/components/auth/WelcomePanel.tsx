
import React from "react";

export function WelcomePanel() {
  return (
    <div className="text-center space-y-8">
      {/* Hide logo on mobile since it's already shown in the mobile header */}
      <div className="hidden lg:flex items-center justify-center gap-3">
        <img 
          src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" 
          alt="plaze.ai" 
          className="h-12 w-auto"
        />
        <h1 className="text-4xl font-bold text-foreground">plaze.ai</h1>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Welcome to plaze.ai
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Discover amazing products, connect with experts, and join thriving communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">Discover Products</h3>
            <p className="text-sm text-muted-foreground">
              Find digital products and services from verified creators
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">Connect with Experts</h3>
            <p className="text-sm text-muted-foreground">
              Get help from experienced professionals in your field
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">Join Communities</h3>
            <p className="text-sm text-muted-foreground">
              Be part of communities that share your interests and goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
