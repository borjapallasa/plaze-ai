
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreationLoadingState } from "./CreationLoadingState";

interface NavigationButtonsProps {
  currentStep: number;
  selectedOption: string | null;
  formData: {
    name: string;
    description: string;
    type: string;
    price: string;
    productPrice: string;
    thumbnail: string;
    contactEmail: string;
    captchaConfirmed: boolean;
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
      if (selectedOption === "community" && (!formData.name || !formData.description || (formData.type === "paid" && !formData.price))) {
        return true;
      }
    }

    if (currentStep === 3 && (!formData.contactEmail || !formData.captchaConfirmed)) {
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

      if (!formData.captchaConfirmed) {
        toast.error("Please confirm that you are not a robot");
        return;
      }

      setIsAuthenticating(true);
      setIsCreating(true);
      
      try {
        const tempPassword = Math.random().toString(36).slice(-12);
        
        // First, try to create or authenticate the user
        let userId;
        let isNewUser = false;
        
        // Check if user exists
        const { data: existingUserData } = await supabase
          .from('users')
          .select('user_uuid')
          .eq('email', formData.contactEmail)
          .maybeSingle();
        
        if (existingUserData) {
          // User exists, get the UUID
          userId = existingUserData.user_uuid;
          console.log("Found existing user:", userId);
          
          // Send a magic link for authentication
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: formData.contactEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/seller/dashboard`,
            },
          });
          
          if (signInError) {
            throw new Error(`Failed to sign in: ${signInError.message}`);
          }
        } else {
          // Create new user in Auth
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: formData.contactEmail,
            password: tempPassword,
            options: {
              data: {
                seller_type: selectedOption,
              },
            }
          });

          if (signUpError) {
            throw new Error(`Failed to create account: ${signUpError.message}`);
          }
          
          if (!authData.user) {
            throw new Error("Failed to create user account");
          }
          
          userId = authData.user.id;
          isNewUser = true;
          console.log("Created new user:", userId);
          
          // Sign in immediately to get a valid session
          const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
            email: formData.contactEmail,
            password: tempPassword,
          });
          
          if (sessionError) {
            throw new Error(`Failed to sign in after account creation: ${sessionError.message}`);
          }
          
          if (!sessionData.session) {
            throw new Error("No valid session after sign in");
          }
        }
        
        // Check if expert profile exists
        let expertId;
        let expertExists = false;
        
        const { data: existingExpertData } = await supabase
          .from('experts')
          .select('expert_uuid')
          .eq('user_uuid', userId)
          .maybeSingle();
          
        if (existingExpertData) {
          expertId = existingExpertData.expert_uuid;
          expertExists = true;
          console.log("Found existing expert profile:", expertId);
        }
        
        // If expert doesn't exist, create it
        if (!expertExists) {
          console.log("Creating new expert profile for user:", userId);
          
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) {
            throw new Error("No active session to create expert profile");
          }
          
          // Now attempt to create the expert with the user's session
          const { data: expertData, error: expertError } = await supabase
            .from('experts')
            .insert({
              user_uuid: userId,
              email: formData.contactEmail,
              name: formData.name,
              description: formData.description,
              areas: [] // Initialize with empty areas array
            })
            .select('expert_uuid')
            .single();

          if (expertError) {
            console.error("Expert creation error:", expertError);
            throw new Error(`Error creating expert profile. Please contact support: ${expertError.message}`);
          }

          if (!expertData) {
            throw new Error("Failed to create expert profile - no data returned");
          }
          
          expertId = expertData.expert_uuid;
          console.log("Created new expert profile:", expertId);
        }

        // Create the appropriate resource based on selection
        if (selectedOption === "products") {
          const { error: productError } = await supabase
            .from('products')
            .insert({
              user_uuid: userId,
              expert_uuid: expertId,
              name: formData.name,
              description: formData.description,
              price_from: parseFloat(formData.productPrice),
              status: 'draft'
            });

          if (productError) {
            throw new Error(`Failed to create product: ${productError.message}`);
          }
        } else if (selectedOption === "community") {
          const communityType = formData.type === "paid" ? "paid" : "free";
          
          const { error: communityError } = await supabase
            .from('communities')
            .insert({
              user_uuid: userId,
              expert_uuid: expertId,
              name: formData.name,
              description: formData.description,
              intro: formData.description,
              type: communityType as "free" | "paid",
              price: formData.type === 'paid' ? parseFloat(formData.price) : 0,
              visibility: 'draft'
            });

          if (communityError) {
            throw new Error(`Failed to create community: ${communityError.message}`);
          }
        }

        // Always send a magic link for future logins
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
        toast.error(error instanceof Error ? error.message : "Failed to create account. Please try again.");
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
