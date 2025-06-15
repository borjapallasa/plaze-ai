
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateOrganizationProps {
  team?: string[] | null;
  industries?: string[] | null;
  platform?: string[] | null;
  useCase?: string[] | null;
}

export function TemplateOrganization({ 
  team, 
  industries, 
  platform, 
  useCase 
}: TemplateOrganizationProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Organization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Teams */}
        <div className="space-y-2">
          <Label htmlFor="team">Teams</Label>
          <div className="relative">
            <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {team && Array.isArray(team) && team.map((teamItem: string) => (
                  <Badge key={teamItem} variant="secondary" className="px-2 py-1">
                    {teamItem}
                  </Badge>
                ))}
                {selectedTeams.map((teamItem) => (
                  <Badge
                    key={teamItem}
                    variant="secondary"
                    className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                    onClick={() => setSelectedTeams(selectedTeams.filter(t => t !== teamItem))}
                  >
                    {teamItem}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
                {((!team || !Array.isArray(team) || team.length === 0) && selectedTeams.length === 0) && (
                  <Select
                    defaultValue=""
                    onValueChange={(value) => {
                      if (!selectedTeams.includes(value)) {
                        setSelectedTeams([...selectedTeams, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[100px] focus:ring-0" hideIndicator>
                      <SelectValue placeholder="Add team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team1">Team 1</SelectItem>
                      <SelectItem value="team2">Team 2</SelectItem>
                      <SelectItem value="team3">Team 3</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Industries */}
        <div className="space-y-2">
          <Label htmlFor="industries">Industries</Label>
          <div className="relative">
            <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {industries && Array.isArray(industries) && industries.map((industry: string) => (
                  <Badge key={industry} variant="secondary" className="px-2 py-1">
                    {industry}
                  </Badge>
                ))}
                {selectedIndustries.map((industry) => (
                  <Badge
                    key={industry}
                    variant="secondary"
                    className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                    onClick={() => setSelectedIndustries(selectedIndustries.filter(i => i !== industry))}
                  >
                    {industry}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
                {((!industries || !Array.isArray(industries) || industries.length === 0) && selectedIndustries.length === 0) && (
                  <Select
                    defaultValue=""
                    onValueChange={(value) => {
                      if (!selectedIndustries.includes(value)) {
                        setSelectedIndustries([...selectedIndustries, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[120px] focus:ring-0" hideIndicator>
                      <SelectValue placeholder="Add industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-2">
          <Label htmlFor="platform">Platforms</Label>
          <div className="relative">
            <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {platform && Array.isArray(platform) && platform.map((platformItem: string) => (
                  <Badge key={platformItem} variant="secondary" className="px-2 py-1">
                    {platformItem}
                  </Badge>
                ))}
                {selectedPlatforms.map((platformItem) => (
                  <Badge
                    key={platformItem}
                    variant="secondary"
                    className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                    onClick={() => setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformItem))}
                  >
                    {platformItem}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
                {((!platform || !Array.isArray(platform) || platform.length === 0) && selectedPlatforms.length === 0) && (
                  <Select
                    defaultValue=""
                    onValueChange={(value) => {
                      if (!selectedPlatforms.includes(value)) {
                        setSelectedPlatforms([...selectedPlatforms, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[120px] focus:ring-0" hideIndicator>
                      <SelectValue placeholder="Add platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="wordpress">WordPress</SelectItem>
                      <SelectItem value="wix">Wix</SelectItem>
                      <SelectItem value="webflow">Webflow</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-2">
          <Label htmlFor="useCase">Use Cases</Label>
          <div className="relative">
            <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {useCase && Array.isArray(useCase) && useCase.map((useCaseItem: string) => (
                  <Badge key={useCaseItem} variant="secondary" className="px-2 py-1">
                    {useCaseItem}
                  </Badge>
                ))}
                {selectedUseCases.map((useCaseItem) => (
                  <Badge
                    key={useCaseItem}
                    variant="secondary"
                    className="px-2 py-1 hover:bg-destructive/20 cursor-pointer"
                    onClick={() => setSelectedUseCases(selectedUseCases.filter(u => u !== useCaseItem))}
                  >
                    {useCaseItem}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
                {((!useCase || !Array.isArray(useCase) || useCase.length === 0) && selectedUseCases.length === 0) && (
                  <Select
                    defaultValue=""
                    onValueChange={(value) => {
                      if (!selectedUseCases.includes(value)) {
                        setSelectedUseCases([...selectedUseCases, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="border-0 bg-transparent p-0 h-6 w-[120px] focus:ring-0" hideIndicator>
                      <SelectValue placeholder="Add use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automation">Automation</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
