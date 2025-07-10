
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Archive, ArchiveRestore, MessageSquare, Clock } from "lucide-react";
import { useUpdateThread } from "@/hooks/use-update-thread";

interface ThreadCardProps {
  thread: any;
  isOwner: boolean;
  onThreadClick: (thread: any) => void;
}

export function ThreadCard({ thread, isOwner, onThreadClick }: ThreadCardProps) {
  const updateThread = useUpdateThread();

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newStatus = thread.status === 'closed' ? 'open' : 'closed';
    updateThread.mutate({
      threadUuid: thread.thread_uuid,
      updates: { status: newStatus }
    });
  };

  // Helper function to get display name from user data
  const getDisplayName = (user: any) => {
    if (!user) return 'Anonymous';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`.trim();
    }
    
    if (user.first_name) {
      return user.first_name;
    }
    
    return 'Anonymous';
  };

  // Helper function to get display name from user_name field (fallback)
  const getDisplayNameFromUserName = (userName: string | null | undefined) => {
    if (!userName) return 'Anonymous';
    
    // If it looks like an email, extract the part before @
    if (userName.includes('@')) {
      return userName.split('@')[0];
    }
    
    return userName;
  };

  const isArchived = thread.status === 'closed';
  const displayName = thread.user ? getDisplayName(thread.user) : getDisplayNameFromUserName(thread.user_name);

  return (
    <Card 
      className={`group hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 ${
        isArchived ? 'border-l-red-300 bg-muted/30 opacity-75' : 'border-l-primary hover:border-l-primary/80'
      }`}
      onClick={() => onThreadClick(thread)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {displayName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-lg leading-tight ${
                    isArchived ? 'text-muted-foreground' : 'text-foreground'
                  } truncate`}>
                    {thread.title}
                  </h3>
                  {isArchived && (
                    <Badge variant="warning" className="text-xs flex-shrink-0">
                      Archived
                    </Badge>
                  )}
                </div>
                
                <p className={`text-sm ${isArchived ? 'text-muted-foreground' : 'text-muted-foreground'} mb-2`}>
                  Created by {displayName}
                </p>
                
                {/* Tags and Message Count */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {thread.number_messages || 0}
                  </Badge>
                  {thread.tag && (
                    <Badge variant="outline" className="text-xs">{thread.tag}</Badge>
                  )}
                </div>
              </div>
            </div>

            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleArchiveClick}
                disabled={updateThread.isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                {isArchived ? (
                  <>
                    <ArchiveRestore className="w-4 h-4 mr-1" />
                    Restore
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Content Preview */}
          {thread.initial_message && (
            <div className={`pl-13 ${isArchived ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              <p className="text-sm line-clamp-2 leading-relaxed">
                {thread.initial_message}
              </p>
            </div>
          )}
          
          {/* Footer Section */}
          <div className="flex items-center justify-between pl-13">
            <div className={`flex items-center gap-1 text-xs ${
              isArchived ? 'text-muted-foreground' : 'text-muted-foreground'
            }`}>
              <Clock className="w-3 h-3" />
              <span>
                {thread.last_message_at 
                  ? new Date(thread.last_message_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No messages yet'
                }
              </span>
            </div>
            
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <ThumbsUp className="w-3 h-3" />
              {thread.upvote_count || 0}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
