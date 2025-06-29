
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
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

export default function SignInCommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: community, isLoading, error } = useQuery({
    queryKey: ['community', id],
    queryFn: () => fetchCommunity(id!),
    enabled: !!id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!community || !id) {
      toast.error("Community not found");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting sign in process for community:", id);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast.error(authError.message);
        return;
      }

      if (!authData.user) {
        toast.error("Failed to sign in");
        return;
      }

      console.log("User signed in successfully:", authData.user.id);

      toast.success("Welcome back! You've successfully signed in.");
      
      navigate(`/community/${id}`);

    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <div className="bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <CommunityInfoPanel community={community} mode="sign-in" />
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="bg-gray-50 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Welcome back
                  </h2>
                  <p className="text-xs text-gray-600">
                    Sign in to continue your journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-primary"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="text-center text-sm border-t pt-6">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to={`/sign-up/community/${id}`} className="text-primary hover:underline font-medium">
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Powered by Plaze.ai branding */}
            <div className="flex items-center justify-center pt-6">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400 italic">Powered by</span>
                <img 
                  src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" 
                  alt="Plaze.ai" 
                  className="h-4 w-auto opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
