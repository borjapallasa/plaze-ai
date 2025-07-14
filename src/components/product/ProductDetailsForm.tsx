
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ProductDetailsFormProps {
  techStack: string;
  setTechStack: (value: string) => void;
  techStackPrice: string;
  setTechStackPrice: (value: string) => void;
  difficultyLevel: string;
  setDifficultyLevel: (value: string) => void;
  industries: string[];
  setIndustries: (value: string[]) => void;
  useCases: string[];
  setUseCases: (value: string[]) => void;
  platform: string[];
  setPlatform: (value: string[]) => void;
  team: string[];
  setTeam: (value: string[]) => void;
}

const INDUSTRIES = [
  "E-commerce",
  "Healthcare", 
  "Finance",
  "Education",
  "Real Estate",
  "Technology",
  "Marketing",
  "Non-profit",
];

const USE_CASES = [
  "E-commerce",
  "Blog", 
  "Portfolio",
  "Dashboard",
  "Social Network",
  "Analytics",
  "CMS",
  "Authentication",
];

const PLATFORMS = [
  "Web",
  "Mobile",
  "Desktop",
  "iOS",
  "Android",
  "Windows",
  "macOS",
  "Linux",
];

const TEAM_ROLES = [
  "Frontend Developer",
  "Backend Developer", 
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "QA Engineer",
];

export function ProductDetailsForm({
  techStack,
  setTechStack,
  techStackPrice,
  setTechStackPrice,
  difficultyLevel,
  setDifficultyLevel,
  industries,
  setIndustries,
  useCases,
  setUseCases,
  platform,
  setPlatform,
  team,
  setTeam,
}: ProductDetailsFormProps) {
  const handleIndustryChange = (value: string) => {
    if (!industries.includes(value)) {
      setIndustries([...industries, value]);
    }
  };

  const handleUseCaseChange = (value: string) => {
    if (!useCases.includes(value)) {
      setUseCases([...useCases, value]);
    }
  };

  const handlePlatformChange = (value: string) => {
    if (!platform.includes(value)) {
      setPlatform([...platform, value]);
    }
  };

  const handleTeamChange = (value: string) => {
    if (!team.includes(value)) {
      setTeam([...team, value]);
    }
  };

  const removeItem = (items: string[], setItems: (items: string[]) => void, item: string) => {
    setItems(items.filter(i => i !== item));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Technical Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tech-stack">Tech Stack</Label>
          <Input
            id="tech-stack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tech-stack-price">Tech Stack Price</Label>
          <Input
            id="tech-stack-price"
            value={techStackPrice}
            onChange={(e) => setTechStackPrice(e.target.value)}
            placeholder="$299"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty-level">Difficulty Level</Label>
        <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Industries</Label>
          <Select onValueChange={handleIndustryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {industries.map(industry => (
              <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                {industry}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem(industries, setIndustries, industry)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Use Cases</Label>
          <Select onValueChange={handleUseCaseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add use case" />
            </SelectTrigger>
            <SelectContent>
              {USE_CASES.map(useCase => (
                <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {useCases.map(useCase => (
              <Badge key={useCase} variant="secondary" className="flex items-center gap-1">
                {useCase}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem(useCases, setUseCases, useCase)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Platform</Label>
          <Select onValueChange={handlePlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map(plat => (
                <SelectItem key={plat} value={plat}>{plat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {platform.map(plat => (
              <Badge key={plat} variant="secondary" className="flex items-center gap-1">
                {plat}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem(platform, setPlatform, plat)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Team</Label>
          <Select onValueChange={handleTeamChange}>
            <SelectTrigger>
              <SelectValue placeholder="Add team role" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_ROLES.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1">
            {team.map(role => (
              <Badge key={role} variant="secondary" className="flex items-center gap-1">
                {role}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeItem(team, setTeam, role)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
