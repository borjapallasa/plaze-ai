
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreationLoadingState } from "./CreationLoadingState";
import { ServiceType } from "@/constants/service-categories";

interface NavigationButtonsProps {
  currentStep: number;
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    servicePrice: string;
    serviceType: ServiceType; // Fixed: Changed from optional to required with correct type
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
  const [isCreating, setIsCreating] = useState(false);

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
      if (!formData.contactEmail) {
        toast.error("Please provide an email address");
        return;
      }

      setIsAuthenticating(true);
      setIsCreating(true);
      try {
        // Generate a random password for immediate login
        const tempPassword = Math.random().toString(36).slice(-12);
        
        // Step 1: Create authentication user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.contactEmail,
          password: tempPassword,
          options: {
            data: {
              seller_type: selectedOption,
            },
          }
        });

        if (signUpError) throw signUpError;
        
        if (!authData.user) throw new Error("Failed to create user");

        // Step 2: Users table entry is automatically created via trigger
        
        // Step 3: Create expert record
        const { data: expertData, error: expertError } = await supabase
          .from('experts')
          .insert({
            user_uuid: authData.user.id,
            email: formData.contactEmail,
            name: formData.name,
            description: formData.description
          })
          .select()
          .single();

        if (expertError) throw expertError;

        // Step 4: Create the specific type of record
        if (selectedOption === "services") {
          // Ensure serviceType is one of the allowed enum values
          const serviceTypeValue = formData.serviceType === "one time" ? "one time" : "monthly";
          
          const { error: serviceError } = await supabase
            .from('services')
            .insert({
              user_uuid: authData.user.id,
              expert_uuid: expertData.expert_uuid,
              name: formData.name,
              description: formData.description,
              price: parseFloat(formData.servicePrice),
              type: serviceTypeValue, // Using properly typed value
              main_category: { value: formData.category },
              status: 'draft'
            });

          if (serviceError) throw serviceError;
        } else if (selectedOption === "products") {
          const { error: productError } = await supabase
            .from('products')
            .insert({
              user_uuid: authData.user.id,
              expert_uuid: expertData.expert_uuid,
              name: formData.name,
              description: formData.description,
              price_from: parseFloat(formData.productPrice),
              status: 'draft'
            });

          if (productError) throw productError;
        } else if (selectedOption === "community") {
          // Explicitly cast the community type to the correct enum value
          const communityType = formData.type === "paid" ? "paid" : "free";
          
          const { error: communityError } = await supabase
            .from('communities')
            .insert({
              user_uuid: authData.user.id,
              expert_uuid: expertData.expert_uuid,
              name: formData.name,
              description: formData.description,
              intro: formData.description,
              type: communityType as "free" | "paid", // Explicit type assertion
              price: formData.type === 'paid' ? parseFloat(formData.price) : 0,
              visibility: 'draft'
            });

          if (communityError) throw communityError;
        }

        // Send magic link for future logins
        await supabase.auth.signInWithOtp({
          email: formData.contactEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/seller/dashboard`,
          },
        });
        
        toast.success("Account created! A magic link has been sent to your email for future logins");
        onNext();
      } catch (error) {
        console.error("Creation error:", error);
        toast.error("Failed to create account. Please try again.");
      } finally {
        setIsAuthenticating(false);
        setIsCreating(false);
      }
    } else {
      onNext();
    }
  };

  if (isCreating) {
    return <CreationLoadingState selectedOption={selectedOption} />;
  }

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
