
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ChatWidget() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative hover:bg-accent rounded-full"
      aria-label="Open chats"
      asChild
    >
      <Link to="/chats">
        <MessageCircle className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
      </Link>
    </Button>
  );
}
