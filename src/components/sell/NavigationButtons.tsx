
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreationLoadingState } from "./CreationLoadingState";
import { useAuth } from "@/lib/auth";

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
    firstName: string;
    lastName: string;
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
  const { user } = useAuth();

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

    if (currentStep === 3) {
      // If user is authenticated, only check captcha. If not authenticated, check names, email and captcha
      if (user) {
        return !formData.captchaConfirmed;
      } else {
        return !formData.contactEmail || !formData.firstName || !formData.lastName || !formData.captchaConfirmed;
      }
    }
    
    return false;
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Use authenticated user's email or the provided email
      const emailToUse = user?.email || formData.contactEmail;
      
      if (!emailToUse) {
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
        let userId;
        let isNewUser = false;
        
        if (user) {
          // User is already authenticated, use their ID
          userId = user.id;
          console.log("Using authenticated user:", userId);
        } else {
          // User is not authenticated, create new account
          const tempPassword = Math.random().toString(36).slice(-12);
          
          // Check if user exists
          const { data: existingUserData } = await supabase
            .from('users')
            .select('user_uuid')
            .eq('email', emailToUse)
            .maybeSingle();
          
          if (existingUserData) {
            // User exists, get the UUID
            userId = existingUserData.user_uuid;
            console.log("Found existing user:", userId);
            
            // Send a magic link for authentication
            const { error: signInError } = await supabase.auth.signInWithOtp({
              email: emailToUse,
              options: {
                emailRedirectTo: `${window.location.origin}/seller/dashboard`,
              },
            });
            
            if (signInError) {
              throw new Error(`Failed to sign in: ${signInError.message}`);
            }
          } else {
            // Create new user in Auth with first name and last name
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
              email: emailToUse,
              password: tempPassword,
              options: {
                data: {
                  first_name: formData.firstName,
                  last_name: formData.lastName,
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
              email: emailToUse,
              password: tempPassword,
            });
            
            if (sessionError) {
              throw new Error(`Failed to sign in after account creation: ${sessionError.message}`);
            }
            
            if (!sessionData.session) {
              throw new Error("No valid session after sign in");
            }
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
          if (!session.session && !user) {
            throw new Error("No active session to create expert profile");
          }
          
          // Update the users table to set is_expert as true if this is a new user
          if (isNewUser) {
            const { error: updateUserError } = await supabase
              .from('users')
              .update({ is_expert: true })
              .eq('user_uuid', userId);

            if (updateUserError) {
              console.error("Error updating user is_expert:", updateUserError);
              // Don't throw error, just log it as this is not critical for the flow
            }
          }
          
          // Now attempt to create the expert with the user's session
          const { data: expertData, error: expertError } = await supabase
            .from('experts')
            .insert({
              user_uuid: userId,
              email: emailToUse,
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

        // Send magic link for future logins only if user wasn't already authenticated
        if (!user) {
          await supabase.auth.signInWithOtp({
            email: emailToUse,
            options: {
              emailRedirectTo: `${window.location.origin}/seller/dashboard`,
            },
          });
          
          toast.success("Account created! A magic link has been sent to your email for future logins");
        } else {
          toast.success(`${selectedOption === 'products' ? 'Product' : 'Community'} created successfully!`);
        }
        
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
            {user ? "Creating..." : "Authenticating..."}
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
