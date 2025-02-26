
import React from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductOrganizationProps {
  industries: string[];
  useCases: string[];
  platform: string[];
  team: string[];
  onIndustryChange: (value: string) => void;
  onUseCaseChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onTeamChange: (value: string) => void;
  renderSelectedTags: (items: string[]) => React.ReactNode;
}

export function ProductOrganization({
  industries,
  useCases,
  platform,
  team,
  onIndustryChange,
  onUseCaseChange,
  onPlatformChange,
  onTeamChange,
  renderSelectedTags,
}: ProductOrganizationProps) {
  return (
    <Card className="p-3 sm:p-6">
      <h2 className="text-lg font-medium mb-3 sm:mb-4">Product Organization</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="industries" className="text-sm mb-1.5">Industries</Label>
          <Select
            value=""
            onValueChange={onIndustryChange}
          >
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(industries) || <SelectValue placeholder="Select industries" />}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="use_case" className="text-sm mb-1.5">Use Case</Label>
          <Select
            value=""
            onValueChange={onUseCaseChange}
          >
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(useCases) || <SelectValue placeholder="Select use cases" />}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Blog">Blog</SelectItem>
                <SelectItem value="Portfolio">Portfolio</SelectItem>
                <SelectItem value="Dashboard">Dashboard</SelectItem>
                <SelectItem value="Social Network">Social Network</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
                <SelectItem value="CMS">CMS</SelectItem>
                <SelectItem value="Authentication">Authentication</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="platform" className="text-sm mb-1.5">Platform</Label>
          <Select
            value=""
            onValueChange={onPlatformChange}
          >
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(platform) || <SelectValue placeholder="Select platforms" />}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Desktop">Desktop</SelectItem>
                <SelectItem value="iOS">iOS</SelectItem>
                <SelectItem value="Android">Android</SelectItem>
                <SelectItem value="Windows">Windows</SelectItem>
                <SelectItem value="macOS">macOS</SelectItem>
                <SelectItem value="Linux">Linux</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="team" className="text-sm mb-1.5">Team</Label>
          <Select
            value=""
            onValueChange={onTeamChange}
          >
            <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
              {renderSelectedTags(team) || <SelectValue placeholder="Select team roles" />}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                <SelectItem value="QA Engineer">QA Engineer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
