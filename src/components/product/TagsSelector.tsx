
import React from "react";
import { X } from "lucide-react";

interface TagsSelectorProps {
  items: string[];
}

export function TagsSelector({ items }: TagsSelectorProps) {
  if (items.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5 max-w-full">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-md text-sm relative isolate cursor-pointer group"
        >
          {item}
          <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100" />
        </span>
      ))}
    </div>
  );
}
