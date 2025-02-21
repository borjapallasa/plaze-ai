
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpCommunity() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up attempt with:", { email, password, firstName, lastName });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              You've been invited to{" "}
              <span className="text-[#356DED]">join this community!</span>
            </h1>
            <h2 className="text-2xl font-semibold mb-4">Optimal Path Automations</h2>
            <p className="text-muted-foreground">This community is host by Borja P.</p>
          </div>

          <div className="space-y-4">
            <p>
              Imagine a spot where we all get together to chat about making our businesses run
              smoother with some automation magic and no-code shortcuts.{" "}
              <span className="font-medium">Here's what you'll get by joining:</span>
            </p>

            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="font-semibold">Win Back Your Weekdays</span> - Spend time on what truly grows your business.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">Elevate Your Team's Game</span> - Simple tools, incredible results.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">Economize Effortlessly</span> - Invest in growth, not unnecessary expenses.
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">Future-Proof Your Business</span> - Adapt and thrive in the digital age.
              </li>
            </ul>
          </div>
        </div>

        <Card className="w-full p-8 space-y-6">
          <div className="flex justify-center mb-4">
            <img
              src="/public/lovable-uploads/ee8e4525-4a77-4294-b3a5-b8cf02b5351d.png"
              alt="NoCodeClick Logo"
              className="h-8"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                <Link to="#" className="text-[#356DED] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-[#356DED] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/sign-in" className="text-[#356DED] hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
