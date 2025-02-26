
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Heart, Send, ThumbsUp, X } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  thread?: any;
}

export function ThreadDialog({ isOpen, onClose, thread }: ThreadDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  // Query thread messages
  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['thread-messages', thread?.thread_uuid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads_messages')
        .select('*')
        .eq('thread_uuid', thread?.thread_uuid)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!thread?.thread_uuid
  });

  const handleUpvote = async () => {
    if (!thread) return;
    
    const { data, error } = await supabase
      .from('threads')
      .update({ 
        upvote_count: (thread.upvote_count || 0) + 1 
      })
      .eq('thread_uuid', thread.thread_uuid);

    if (error) {
      console.error('Error updating upvote:', error);
    }
  };

  // Auto-resize textarea function
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  if (!thread) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 bg-background">
        {/* Header Area */}
        <div className="flex items-start justify-between p-6 border-b bg-background/95">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
              <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{thread.title}</h2>
              <p className="text-sm text-muted-foreground">
                Posted by {thread.user_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-6 bg-background/80">
              <MessageSquare className="mr-1 h-3 w-3" />
              {thread.number_messages || 0}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 hover:bg-accent"
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{thread.upvote_count || 0}</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-accent/10">
          {/* Initial Post */}
          <div className="rounded-lg bg-card p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b">
              <Avatar className="h-8 w-8">
                <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex justify-between items-center">
                <p className="text-sm font-medium">{thread.user_name}</p>
                <time className="text-xs text-muted-foreground">
                  {new Date(thread.created_at).toLocaleString()}
                </time>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {thread.initial_message}
            </p>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            {isMessagesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <Card 
                  key={message.thread_message_uuid} 
                  className="p-4 transition-colors hover:bg-accent/5 border-muted/40"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{message.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {message.user_name}
                        </p>
                        <time className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No messages yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="border-t p-4 bg-background/90">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full min-h-[40px] max-h-[160px] rounded-full border bg-background px-4 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground/70"
                  rows={1}
                  onInput={handleTextareaInput}
                />
              </div>
              <Button 
                size="icon"
                className="h-9 w-9 rounded-full shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
