
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavigationButtonsProps {
  currentStep: number;
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    servicePrice: string;
    category: string;
    type: string;
    price: string;
    productPrice: string;
    thumbnail: string;
    contactEmail: string;
  };
  onNext: () => void;
  onBack: () => void;
}

export function NavigationButtons({ 
  currentStep, 
  selectedOption, 
  formData, 
  onNext, 
  onBack 
}: NavigationButtonsProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedOption) {
      return true;
    }
    
    if (currentStep === 2) {
      if (selectedOption === "products" && (!formData.name || !formData.description || !formData.productPrice)) {
        return true;
      }
      if (selectedOption === "services" && (!formData.name || !formData.description || !formData.servicePrice || !formData.category)) {
        return true;
      }
      if (selectedOption === "community" && (!formData.name || !formData.description || (formData.type === "paid" && !formData.price))) {
        return true;
      }
    }

    if (currentStep === 3 && !formData.contactEmail) {
      return true;
    }
    
    return false;
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Final step - handle authentication before proceeding
      if (!formData.contactEmail) {
        toast.error("Please provide an email address");
        return;
      }

      setIsAuthenticating(true);
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('user_uuid')
          .eq('email', formData.contactEmail)
          .single();

        if (existingUser) {
          // User exists, send magic link
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: formData.contactEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/seller/dashboard`,
            },
          });

          if (signInError) throw signInError;
          toast.success("Magic link sent to your email for future logins");
        } else {
          // New user, sign them up and log them in immediately
          // Generate a random password for immediate login
          const tempPassword = Math.random().toString(36).slice(-12);
          
          const { error: signUpError, data } = await supabase.auth.signUp({
            email: formData.contactEmail,
            password: tempPassword,
            options: {
              data: {
                seller_type: selectedOption,
              },
            }
          });

          if (signUpError) throw signUpError;
          
          // Also send a magic link for future logins
          await supabase.auth.signInWithOtp({
            email: formData.contactEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/seller/dashboard`,
            },
          });
          
          toast.success("Account created! A magic link has been sent to your email for future logins");
        }
        
        // Proceed to next step (which will navigate based on seller type)
        onNext();
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Failed to authenticate. Please try again.");
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      // For other steps, just proceed normally
      onNext();
    }
  };

  return (
    <div className="flex justify-between pt-6">
      <Button
        onClick={onBack}
        variant="outline"
        className="flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Button
        onClick={handleNext}
        disabled={isNextDisabled() || isAuthenticating}
        className="flex items-center gap-1"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Authenticating...
          </>
        ) : (
          <>
            {currentStep === 3 ? "Submit" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
