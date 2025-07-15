
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatDialog } from "@/components/chat/ChatDialog";

interface ChatButtonProps {
  expertUuid: string;
  expertName: string;
}

export function ChatButton({ expertUuid, expertName }: ChatButtonProps) {
  return (
    <ChatDialog />
  );
}
