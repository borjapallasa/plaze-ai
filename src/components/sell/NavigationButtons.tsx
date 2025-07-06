
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
        let userFirstName = '';
        let userLastName = '';
        
        if (user) {
          userId = user.id;
          console.log("Using authenticated user:", userId);
          
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('user_uuid', userId)
            .single();
          
          if (userData) {
            userFirstName = userData.first_name || '';
            userLastName = userData.last_name || '';
          }
        } else {
          const tempPassword = Math.random().toString(36).slice(-12);
          
          const { data: existingUserData } = await supabase
            .from('users')
            .select('user_uuid, first_name, last_name')
            .ilike('email', emailToUse)
            .maybeSingle();
          
          if (existingUserData) {
            userId = existingUserData.user_uuid;
            userFirstName = existingUserData.first_name || '';
            userLastName = existingUserData.last_name || '';
            console.log("Found existing user:", userId);
            
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
            userFirstName = formData.firstName;
            userLastName = formData.lastName;
            
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
        
        // Create expert profile - this was the missing piece
        const expertName = `${userFirstName} ${userLastName}`.trim();
        console.log("Creating expert with name:", expertName, "for user:", userId);
        
        // Check if expert already exists first
        const { data: existingExpert } = await supabase
          .from('experts')
          .select('expert_uuid')
          .eq('user_uuid', userId)
          .maybeSingle();

        if (!existingExpert) {
          console.log("No existing expert found, creating new expert profile");
          
          const { data: expertData, error: expertError } = await supabase
            .from('experts')
            .insert({
              user_uuid: userId,
              email: emailToUse,
              name: expertName,
              description: `Expert specializing in ${selectedOption}`,
              areas: [selectedOption],
              status: 'in review'
            })
            .select('expert_uuid')
            .single();

          if (expertError) {
            console.error("Expert creation error:", expertError);
            throw new Error(`Error creating expert profile: ${expertError.message}`);
          } else {
            console.log("Successfully created expert profile:", expertData?.expert_uuid);
          }
        } else {
          console.log("Expert profile already exists:", existingExpert.expert_uuid);
        }

        // Update user to be an expert if this is a new user
        if (isNewUser) {
          const { error: updateUserError } = await supabase
            .from('users')
            .update({ is_expert: true })
            .eq('user_uuid', userId);

          if (updateUserError) {
            console.error("Error updating user is_expert:", updateUserError);
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
          
          toast.success("Account created! Expert profile created successfully. A magic link has been sent to your email for future logins");
        } else {
          toast.success("Expert profile setup completed!");
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
