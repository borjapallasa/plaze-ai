
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
            user_name: user.email
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
      
      // Invalidate the query with proper type
      queryClient.invalidateQueries({
        queryKey: ['thread-messages', thread.thread_uuid]
      });

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
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 bg-white">
        {/* Header Area */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-black/10 shadow-sm">
              <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
              <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-black">{thread.title}</h2>
              <p className="text-sm text-gray-500">
                Posted by <span className="text-black">{thread.user_name}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-6 bg-white border-gray-200">
              <MessageSquare className="mr-1 h-3 w-3 text-gray-500" />
              {thread.number_messages || 0}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 hover:bg-gray-100 text-gray-500 hover:text-black"
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{thread.upvote_count || 0}</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
          {/* Initial Post - Consolidated container */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:border-black/20 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-white/80 border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider font-medium">
                <Star className="mr-1 h-3 w-3 text-black" />
                Thread Starter
              </Badge>
            </div>
            
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-white">
                <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback>{thread.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className="text-sm font-medium text-black">{thread.user_name}</p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                  <time className="text-xs text-gray-500">
                    {new Date(thread.created_at).toLocaleString()}
                  </time>
                </div>
                
                <div className="mt-4">
                  <p className="text-base leading-relaxed text-black whitespace-pre-wrap">
                    {thread.initial_message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-medium">
              <MessageSquare className="h-3 w-3" />
              <span>{messages?.length || 0} Replies</span>
            </div>
            
            {isMessagesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 bg-gray-200 rounded" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <Card 
                  key={message.thread_message_uuid} 
                  className="p-4 bg-white border border-gray-200 transition-all hover:bg-gray-50 hover:border-black/10"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{message.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-black">
                          {message.user_name}
                        </p>
                        <time className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm leading-relaxed text-black whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">No replies yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
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
                  className="w-full min-h-[40px] max-h-[160px] rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black placeholder:text-gray-500"
                  rows={1}
                  onInput={handleTextareaInput}
                />
              </div>
              <Button 
                size="icon"
                className="h-9 w-9 rounded-full shrink-0 bg-black hover:bg-black/90 text-white"
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
