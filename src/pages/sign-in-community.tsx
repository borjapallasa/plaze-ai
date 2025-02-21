
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function SignInCommunity() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back to{" "}
              <span className="text-primary">our community!</span>
            </h1>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-lg border">
                <AvatarImage src="https://images.unsplash.com/photo-1517022812141-23620dba5c23" alt="Community thumbnail" />
                <AvatarFallback>OPA</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Optimal Path Automations</h2>
                <p className="text-sm text-muted-foreground">This community is host by Borja P.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm">
              Welcome back to your community of business automation enthusiasts.
              Sign in to continue your journey towards operational excellence.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="font-semibold">Connect with Peers</span> - Share insights and learn from others' experiences.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">Access Resources</span> - Get the latest tools and strategies.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">Stay Updated</span> - Never miss important community updates.
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">Get Support</span> - Direct access to our community of experts.
              </li>
            </ul>
          </div>
        </div>

        <Card className="w-full p-8">
          <div className="space-y-8">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="h-8 mx-auto"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button
                type="submit"
                className="w-full"
              >
                Sign In
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/sign-up/community" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
