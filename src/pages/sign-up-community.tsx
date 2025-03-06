
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { LoadingState } from "@/components/community/signin/LoadingState";

export default function SignUpCommunityPage() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [community, setCommunity] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Simulate loading the community data
  useState(() => {
    setTimeout(() => {
      setCommunity({
        name: "Optimal Path Automations",
        expert_name: "Borja P.",
        thumbnail: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
        description: "Imagine a spot where we all get together to chat about making our businesses run smoother with some automation magic and no-code shortcuts."
      });
      setIsLoading(false);
    }, 1000);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up attempt with:", { email, password, firstName, lastName, communityId: id });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Community not found</h1>
          <p className="text-muted-foreground mt-2">The community you're looking for doesn't exist or you don't have access.</p>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
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
