
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Heart, Send, ThumbsUp, X, Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  thread?: any;
}

export function ThreadDialog({ isOpen, onClose, thread }: ThreadDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !thread) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from('threads_messages')
        .insert([
          {
            thread_uuid: thread.thread_uuid,
            user_uuid: user.id,
            message: message.trim(),
            user_name: user.email // Using email as fallback, you might want to use a proper display name
          }
        ]);

      if (error) throw error;

      // Update the messages count in the thread
      await supabase
        .from('threads')
        .update({ 
          number_messages: (thread.number_messages || 0) + 1 
        })
        .eq('thread_uuid', thread.thread_uuid);

      // Clear the message input
      setMessage("");
      
      // Invalidate the query to refresh the messages
      queryClient.invalidateQueries(['thread-messages', thread.thread_uuid]);

      toast({
        description: "Message sent successfully!",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Auto-resize textarea function
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!thread) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 bg-[#F9FAFB]">
        {/* Header Area */}
        <div className="flex items-start justify-between p-6 border-b bg-white">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-[#9b87f5]/20 shadow-sm">
              <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#111827]">{thread.title}</h2>
              <p className="text-sm text-[#6B7280]">
                Posted by <span className="text-[#9b87f5]">{thread.user_name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-6 bg-white border-[#E5E7EB]">
              <MessageSquare className="mr-1 h-3 w-3 text-[#6B7280]" />
              {thread.number_messages || 0}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#9b87f5]"
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{thread.upvote_count || 0}</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F9FAFB]">
          {/* Initial Post */}
          <div className="rounded-lg bg-[#F3F0FA] p-6 shadow-sm border border-[#9b87f5]/20 hover:border-[#9b87f5]/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="bg-white/80 border-[#9b87f5]/30 text-[#6B7280] uppercase text-[10px] tracking-wider font-medium">
                <Star className="mr-1 h-3 w-3 text-[#9b87f5]" />
                Thread Starter
              </Badge>
            </div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#9b87f5]/10">
              <Avatar className="h-10 w-10 ring-2 ring-white">
                <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">{thread.user_name}</p>
                  <p className="text-xs text-[#6B7280]">Author</p>
                </div>
                <time className="text-xs text-[#6B7280]">
                  {new Date(thread.created_at).toLocaleString()}
                </time>
              </div>
            </div>
            <p className="text-base leading-relaxed text-[#1F2937] whitespace-pre-wrap">
              {thread.initial_message}
            </p>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#6B7280] uppercase tracking-wider font-medium">
              <MessageSquare className="h-3 w-3" />
              <span>{messages?.length || 0} Replies</span>
            </div>
            
            {isMessagesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-8 h-8 bg-[#E5E7EB] rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 bg-[#E5E7EB] rounded" />
                      <div className="h-4 w-3/4 bg-[#E5E7EB] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <Card 
                  key={message.thread_message_uuid} 
                  className="p-4 bg-white border border-[#E5E7EB] transition-all hover:bg-[#F3F4F6] hover:border-[#9b87f5]/10"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{message.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#1F2937]">
                          {message.user_name}
                        </p>
                        <time className="text-xs text-[#6B7280]">
                          {new Date(message.created_at).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm leading-relaxed text-[#1F2937] whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-[#9b87f5]/30" />
                <p className="text-sm text-[#6B7280]">No replies yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="border-t border-[#E5E7EB] p-4 bg-white">
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
                  onKeyPress={handleKeyPress}
                  placeholder="Write a reply..."
                  className="w-full min-h-[40px] max-h-[160px] rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9b87f5] placeholder:text-[#6B7280]"
                  rows={1}
                  onInput={handleTextareaInput}
                />
              </div>
              <Button 
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white"
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
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
