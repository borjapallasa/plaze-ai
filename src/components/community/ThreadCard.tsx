
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Archive, ArchiveRestore } from "lucide-react";
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

  const isArchived = thread.status === 'closed';

  return (
    <Card 
      className={`group hover:bg-accent transition-colors cursor-pointer ${
        isArchived ? 'border-muted bg-muted/30' : ''
      }`}
      onClick={() => onThreadClick(thread)}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${isArchived ? 'text-muted-foreground' : ''}`}>
                {thread.title}
                {isArchived && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Archived
                  </Badge>
                )}
              </h3>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleArchiveClick}
                  disabled={updateThread.isPending}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className={`text-sm ${isArchived ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              Created by {thread.user_name}
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs w-fit">
                Messages: {thread.number_messages || 0}
              </Badge>
              {thread.tag && (
                <Badge variant="outline" className="text-xs w-fit">{thread.tag}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className={`line-clamp-3 ${isArchived ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
            {thread.initial_message}
          </p>
          
          <div className="flex justify-between items-end">
            <div className={`text-sm ${isArchived ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              Last Message: {thread.last_message_at ? new Date(thread.last_message_at).toLocaleString() : 'No messages yet'}
            </div>
            <Badge variant="outline" className="flex items-center gap-1 w-fit">
              <ThumbsUp className="w-3 h-3" />
              {thread.upvote_count || 0}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
