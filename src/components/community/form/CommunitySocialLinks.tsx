
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface CommunitySocialLinksProps {
  links: { platform: string; url: string }[];
  onLinkChange: (index: number, field: "platform" | "url", value: string) => void;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
}

export function CommunitySocialLinks({
  links,
  onLinkChange,
  onAddLink,
  onRemoveLink
}: CommunitySocialLinksProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 sm:p-6">
      <div className="mb-4">
        <Label className="text-base font-medium">Social Links</Label>
        <p className="text-sm text-muted-foreground mt-1">Add links to your social media profiles</p>
      </div>
      
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="grid grid-cols-[1fr,auto] gap-2">
            <div className="space-y-2">
              <Input
                placeholder="Platform (e.g., Twitter, Instagram)"
                value={link.platform}
                onChange={(e) => onLinkChange(index, "platform", e.target.value)}
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => onLinkChange(index, "url", e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveLink(index)}
              className="self-center"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddLink}
          className="w-full mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>
    </div>
  );
}
