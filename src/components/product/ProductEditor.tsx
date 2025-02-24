
import React from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Link as LinkIcon, List, Image, Video, MoreHorizontal, Code } from "lucide-react";

interface ProductEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function ProductEditor({ value, onChange }: ProductEditorProps) {
  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-1 border-b p-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-2" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        className="w-full min-h-[200px] resize-none border-0 bg-transparent p-4 focus:outline-none"
        placeholder="Write your product description..."
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
