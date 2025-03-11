
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
    serviceType: ServiceType;
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
        
        // Step 1: Check if user exists first
        const { data: existingUser } = await supabase
          .from('users')
          .select('user_uuid')
          .eq('email', formData.contactEmail)
          .maybeSingle();

        let userId;
        
        if (existingUser) {
          console.log("User already exists, using existing user", existingUser);
          userId = existingUser.user_uuid;
          
          // Sign in with the existing user
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: formData.contactEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/seller/dashboard`,
            },
          });
          
          if (signInError) {
            console.error("Sign in error:", signInError);
            throw new Error(`Failed to sign in: ${signInError.message}`);
          }
        } else {
          // Create new user
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
            console.error("Sign up error:", signUpError);
            throw new Error(`Failed to create account: ${signUpError.message}`);
          }
          
          if (!authData.user) {
            throw new Error("Failed to create user account");
          }
          
          userId = authData.user.id;
          
          // Sign in with the created user to get a valid session for RLS
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.contactEmail,
            password: tempPassword,
          });

          if (signInError) {
            console.error("Sign in error:", signInError);
            throw new Error(`Failed to sign in: ${signInError.message}`);
          }
        }
        
        // Step 2: Try to get existing expert profile
        const { data: existingExpert } = await supabase
          .from('experts')
          .select('expert_uuid')
          .eq('user_uuid', userId)
          .maybeSingle();
          
        let expertId;
        
        if (existingExpert) {
          console.log("Expert profile already exists", existingExpert);
          expertId = existingExpert.expert_uuid;
        } else {
          // Create expert record with public access
          // Using upsert to handle potential race conditions
          const { data: expertData, error: expertError } = await supabase
            .from('experts')
            .upsert({
              user_uuid: userId,
              email: formData.contactEmail,
              name: formData.name,
              description: formData.description
            }, {
              onConflict: 'user_uuid'
            })
            .select()
            .single();

          if (expertError) {
            console.error("Expert creation error:", expertError);
            throw new Error(`Failed to create expert profile: ${expertError.message}`);
          }

          if (!expertData || !expertData.expert_uuid) {
            throw new Error("Failed to create expert profile - missing UUID");
          }
          
          expertId = expertData.expert_uuid;
        }

        // Step 3: Create the specific type of record based on selection
        if (selectedOption === "services") {
          // Ensure serviceType is one of the allowed enum values
          const serviceTypeValue = formData.serviceType === "one time" ? "one time" : "monthly";
          
          const { error: serviceError } = await supabase
            .from('services')
            .insert({
              user_uuid: userId,
              expert_uuid: expertId,
              name: formData.name,
              description: formData.description,
              price: parseFloat(formData.servicePrice),
              type: serviceTypeValue,
              main_category: { value: formData.category },
              status: 'draft'
            });

          if (serviceError) {
            console.error("Service creation error:", serviceError);
            throw new Error(`Failed to create service: ${serviceError.message}`);
          }
        } else if (selectedOption === "products") {
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
            console.error("Product creation error:", productError);
            throw new Error(`Failed to create product: ${productError.message}`);
          }
        } else if (selectedOption === "community") {
          // Explicitly cast the community type to the correct enum value
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
            console.error("Community creation error:", communityError);
            throw new Error(`Failed to create community: ${communityError.message}`);
          }
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
