
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { LoadingState } from "@/components/community/signin/LoadingState";
import { NotFoundState } from "@/components/community/signin/NotFoundState";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchCommunity(communityId: string) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('community_uuid', communityId)
    .single();

  if (error) throw error;
  return data;
}

export default function SignUpCommunityPage() {
  const { id } = useParams<{ id: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const { data: community, isLoading, error } = useQuery({
    queryKey: ['community', id],
    queryFn: () => fetchCommunity(id!),
    enabled: !!id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up attempt with:", { email, password, firstName, lastName, communityId: id });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !community) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Panel - Community Info */}
        <div className="bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            <CommunityInfoPanel community={community} />
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="space-y-8">
                <div className="text-center">
                  <img
                    src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png"
                    alt="Plaze.ai"
                    className="h-8 mx-auto mb-6"
                  />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Join {community.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Create your account to get started
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-600 leading-relaxed"
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
                    className="w-full h-12 text-base font-medium"
                    disabled={!agreeToTerms}
                  >
                    Create Account
                  </Button>

                  <div className="text-center text-sm border-t pt-6">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to={`/sign-in/community/${id}`} className="text-primary hover:underline font-medium">
                      Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
