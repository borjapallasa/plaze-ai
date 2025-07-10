import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThreadDialog } from "@/components/ThreadDialog";
import { 
  MessageSquare, 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Users, 
  ThumbsUp,
  ArrowLeft,
  Settings,
  Bell,
  Bookmark
} from "lucide-react";
import { toast } from "sonner";

export default function Community() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false);
  const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadMessage, setNewThreadMessage] = useState("");
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  // Fetch community details
  const { data: community, isLoading: isCommunityLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('community_uuid', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch threads for this community
  const { data: threads, isLoading: isThreadsLoading } = useQuery({
    queryKey: ['community-threads', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          user:user_uuid(
            user_uuid,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('community_uuid', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id
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

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadMessage.trim() || !user || !id) return;

    setIsCreatingThread(true);
    try {
      // Get user's display name
      const displayName = currentUserData?.first_name && currentUserData?.last_name
        ? `${currentUserData.first_name} ${currentUserData.last_name}`.trim()
        : currentUserData?.first_name || user.email?.split('@')[0] || 'Anonymous';

      const { data, error } = await supabase
        .from('threads')
        .insert([
          {
            title: newThreadTitle.trim(),
            initial_message: newThreadMessage.trim(),
            user_uuid: user.id,
            community_uuid: id,
            user_name: displayName
          }
        ]);

      if (error) throw error;

      // Clear form and close dialog
      setNewThreadTitle("");
      setNewThreadMessage("");
      setIsCreateThreadOpen(false);
      
      toast.success("Thread created successfully!");
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error("Failed to create thread. Please try again.");
    } finally {
      setIsCreatingThread(false);
    }
  };

  const handleThreadClick = (thread: any) => {
    setSelectedThread(thread);
    setIsThreadDialogOpen(true);
  };

  // Helper function to get display name
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

  if (isCommunityLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Community not found</h1>
          <Button onClick={() => navigate('/communities')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Communities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/communities')}
                className="text-gray-500 hover:text-black"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Communities
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={community.image_url || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-black">{community.name}</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Community Info */}
              <Card className="p-6 bg-white border border-gray-200">
                <div className="text-center mb-4">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarImage src={community.image_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback className="text-lg">
                      {community.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold text-black">{community.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{community.description}</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Members</span>
                    <span className="font-medium text-black">{community.member_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Threads</span>
                    <span className="font-medium text-black">{threads?.length || 0}</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-4 bg-white border border-gray-200">
                <h3 className="font-medium text-black mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-black">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Trending
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-black">
                    <Clock className="mr-2 h-4 w-4" />
                    Recent
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-black">
                    <Users className="mr-2 h-4 w-4" />
                    Members
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search threads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80 bg-white border-gray-200 focus:border-black"
                    />
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <Dialog open={isCreateThreadOpen} onOpenChange={setIsCreateThreadOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black hover:bg-black/90 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      New Thread
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Thread</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Thread Title
                        </label>
                        <Input
                          placeholder="Enter thread title..."
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                          className="border-gray-200 focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Initial Message
                        </label>
                        <Textarea
                          placeholder="Start the conversation..."
                          value={newThreadMessage}
                          onChange={(e) => setNewThreadMessage(e.target.value)}
                          className="min-h-[120px] border-gray-200 focus:border-black resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCreateThreadOpen(false)}
                          disabled={isCreatingThread}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateThread}
                          disabled={isCreatingThread || !newThreadTitle.trim() || !newThreadMessage.trim()}
                          className="bg-black hover:bg-black/90 text-white"
                        >
                          {isCreatingThread ? "Creating..." : "Create Thread"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Threads List */}
              <div className="space-y-4">
                {isThreadsLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Card key={i} className="p-6 animate-pulse">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : threads && threads.length > 0 ? (
                  threads
                    .filter(thread => 
                      searchQuery === "" || 
                      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      thread.initial_message.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((thread) => (
                      <Card 
                        key={thread.thread_uuid} 
                        className="p-6 bg-white border border-gray-200 hover:border-black/20 transition-all cursor-pointer hover:shadow-sm"
                        onClick={() => handleThreadClick(thread)}
                      >
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 ring-2 ring-white">
                            <AvatarImage src={thread.user?.avatar_url || "https://github.com/shadcn.png"} />
                            <AvatarFallback>
                              {thread.user ? getDisplayName(thread.user).substring(0, 2).toUpperCase() : 'AN'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-black mb-1 line-clamp-1">
                                  {thread.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Posted by <span className="text-black font-medium">
                                    {thread.user ? getDisplayName(thread.user) : getDisplayNameFromUserName(thread.user_name)}
                                  </span> • {new Date(thread.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                <Badge variant="outline" className="bg-white border-gray-200">
                                  <MessageSquare className="mr-1 h-3 w-3 text-gray-500" />
                                  {thread.number_messages || 0}
                                </Badge>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-1.5 hover:bg-gray-100 text-gray-500 hover:text-black"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle upvote
                                  }}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{thread.upvote_count || 0}</span>
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-700 line-clamp-2 leading-relaxed">
                              {thread.initial_message}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No threads yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to start a conversation in this community!</p>
                    <Button 
                      onClick={() => setIsCreateThreadOpen(true)}
                      className="bg-black hover:bg-black/90 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Thread
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thread Dialog */}
      <ThreadDialog 
        isOpen={isThreadDialogOpen} 
        onClose={() => setIsThreadDialogOpen(false)} 
        thread={selectedThread}
        communityUuid={id}
      />
    </div>
  );
}
