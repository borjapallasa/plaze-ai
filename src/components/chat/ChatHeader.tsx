
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Pin, 
  Archive, 
  UserPlus, 
  Flag, 
  MoreVertical 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Conversation } from "@/hooks/use-conversations";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  selectedChat: Conversation;
  onBackClick: () => void;
  onPinChat: () => void;
  onArchiveChat: () => void;
  onInviteUser: () => void;
  onReportChat: () => void;
  isUpdating: boolean;
}

export function ChatHeader({ 
  selectedChat, 
  onBackClick, 
  onPinChat, 
  onArchiveChat, 
  onInviteUser, 
  onReportChat,
  isUpdating 
}: ChatHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="px-4 md:px-6 py-4 border-b flex items-center justify-between bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-1 md:hidden" onClick={onBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10 ring-2 ring-background">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold leading-none mb-1">{selectedChat.otherParticipantName}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${selectedChat.online ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            {selectedChat.online ? "Active now" : "Offline"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total messages: {selectedChat.message_count}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md">
            <DropdownMenuItem 
              onClick={onPinChat} 
              className="cursor-pointer"
              disabled={isUpdating}
            >
              <Pin className="mr-2 h-4 w-4" />
              Pin
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onArchiveChat} 
              className="cursor-pointer"
              disabled={isUpdating}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onInviteUser} className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onReportChat} 
              className="cursor-pointer text-red-600"
              disabled={isUpdating}
            >
              <Flag className="mr-2 h-4 w-4" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
