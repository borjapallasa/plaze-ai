
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { LoadingState } from "@/components/community/signin/LoadingState";
import { NotFoundState } from "@/components/community/signin/NotFoundState";
import { CommunitySubscriptionCheckout } from "@/components/checkout/CommunitySubscriptionCheckout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchCommunity(communityId: string) {
  const { data, error } = await supabase
    .from('communities')
    .select(`
      *,
      expert:expert_uuid(
        name,
        thumbnail
      )
    `)
    .eq('community_uuid', communityId)
    .single();

  if (error) throw error;
  return data;
}

export default function SignUpCommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [userCreated, setUserCreated] = useState<{id: string; email: string} | null>(null);

  const { data: community, isLoading, error } = useQuery({
    queryKey: ['community', id],
    queryFn: () => fetchCommunity(id!),
    enabled: !!id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (!community || !id) {
      toast.error("Community not found");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting sign up process for community:", id);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/community/${id}`,
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        
        // Handle case where user already exists
        if (authError.message?.includes('already registered') || 
            authError.message?.includes('already been registered') ||
            authError.message?.includes('User already registered')) {
          
          // Try to sign in the existing user instead
          console.log("User already exists, attempting to sign in...");
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            // Check if it's an email confirmation error
            if (signInError.message?.includes('email_not_confirmed') || 
                signInError.message?.includes('Email not confirmed') ||
                signInError.message?.includes('confirm your email')) {
              toast.error(
                <div>
                  <p className="font-medium mb-2">Please confirm your email address</p>
                  <p className="text-sm mb-3">We've sent a confirmation link to <strong>{email}</strong></p>
                  <p className="text-sm mb-3">Check your email and click the confirmation link to activate your account.</p>
                  <button 
                    onClick={() => resendConfirmationEmail(email)} 
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Resend confirmation email
                  </button>
                </div>,
                { duration: 15000 }
              );
            } else {
              toast.error(
                <div>
                  <p>An account with this email already exists.</p>
                  <p>Please <a href="/sign-in" className="underline text-blue-600">log in</a> and try joining the community again.</p>
                </div>,
                { duration: 8000 }
              );
            }
            return;
          }

          // If sign in successful, continue with subscription creation
          if (signInData.user) {
            console.log("Successfully signed in existing user:", signInData.user.id);
            
            // Check if user is already a member of this community
            const { data: existingSubscription } = await supabase
              .from('community_subscriptions')
              .select('status')
              .eq('user_uuid', signInData.user.id)
              .eq('community_uuid', id)
              .maybeSingle();

            if (existingSubscription) {
              toast.success("You're already a member of this community!");
              navigate(`/community/${id}`);
              return;
            }

            // Continue with the rest of the flow using signInData instead of authData
            const authData = signInData;
            
            // Create subscription for existing user (copy the logic from below)
            let subscriptionStatus: 'active' | 'inactive' | 'pending';
            
            if (community.type === 'private') {
              subscriptionStatus = 'pending';
            } else {
              subscriptionStatus = (community.price && community.price > 0 ? 'pending' : 'active') as 'active' | 'inactive' | 'pending';
            }

            const subscriptionData = {
              user_uuid: authData.user.id,
              community_uuid: id,
              expert_uuid: community.expert_uuid,
              email: email,
              status: subscriptionStatus,
              type: (community.price && community.price > 0 ? 'paid' : 'free') as 'free' | 'paid',
              amount: community.price || 0,
            };

            const { data: subscriptionResult, error: subscriptionError } = await supabase
              .from('community_subscriptions')
              .insert(subscriptionData)
              .select()
              .single();

            if (subscriptionError) {
              console.error("Subscription error:", subscriptionError);
              toast.error("Failed to create community subscription. Please contact support.");
              return;
            }

            setUserCreated({ id: authData.user.id, email: email });

            if (community.type === 'private') {
              toast.success("Your join request has been submitted and is awaiting approval.");
              navigate(`/community/${id}`);
            } else if (community.price && community.price > 0) {
              toast.success("Please complete payment to access the community.");
              setShowPaymentCheckout(true);
            } else {
              toast.success("Welcome! You've successfully joined the community.");
              navigate(`/community/${id}`);
            }
            return;
          }
        } else if (authError.message?.includes('email_not_confirmed') || 
                   authError.message?.includes('Email not confirmed') ||
                   authError.message?.includes('confirm your email')) {
          // Handle email not confirmed error
          toast.error(
            <div>
              <p className="font-medium mb-2">Please confirm your email address</p>
              <p className="text-sm mb-3">We've sent a confirmation link to <strong>{email}</strong></p>
              <p className="text-sm mb-3">Check your email and click the confirmation link to activate your account.</p>
              <button 
                onClick={() => resendConfirmationEmail(email)} 
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Resend confirmation email
              </button>
            </div>,
            { duration: 15000 }
          );
          return;
        } else {
          toast.error(authError.message);
          return;
        }
      }

      if (!authData.user) {
        toast.error("Failed to create user account");
        return;
      }

      console.log("User created successfully:", authData.user.id);
      
      // If the user was created but not immediately logged in, sign them in
      if (!authData.session) {
        console.log("User created but not logged in, attempting to sign in...");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error("Auto sign-in failed:", signInError);
          
          // Check if it's an email confirmation error
          if (signInError.message?.includes('email_not_confirmed') || 
              signInError.message?.includes('Email not confirmed') ||
              signInError.message?.includes('confirm your email')) {
            toast.success(
              <div>
                <p className="font-medium mb-2">Account created successfully!</p>
                <p className="text-sm mb-3">Please check your email at <strong>{email}</strong> and click the confirmation link to activate your account.</p>
                <button 
                  onClick={() => resendConfirmationEmail(email)} 
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Resend confirmation email
                </button>
              </div>,
              { duration: 15000 }
            );
          } else {
            toast.error("Account created but failed to sign in. Please try signing in manually.");
          }
          return;
        }
        
        console.log("Auto sign-in successful:", signInData);
      }

      // Get the current authenticated user (in case of email confirmation flow)
      const { data: currentUser } = await supabase.auth.getUser();
      const actualUserId = currentUser.user?.id || authData.user.id;
      
      console.log("Using user ID for subscription:", actualUserId);
      console.log("Original authData user ID:", authData.user.id);
      console.log("Current session user ID:", currentUser.user?.id);

      // Determine status based on community type
      let subscriptionStatus: 'active' | 'inactive' | 'pending';
      
      if (community.type === 'private') {
        // Private communities always require approval regardless of price
        subscriptionStatus = 'pending';
      } else {
        // Public communities: free = active, paid = pending
        subscriptionStatus = (community.price && community.price > 0 ? 'pending' : 'active') as 'active' | 'inactive' | 'pending';
      }

      const subscriptionData = {
        user_uuid: actualUserId,
        community_uuid: id,
        expert_uuid: community.expert_uuid, // Fixed: changed from expert_user_uuid
        email: email,
        status: subscriptionStatus,
        type: (community.price && community.price > 0 ? 'paid' : 'free') as 'free' | 'paid',
        amount: community.price || 0,
      };

      console.log("Creating community subscription:", subscriptionData);

      const { data: subscriptionResult, error: subscriptionError } = await supabase
        .from('community_subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (subscriptionError) {
        console.error("Subscription error:", subscriptionError);
        toast.error("Failed to create community subscription. Please contact support.");
        return;
      }

      console.log("Community subscription created:", subscriptionResult);

      // Store user info for payment flow
      setUserCreated({ id: actualUserId, email: email });

      if (community.type === 'private') {
        toast.success("Account created! Your join request has been submitted and is awaiting approval.");
        navigate(`/community/${id}`);
      } else if (community.price && community.price > 0) {
        // For paid communities, show payment checkout instead of redirecting
        toast.success("Account created! Please complete payment to access the community.");
        setShowPaymentCheckout(true);
      } else {
        toast.success("Welcome! You've successfully joined the community.");
        navigate(`/community/${id}`);
      }

    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatButtonText = (price?: number, type?: string) => {
    if (type === 'private') return "Request to Join";
    if (!price || price === 0) return "Join for Free";
    return `Join for $${price} / monthly`;
  };

  const handlePaymentSuccess = (data: { subscriptionId: string; communityId: string; customerEmail: string }) => {
    console.log('Community subscription payment successful:', data);
    toast.success("Welcome! Your subscription is now active.");
    navigate(`/community/${id}`);
  };

  const handlePaymentCancel = () => {
    setShowPaymentCheckout(false);
    toast.info("Payment cancelled. You can try again anytime.", { duration: 5000 });
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        toast.error("Failed to resend confirmation email. Please try again.");
        console.error("Resend email error:", error);
      } else {
        toast.success("Confirmation email resent! Please check your inbox.");
      }
    } catch (error) {
      console.error("Resend email error:", error);
      toast.error("Failed to resend confirmation email. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !community) {
    return <NotFoundState />;
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Panel - Community Info */}
        <div className="bg-white flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-lg">
            <CommunityInfoPanel community={community} mode="sign-up" />
          </div>
        </div>

        {/* Right Panel - Sign Up Form or Payment */}
        <div className="bg-gray-50 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            {!showPaymentCheckout ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Create your account
                    </h2>
                    <p className="text-xs text-gray-500">
                      Join the community and unlock exclusive content
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="First Name"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-9 h-10 text-sm border-gray-200 focus:border-primary"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Last Name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-9 h-10 text-sm border-gray-200 focus:border-primary"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-10 text-sm border-gray-200 focus:border-primary"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9 h-10 text-sm border-gray-200 focus:border-primary"
                        required
                        disabled={isSubmitting}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        className="mt-0.5"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="terms"
                        className="text-xs text-gray-600 leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link to="#" className="text-primary hover:underline font-medium">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="#" className="text-primary hover:underline font-medium">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 text-sm font-medium"
                      disabled={!agreeToTerms || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        formatButtonText(community.price, community.type)
                      )}
                    </Button>

                    <div className="text-center text-xs border-t pt-4">
                      <span className="text-gray-600">Already have an account? </span>
                      <Link to={`/sign-in/community/${id}`} className="text-primary hover:underline font-medium">
                        Sign In
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Complete Payment
                    </h2>
                    <p className="text-xs text-gray-500">
                      Secure payment to join {community.title}
                    </p>
                  </div>
                  
                  <CommunitySubscriptionCheckout
                    community={{
                      community_uuid: community.community_uuid,
                      name: community.title,
                      description: community.description,
                      thumbnail: community.expert?.thumbnail || community.thumbnail
                    }}
                    pricing={{
                      community_price_uuid: '', // This will be set to null in the component
                      amount: community.price || 0,
                      currency: 'usd',
                      billing_period: 'monthly'
                    }}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </div>
              </div>
            )}

            {/* Powered by Plaze.ai branding */}
            <div className="flex items-center justify-center pt-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 italic">Powered by</span>
                <img 
                  src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" 
                  alt="Plaze.ai" 
                  className="h-3 w-auto opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
