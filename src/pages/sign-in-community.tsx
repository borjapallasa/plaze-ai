
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SignInCommunity() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          toast.error("Community ID is missing");
          return;
        }

        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('community_uuid', id)
          .single();

        if (error) {
          console.error("Error fetching community:", error);
          toast.error("Failed to load community information");
          return;
        }

        if (!data) {
          toast.error("Community not found");
          navigate("/communities");
          return;
        }

        setCommunity(data);
      } catch (error) {
        console.error("Error fetching community:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in attempt with:", { email, password });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Community Not Found</h2>
          <p className="text-muted-foreground mb-4">The community you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/communities")}>Browse Communities</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back to{" "}
              <span className="text-primary">{community.name || "our community"}!</span>
            </h1>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-lg border">
                <AvatarImage src={community.thumbnail || "https://images.unsplash.com/photo-1517022812141-23620dba5c23"} alt={`${community.name} thumbnail`} />
                <AvatarFallback>{community.name?.substring(0, 3)?.toUpperCase() || "COM"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{community.name}</h2>
                <p className="text-sm text-muted-foreground">
                  This community is hosted by {community.expert_name || "an expert host"}.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {community.description || "Welcome back to your community. Sign in to continue your journey."}
              </p>
            </Card>

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

              <div className="text-center space-y-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <Link to="/sign-up/community" className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </div>
                <div>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Reset password
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
