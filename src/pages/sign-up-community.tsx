
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { LoadingState } from "@/components/community/signin/LoadingState";
import { NotFoundState } from "@/components/community/signin/NotFoundState";
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
        toast.error(authError.message);
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create user account");
        return;
      }

      console.log("User created successfully:", authData.user.id);

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
        user_uuid: authData.user.id,
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

      if (community.type === 'private') {
        toast.success("Account created! Your join request has been submitted and is awaiting approval.");
      } else if (community.price && community.price > 0) {
        toast.success("Account created! Please complete payment to access the community.");
      } else {
        toast.success("Welcome! You've successfully joined the community.");
      }
      
      navigate(`/community/${id}`);

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
    return `Join for $${price}`;
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

        {/* Right Panel - Sign Up Form */}
        <div className="bg-gray-50 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
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
