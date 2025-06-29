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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        <CommunityInfoPanel community={community} />

        <div className="w-full p-8 rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="space-y-8">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="h-8 mx-auto"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link to="#" className="text-primary hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!agreeToTerms}
              >
                Sign Up
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to={`/sign-in/community/${id}`} className="text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
