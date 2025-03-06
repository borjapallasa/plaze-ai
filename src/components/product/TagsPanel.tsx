
import React from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TagsPanelProps {
  title: string;
  items: string[];
  options: string[];
  value?: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  renderSelectedTags: (items: string[]) => React.ReactNode;
}

export function TagsPanel({
  title,
  items,
  options,
  placeholder,
  onValueChange,
  renderSelectedTags
}: TagsPanelProps) {
  return (
    <div>
      <Label htmlFor={title.toLowerCase()} className="text-sm mb-1.5">{title}</Label>
      <Select
        value=""
        onValueChange={onValueChange}
      >
        <SelectTrigger className="h-auto min-h-[2.75rem] py-1.5 px-3">
          {renderSelectedTags(items) || <SelectValue placeholder={placeholder} />}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem 
                key={option} 
                value={option}
              >
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
