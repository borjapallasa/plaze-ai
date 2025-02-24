
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProductOrganizationDetailsProps {
  industries: string[];
  useCases: string[];
  platform: string[];
  team: string[];
  onIndustryChange: (value: string) => void;
  onUseCaseChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onTeamChange: (value: string) => void;
}

const INDUSTRIES = ["E-commerce", "Blog", "Portfolio", "Dashboard", "Social Network", "Analytics", "CMS", "Authentication"];
const USE_CASES = ["E-commerce", "Blog", "Portfolio", "Dashboard", "Social Network", "Analytics", "CMS", "Authentication"];
const PLATFORMS = ["Web", "Mobile", "Desktop", "iOS", "Android", "Windows", "macOS", "Linux"];
const TEAM_ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "Product Manager", "DevOps Engineer", "QA Engineer"];

export function ProductOrganizationDetails({
  industries,
  useCases,
  platform,
  team,
  onIndustryChange,
  onUseCaseChange,
  onPlatformChange,
  onTeamChange,
}: ProductOrganizationDetailsProps) {
  const renderSelectedTags = (items: string[], onChange: (value: string) => void) => {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 max-w-full">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-md text-sm relative isolate cursor-pointer group"
          >
            {item}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(item);
              }}
              className="hover:text-primary-foreground relative z-10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div
              className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            />
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-3 sm:p-6">
      <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Organization</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="industries" className="text-sm mb-1.5">
            Industries
          </Label>
          <Select value="" onValueChange={onIndustryChange}>
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(industries, onIndustryChange) || (
                <SelectValue placeholder="Select industries" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="use_case" className="text-sm mb-1.5">
            Use Case
          </Label>
          <Select value="" onValueChange={onUseCaseChange}>
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(useCases, onUseCaseChange) || (
                <SelectValue placeholder="Select use cases" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {USE_CASES.map((useCase) => (
                  <SelectItem key={useCase} value={useCase}>
                    {useCase}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="platform" className="text-sm mb-1.5">
            Platform
          </Label>
          <Select value="" onValueChange={onPlatformChange}>
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(platform, onPlatformChange) || (
                <SelectValue placeholder="Select platforms" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="team" className="text-sm mb-1.5">
            Team
          </Label>
          <Select value="" onValueChange={onTeamChange}>
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(team, onTeamChange) || (
                <SelectValue placeholder="Select team roles" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TEAM_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
