
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageSquare, Heart, Send, ThumbsUp, X, Star, Clock } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface ThreadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  thread?: any;
  communityUuid?: string;
}

export function ThreadDialog({ isOpen, onClose, thread, communityUuid }: ThreadDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Query thread messages with user info
  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['thread-messages', thread?.thread_uuid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads_messages')
        .select(`
          *,
          user:user_uuid(
            user_uuid,
            first_name,
            last_name
          )
        `)
        .eq('thread_uuid', thread?.thread_uuid)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!thread?.thread_uuid
  });

  // Get current user's name for display
  const { data: currentUserData } = useQuery({
    queryKey: ['current-user-name', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching current user data:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages load or change
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Scroll to bottom when thread dialog opens
  useEffect(() => {
    if (isOpen && thread) {
      // Small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, thread]);

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
            message: message.trim()
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

      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);

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

  if (!thread) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 bg-gradient-to-br from-slate-50 to-white">
        {/* Header Area */}
        <div className="flex items-start justify-between p-6 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20 shadow-lg">
                <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-semibold">
                  {thread.user ? getDisplayName(thread.user).substring(0, 2).toUpperCase() : 'AN'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1 leading-tight">{thread.title}</h2>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm text-gray-600">
                  Started by <span className="font-medium text-gray-900">
                    {thread.user ? getDisplayName(thread.user) : 'Anonymous'}
                  </span>
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {new Date(thread.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="h-6 bg-primary/10 text-primary border-primary/20">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {thread.number_messages || 0} replies
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1.5 hover:bg-primary/10 text-gray-600 hover:text-primary transition-colors"
                  onClick={handleUpvote}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{thread.upvote_count || 0}</span>
                </Button>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
          {/* Initial Post */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200/60 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30 text-primary uppercase text-[10px] tracking-wider font-medium">
                <Star className="mr-1 h-3 w-3" />
                Original Post
              </Badge>
            </div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {thread.user ? getDisplayName(thread.user).substring(0, 2).toUpperCase() : 'AN'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {thread.user ? getDisplayName(thread.user) : 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">Thread Author</p>
                </div>
                <time className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  {new Date(thread.created_at).toLocaleString()}
                </time>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {thread.initial_message}
              </p>
            </div>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-gray-500 uppercase tracking-wider font-medium bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
              <MessageSquare className="h-4 w-4" />
              <span>{messages?.length || 0} Replies</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            
            {isMessagesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-4 bg-white p-4 rounded-xl border border-gray-200/60">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/4 bg-gray-200 rounded" />
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <Card 
                  key={message.thread_message_uuid} 
                  className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/60 transition-all hover:bg-white hover:shadow-md hover:border-gray-300/80 rounded-xl"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700">
                        {message.user ? getDisplayName(message.user).substring(0, 2).toUpperCase() : 'AN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {message.user ? getDisplayName(message.user) : 'Anonymous'}
                          </p>
                          <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
                            #{index + 1}
                          </Badge>
                        </div>
                        <time className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                          {new Date(message.created_at).toLocaleString()}
                        </time>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No replies yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to join the conversation!</p>
              </div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Area */}
        <div className="border-t border-gray-200/60 p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {currentUserData?.first_name?.substring(0, 2).toUpperCase() || 'ME'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts..."
                  className="w-full min-h-[52px] max-h-[200px] rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 placeholder:text-gray-500 transition-all duration-200"
                  rows={1}
                  onInput={handleTextareaInput}
                />
              </div>
              <Button 
                size="icon"
                className="h-12 w-12 rounded-full shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
