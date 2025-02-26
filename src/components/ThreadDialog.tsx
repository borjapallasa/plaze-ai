
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Heart, Send, ThumbsUp } from "lucide-react";
import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  thread?: any;
}

export function ThreadDialog({ isOpen, onClose, thread }: ThreadDialogProps) {
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

  // Handle upvote click
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
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="w-full">
            {/* Thread Header */}
            <div className="flex justify-between items-start mb-4 pr-8">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <h2 className="text-lg font-semibold leading-tight">{thread.title}</h2>
                  <div className="text-sm text-muted-foreground leading-none">
                    Created by {thread.user_name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Messages: {thread.number_messages || 0}</Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleUpvote}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{thread.upvote_count || 0}</span>
                </Button>
              </div>
            </div>
              
            {/* Initial Message */}
            <div className="space-y-3 mt-4 bg-muted/50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{thread.initial_message}</p>
            </div>

            {/* Thread Messages */}
            <div className="space-y-4 mt-6">
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
                  <Card key={message.thread_message_uuid} className="p-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>{message.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{message.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">No messages yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t p-3">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <textarea
                  placeholder="Write a comment..."
                  className="w-full min-h-[36px] max-h-[150px] rounded-full border border-input bg-background px-3 py-1.5 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring overflow-hidden"
                  rows={1}
                  onInput={handleTextareaInput}
                />
              </div>
              <Button 
                size="icon" 
                className="h-8 w-8 rounded-full shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
